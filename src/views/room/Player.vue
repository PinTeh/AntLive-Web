<template>
  <div style="position: relative">
    <div id="svga-wrap"></div>
    <video id="videoElement" controls autoplay muted playsinline></video>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import SVGA from "svgaplayerweb"
import { message } from "ant-design-vue"
import flvjs from "flv.js"

const flvPlayer = ref(null)
const svgaPlayer = ref(null)
const svgaParser = ref(null)

const props = defineProps({
  roomId: {
    type: String,
    required: true,
  },
})

onMounted(() => {
  playLive()
  initSvga()
  // playSvga("svga/angel.svga")
})

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
defineExpose({ destroy, playSvga })
</script>

<style lang="scss" scoped>
#videoElement {
  width: 100%;
  height: 510px;
  object-fit: cover;
}
#svga-wrap {
  width: 100%;
  height: 510px;
  z-index: 999;
  position: absolute;
  top: 0;
  left: 0;
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
  //   display: none;
}
</style>
