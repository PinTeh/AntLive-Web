<template>
  <div class="item" @click="itemClick">
    <span class="legibility" v-if="liveStatus == 1"><PlayCircleOutlined /> 直播中 </span>
    <img class="cover" :src="cover" alt="" />
    <div class="info">
      <img class="avatar" :src="cover" alt="" />
      <span>{{ name || "未知主播" }}</span>
    </div>
  </div>
</template>

<script setup>
import { PlayCircleOutlined } from '@ant-design/icons-vue'
import { useRouter } from "vue-router"

const router = useRouter()

const propsObj = defineProps({
  name: String,
  cover: String,
  roomId: Number,
  liveStatus: Number,
})

const itemClick = () => {
  router.push("/room/" + propsObj.roomId)
}
</script>

<style lang="scss" scoped>
.item {
  height: 165px;
  width: 242px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border: 1px solid #f0f0f0;
  position: relative;

  .legibility {
    position: absolute;
    right: 7px;
    top: 7px;
    background-color: #b0fac3cc;
    padding: 0 5px;
    height: 20px;
    font-size: 10px;
    line-height: 20px;
    color: #016425;
    border-radius: 3px;
    text-align: center;
    display: inline-block;
  }

  .cover {
    width: 100%;
    height: 135px;
    object-fit: cover;
  }

  .info {
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: row;

    .avatar {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      margin: 0px 5px;
    }

    span {
      color: $font-color;
    }
  }
}

.item:hover {
  transition: all 0.3s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>
