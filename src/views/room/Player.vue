<template>
  <div style="position: relative">
    <video id="videoElement" controls autoplay muted playsinline></video>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { message } from "ant-design-vue"
import flvjs from "flv.js"

const flvPlayer = ref(null)

const props = defineProps({
  roomId: {
    type: String,
    required: true,
  },
})

onMounted(() => {
  playLive()
})

const playLive = () => {
  if (flvjs.isSupported()) {
    var videoElement = document.getElementById("videoElement")
    flvPlayer.value = flvjs.createPlayer({
      type: "flv",
      url: "http://127.0.0.1:8080/live/1.flv",
      isLive: true,
    })
    flvPlayer.value.attachMediaElement(videoElement)
    flvPlayer.value.load()

    setTimeout(function () {
      flvPlayer.value.play()
    }, 300)

    // 监听错误事件
    flvPlayer.value.on(flvjs.Events.ERROR, (err, errdet) => {
      // 参数 err 是一级异常，errdet 是二级异常
      if (err == flvjs.ErrorTypes.MEDIA_ERROR) {
        console.log("媒体错误")
        if (errdet == flvjs.ErrorDetails.MEDIA_FORMAT_UNSUPPORTED) {
          console.log("媒体格式不支持")
        }
      }
      if (err == flvjs.ErrorTypes.NETWORK_ERROR) {
        console.log("网络错误")
        if (errdet == flvjs.ErrorDetails.NETWORK_STATUS_CODE_INVALID) {
          console.log("http状态码异常")
        }
      }
      if (err == flvjs.ErrorTypes.OTHER_ERROR) {
        console.log("其他异常：", errdet)
      }
    })
  }
}

const fullPage = () => {
  let dom = document.querySelector("#videoElement")
  if (dom.requestFullscreen) {
    dom.requestFullscreen()
  } else if (dom.webkitRequestFullScreen) {
    dom.webkitRequestFullScreen()
  }
}

const destroy = () => {
  flvPlayer.value.pause()
  flvPlayer.value.unload()
  flvPlayer.value.detachMediaElement()
  flvPlayer.value.destroy()
  flvPlayer.value = null
}
defineExpose({ destroy })
</script>

<style lang="scss" scoped>
#videoElement {
  width: 100%;
  height: 510px;
  object-fit: cover;
}
/* 进度条 */
video::-webkit-media-controls-timeline {
  display: none;
}
/* 播放时间 */
video::-webkit-media-controls-current-time-display {
  display: none;
}
/*  播放按钮 */
video::-webkit-media-controls-play-button {
  display: none;
}
</style>
