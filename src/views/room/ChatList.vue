<template>
  <div class="chat-wrapper">
    <div class="chat-header"></div>
    <div class="chat-main">
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
          placeholder="发个弹幕呗～"
          show-count
          :maxlength="20"
          :auto-size="{ minRows: 2, maxRows: 2 }" />
        <div class="chat-btn-wrapper">
          <a-button size="small" @click="handleMessageSend">发送</a-button>
        </div>
      </a-flex>
    </div>
  </div>
</template>

<script setup>
import MessageItem from "./MessageItem.vue"
import { onBeforeMount, onMounted, ref, computed } from "vue"
import { useStore } from "@/stores"
import ChatApi from "@/api/chat"

const props = defineProps({
  roomId: {
    type: Number,
    default: null,
  },
})

const roomId = computed(() => props.roomId)
const store = useStore()

let websocket = null
let heartBeatTimer = null

const messageText = ref("")

const data = ref([])

onMounted(async () => {
  console.log(props, "props")
  await initWebSocket()
})

onBeforeMount(() => {
  websocket && websocket.close()
})

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
 * 初始化 WebSocket连接
 */
const initWebSocket = async () => {
  let wsUrl = "ws://" + location.hostname + ":10022?token=" + encodeURIComponent(store.user().userToken)
  websocket = new WebSocket(wsUrl)
  websocket.onopen = () => {
    console.log("WebSocket connection opened")
    connetRoom()
    // 开启跳包
    heartBeat()
  }
  websocket.onmessage = (event) => {
    console.log("Message from server:", event.data)
    let message = JSON.parse(event.data)
    data.value = data.value.concat(message.data)
  }
  websocket.onclose = () => {
    reconnectWebSocket()
  }
}

/**
 * 连接房间
 */
const connetRoom = () => {
  let reqBody = {
    msgType: 0,
    data: {
      // TODO: 这里需要传入房间号
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
  heartBeatTimer = setTimeout(() => {
    if (websocket && websocket.readyState === 1) {
      websocket.send(JSON.stringify({ msgType: 2 }))
      heartBeatReset()
    } else {
      reconnectWebSocket()
    }
  }, 5000)
}

const heartBeatReset = () => {
  heartBeatTimer && clearTimeout(heartBeatTimer)
  heartBeat()
}

const reconnectWebSocket = () => {
  setTimeout(() => {
    console.log("Reconnecting WebSocket...")
    initWebSocket()
  }, 2000)
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
    background-color: #35966a;
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
        color: $font-color-light;
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
