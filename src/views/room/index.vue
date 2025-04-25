<template>
  <a-flex class="room-wapper" justify="center">
    <a-flex class="room-main">
      <a-flex class="room-play" vertical>
        <a-flex class="room-play-header">
          <img class="avatar" :src="roomInfo?.userInfo?.avatar" alt="" />
          <div class="rows-content">
            <a-flex class="upper-row">
              <a-flex class="upper-row-left" align="center">
                <span class="live-title">{{ roomInfo.title }}</span>
              </a-flex>
              <a-flex class="upper-row-right">
                <a-button class="follow-btn" size="small" @click="handleFollowBtnClick">
                  {{ roomExtraInfo.follow ? "已关注" : "关注" }}
                </a-button>
              </a-flex>
            </a-flex>
            <div class="lower-row">
              <span class="live-describe">{{ roomInfo.introduce || "" }}</span>
              <span class="live-tag">{{ roomInfo.categoryInfo?.name || "" }}</span>
            </div>
          </div>
        </a-flex>
        <div class="room-play-main">
          <Player ref="playChild" v-if="roomInfo.status === 1" />
          <span note v-else @click="handleItemClick">主播正在赶来的路上~</span>
          <div id="svga-wrap"></div>
        </div>
        <a-flex class="room-play-footer">
          <GiftList :roomId="roomId" />
        </a-flex>
      </a-flex>
      <div class="room-chat">
        <ChatList :roomId="roomId" @sendGift="handleSendGift" />
      </div>
    </a-flex>
  </a-flex>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "@/stores"
import Player from "./Player.vue"
import ChatList from "./ChatList.vue"
import GiftList from "./GiftList.vue"
import roomApi from "@/api/room"
import watchApi from "@/api/watch"
import SVGA from "svgaplayerweb"

const router = useRouter()
const roomId = computed(() => {
  let id = router.currentRoute.value.params.id
  return Number(id)
})
const isLogin = computed(() => {
  return useStore().user().isLogin
})
const playChild = ref()
const roomInfo = ref({})
const roomExtraInfo = ref({})
const svgaPlayer = ref(null)
const svgaParser = ref(null)

onMounted(async () => {
  initSvga()
  getRoomInfo()
  if (isLogin.value) {
    getRoomExtraInfo()
    saveHistory()
  }
})

const handleFollowBtnClick = () => {
  if (roomExtraInfo.value.follow) {
    unFollow()
  } else {
    follow()
  }
}

const saveHistory = () => {
  watchApi.saveHistory({ roomId: roomId.value })
}

const follow = async () => {
  await watchApi.follow({ roomId: roomId.value })
  getRoomExtraInfo()
}

const unFollow = async () => {
  await watchApi.unFollow({ roomId: roomId.value })
  getRoomExtraInfo()
}

const initSvga = () => {
  svgaPlayer.value = new SVGA.Player("#svga-wrap")
  svgaParser.value = new SVGA.Parser("#svga-wrap")
}

const playSvga = (url) => {
  if (svgaPlayer.value) {
    svgaPlayer.value.clearAfterStop = true
    svgaPlayer.value.stopAnimation(true)
    svgaParser.value.load(url, (videoItem) => {
      svgaPlayer.value.loops = 1
      svgaPlayer.value.setVideoItem(videoItem)
      svgaPlayer.value.startAnimation()
      svgaPlayer.value.onFinished = () => {}
    })
  } else {
    message.error("init SVGA error")
  }
}

/**
 * 获取直播间信息
 */
const getRoomInfo = async () => {
  const res = await roomApi.getRoomInfo({
    roomId: roomId.value,
  })
  roomInfo.value = res.data
}

const getRoomExtraInfo = async () => {
  const res = await roomApi.getRoomExtraInfo({
    roomId: roomId.value,
  })
  roomExtraInfo.value = res.data
}

const handleItemClick = () => {
  playChild.value.playSvga("svga/angel.svga")
}

const handleSendGift = (item) => {
  // console.log(playChild.value)
  // playChild.value.playSvga("svga/angel.svga")
  playSvga("svga/angel.svga")
}
</script>

<style lang="scss" scoped>
.room-wapper {
  width: 1220px;
  margin: 0 auto;
  margin-top: 20px;
  .room-play {
    width: 900px;
    .room-play-header {
      height: 100px;
      padding: 20px;
      background-color: #fff;
      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
      }
      .rows-content {
        width: 100%;
        margin-left: 20px;
        .upper-row {
          width: 100%;
          .live-title {
            font-size: 16px;
            font-weight: bold;
          }
          .follow-btn {
            margin-left: 20px;
          }
          .upper-row-left {
            flex: 1;
          }
          .upper-row-right {
            width: 100px;
          }
        }
        .lower-row {
          margin-top: 10px;
          .live-describe {
            font-size: 14px;
            color: $font-color-light;
          }
          .live-tag {
            font-size: 14px;
            color: $font-color-light;
            margin-left: 20px;
          }
        }
      }
    }
    .room-play-main {
      height: 510px;
      background-color: #2a2a2a;
      position: relative;
      span[note] {
        color: #a4a4a4;
        font-size: 16px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .room-play-footer {
      background-color: #fff;
      height: 100px;
    }
  }
  .room-chat {
    width: 300px;
    margin-left: 10px;
  }
}
.gift-popover {
  background-color: red !important;
}
#svga-wrap {
  width: 100%;
  height: 510px;
  z-index: 999;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
<style lang="scss">
.gift-popover {
  .ant-popover-inner {
    padding: 10px;
    width: 300px;
    height: 120px;
  }
  img {
    width: 45px;
    height: 45px;
    object-fit: cover;
    margin-right: 10px;
  }
  span[name] {
    font-size: 16px;
    color: $font-color;
  }
  span[price] {
    font-size: 14px;
    color: orange;
    margin-left: 10px;
  }
  span[describe] {
    font-size: 12px;
    color: $font-color-light;
  }
  .ant-divider {
    margin: 10px 0px;
  }
  .ant-btn {
    width: 65px;
    margin-right: 10px;
  }
}
</style>
