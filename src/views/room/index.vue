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
                <a-button class="flow-btn" size="small">关注</a-button>
              </a-flex>
              <a-flex> </a-flex>
            </a-flex>
            <div class="lower-row">
              <span class="live-describe">{{ roomInfo.introduce || "" }}</span>
              <span class="live-tag">{{ roomInfo.categoryInfo?.name || "" }}</span>
            </div>
          </div>
        </a-flex>
        <div class="room-play-main">
          <Player ref="playChild" v-if="roomInfo.status === 1" />
          <span note v-else>主播正在赶来的路上~</span>
        </div>
        <a-flex class="room-play-footer">
          <GiftList />
        </a-flex>
      </a-flex>
      <div class="room-chat">
        <ChatList :roomId="roomId" />
      </div>
    </a-flex>
  </a-flex>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import Player from "./Player.vue"
import ChatList from "./ChatList.vue"
import GiftList from "./GiftList.vue"
import roomApi from "@/api/room"

const router = useRouter()
const roomId = computed(() => {
  return router.currentRoute.value.params.id
})
const playChild = ref()
const roomInfo = ref({})

onMounted(async () => {
  getRoomInfo()
})

/**
 * 获取直播间信息
 */
const getRoomInfo = async () => {
  const res = await roomApi.getRoomInfo({
    rid: roomId.value,
  })
  roomInfo.value = res.data
}

const handleItemClick = () => {
  playChild.value.playSvga("svga/angel.svga")
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
        margin-left: 20px;
        .upper-row {
          .live-title {
            font-size: 16px;
            font-weight: bold;
          }
          .flow-btn {
            margin-left: 20px;
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
