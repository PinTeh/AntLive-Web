<template>
  <a-flex class="room-wapper" justify="center">
    <a-flex class="room-main">
      <a-flex class="room-play" vertical>
        <a-flex class="room-play-header">
          <img class="avatar" src="http://localhost:9000/live.file.bucket/c3590dd2037b4011a2a0b42922445212_1743422533.png" alt="" />
          <div class="rows-content">
            <a-flex class="upper-row">
              <a-flex class="upper-row-left" align="center">
                <span class="live-title">哔哩哔哩英雄联盟赛事</span>
                <a-button class="flow-btn" size="small">关注</a-button>
              </a-flex>
              <a-flex> </a-flex>
            </a-flex>
            <div class="lower-row">
              <span class="live-describe">【直播】IG vs FPX </span>
              <span class="live-tag">游戏赛事</span>
            </div>
          </div>
        </a-flex>
        <div class="room-play-main">
          <Player ref="playChild" />
        </div>
        <a-flex class="room-play-footer">
          <div class="gift-wrapper">
            <a-popover overlayClassName="gift-popover" placement="topLeft" trigger="hover" v-for="(item, index) in 5" :key="index">
              <template #content>
                <a-flex>
                  <img src="../../../src/assets/img/果汁-01.png" alt="" />
                  <a-flex vertical>
                    <div>
                      <span name>嘉年华</span>
                      <span price>1开心果</span>
                    </div>
                    <span describe>投喂即可加入主播的粉丝团</span>
                  </a-flex>
                </a-flex>
                <a-divider />
                <a-flex>
                  <a-button @click="handleItemClick">1个</a-button>
                  <a-button>10个</a-button>
                  <a-button>100个</a-button>
                </a-flex>
              </template>
              <div class="footer-item" vertical align="center">
                <img src="../../../src/assets/img/果汁-01.png" alt="" />
                <span name>嘉年华</span>
                <span price>1开心果</span>
              </div>
            </a-popover>
          </div>
          <a-divider type="vertical" style="height: 100%" />
          <div class="wallet-wrapper">
            <div class="footer-item" vertical align="center">
              <img src="../../../src/assets/img/开心果.png" alt="" />
              <span price style="margin-top: 10px">余额:0</span>
            </div>
          </div>
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

const router = useRouter()
const roomId = computed(() => {
  return router.currentRoute.value.params.id
})
const playChild = ref()

onMounted(() => {})

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
    }
    .room-play-footer {
      background-color: #fff;
      height: 100px;
      .gift-wrapper {
        flex: 1;
        display: flex;

        .footer-item:hover {
          background-color: #f5f5f5;
          cursor: pointer;
        }
      }
      .wallet-wrapper {
        width: 100px;
      }
      .footer-item {
        width: 90px;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        img {
          width: 40px;
          height: 40px;
          object-fit: cover;
        }
        span[name] {
          margin-top: 5px;
          font-size: 14px;
          color: $font-color;
        }
        span[price] {
          font-size: 12px;
          color: $font-color-light;
        }
      }
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
