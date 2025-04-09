<template>
  <div class="chat-wrapper">
    <div class="chat-header">
      <div class="rank-item" v-for="item in rank" :key="item.userId">
        <img class="avatar" :src="item.avatar" />
        <span class="name">{{ item.nickName }}</span>
        <span class="charm">{{ item.charm }}</span>
      </div>
    </div>
    <div class="chat-main" ref="scrollContainer" @scroll="handleScroll">
      <a-list size="small" :data-source="data">
        <template #renderItem="{ item }">
          <a-list-item><MessageItem :data="item" /></a-list-item>
        </template>
      </a-list>
    </div>
    <div class="chat-footer">
      <a-flex vertical>
        <a-textarea
          class="chat-box"
          v-model:value="messageText"
          :placeholder="isLogin ? '发个弹幕呗～' : '需要登陆才能发送弹幕哦～'"
          show-count
          :maxlength="20"
          :disabled="!isLogin"
          :auto-size="{ minRows: 2, maxRows: 2 }" />
        <div class="chat-btn-wrapper">
          <span class="popularity">{{ popularity || 0 }}人在线</span>
          <a-button type="primary" size="small" @click="handleMessageSend" :disabled="!isLogin">发送</a-button>
        </div>
      </a-flex>
    </div>
  </div>
</template>

<script setup>
import MessageItem from "./MessageItem.vue"
import { onBeforeMount, onMounted, ref, computed, nextTick, watch, onBeforeUnmount } from "vue"
import { useStore } from "@/stores"
import ChatApi from "@/api/chat"

const props = defineProps({
  roomId: {
    type: Number,
    default: null,
  },
})

const emits = defineEmits(["sendGift"])

const maxReconnectCount = ref(50)
const lockReconnect = ref(false)
const scrollContainer = ref(null)
const isUserScrolling = ref(false)
const roomId = computed(() => props.roomId)
const store = useStore()
const isLogin = useStore().user().isLogin
const popularity = ref(1)

const rank = ref([
  {
    userId: 1,
    nickName: "小老虎",
    avatar: "http://q1.qlogo.cn/g?b=qq&nk=363353005&s=100",
    charm: 826,
  },
  {
    userId: 2,
    nickName: "那个叫啥啥",
    avatar: "http://q1.qlogo.cn/g?b=qq&nk=794409767&s=100",
    charm: 1396,
  },
  {
    userId: 3,
    nickName: "飞哥",
    avatar: "http://q1.qlogo.cn/g?b=qq&nk=1109956029&s=100",
    charm: 126,
  },
])

let websocket = null
const reconnectTimer = ref()
const heartBeatTimer = ref()
const popularityInterval = ref()

const messageText = ref("")

const data = ref([])

onMounted(async () => {
  initWebSocket()
  getPopularity()
})

onBeforeMount(() => {
  websocket && websocket.close()
})

onBeforeUnmount(() => {
  close()
})

watch(data, () => {
  if (!isUserScrolling.value) {
    scrollToBottom()
  }
})

const scrollToBottom = () => {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    }
  })
}

const handleScroll = () => {}

/**
 * 发送消息
 */
const handleMessageSend = () => {
  if (messageText.value.trim() === "") {
    return
  }
  let text = messageText.value.trim()
  messageText.value = ""
  ChatApi.sendChatMsg({
    roomId: roomId.value,
    text,
  })
}

/**
 * 获取人气
 */
const getPopularity = () => {
  popularityInterval.value = setInterval(async () => {
    let res = await ChatApi.getPopularity({ roomId: roomId.value })
    popularity.value = res.data
  }, 2000)
}

/**
 * 初始化 WebSocket连接
 */
const initWebSocket = () => {
  let wsUrl = "ws://" + location.hostname + ":10022?token=" + encodeURIComponent(store.user().userToken)
  websocket = new WebSocket(wsUrl)
  websocket.onopen = () => {
    console.log("WebSocket连接成功!")
    connetRoom()
    // 开启跳包
    heartBeat()
  }
  websocket.onclose = (e) => {
    if (e.code === 1000) {
      // 服务端主动断开，不需要重连
      return
    }
    if (e.code === 1005) {
      // 手动关闭，不需要重连
      return
    }
    reconnectWebSocket()
  }
  websocket.onerror = () => {
    // WebSocket连接时发生错误
  }
  websocket.onmessage = (event) => {
    console.log("Message from server:", event.data)
    let message = JSON.parse(event.data)
    // 处理礼物
    if (message.method === "giftMessage") {
      emits("sendGift", message.data)
      return
    }
    data.value = data.value.concat(message.data)
    // 裁剪消息列表长度
    if (data.value.length > 40) {
      data.value = data.value.slice(-40)
    }
  }
}

/**
 * 连接房间
 */
const connetRoom = () => {
  let reqBody = {
    msgType: 0,
    data: {
      roomId: roomId.value,
    },
  }
  if (websocket) {
    websocket.send(JSON.stringify(reqBody))
  }
}

/**
 * 发送心跳包
 */
const heartBeat = () => {
  heartBeatTimer.value = setInterval(() => {
    if (websocket && websocket.readyState === 1) {
      websocket.send(JSON.stringify({ msgType: 2 }))
    }
  }, 9500)
}

/**
 * 重新连接websocket
 */
const reconnectWebSocket = () => {
  // 关闭心跳定时器
  heartBeatTimer.value && clearInterval(heartBeatTimer.value)
  heartBeatTimer.value = null
  // 关闭原来的重连定时器
  reconnectTimer.value && clearTimeout(reconnectTimer.value)
  reconnectTimer.value = null

  if (lockReconnect.value) {
    return
  }
  lockReconnect.value = true
  // 重连次数上限
  if (maxReconnectCount.value == 0) {
    return
  }
  // 重连
  reconnectTimer.value = setTimeout(() => {
    initWebSocket()
    maxReconnectCount.value--
    lockReconnect.value = false
  }, 5000)
}

const close = () => {
  websocket && websocket.close()
  heartBeatTimer.value && clearTimeout(heartBeatTimer.value)
  popularityInterval.value && clearInterval(popularityInterval.value)
  reconnectTimer.value && clearTimeout(reconnectTimer.value)
}
</script>

<style lang="scss" scoped>
.chat-wrapper {
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .chat-header {
    height: 120px;
    background-color: #fff;
    display: flex;
    .rank-item {
      flex: 1;
      height: 130px;
      text-align: center;
      .avatar {
        border: rgb(215, 215, 215) 2px solid;
        margin-top: 16px;
        border-radius: 50%;
        height: 45px;
      }
      .name {
        display: block;
        font-size: 12px;
        margin-top: 8px;
      }
      .charm {
        line-height: 25px;
        color: #ec8303;
        font-size: 12px;
      }
    }
    .rank-item:nth-child(2) {
      .avatar {
        border: gold 2px solid;
      }
    }
  }
  .chat-main {
    height: 480px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    ::v-deep .ant-list-item {
      padding: 5px 8px;
      border: none;
    }
  }
  .chat-footer {
    flex: 1;
    padding: 10px;
    .chat-box {
      width: 100%;
    }
    .chat-btn-wrapper {
      margin-top: 10px;
      text-align: right;
      ::v-deep .ant-btn {
        width: 75px;
        // color: $font-color-light;
      }
      .popularity {
        float: left;
        color: $font-color-light;
        font-size: 12px;
        margin: 5px 0px 0px 0px;
      }
    }
    ::v-deep .ant-input-textarea-show-count::after {
      position: absolute;
      top: 35px;
      right: 6px;
      font-size: 12px;
      color: $font-color-light;
    }
  }
}
</style>
