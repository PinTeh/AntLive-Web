<template>
  <div class="item" @click="itemClick">
    <img class="cover" :src="cover" alt="" />
    <div class="info">
      <img class="avatar" :src="cover" alt="" />
      <span>{{ name || "未知主播" }}</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

const propsObj = defineProps({
  name: String,
  cover: String,
  roomId: Number,
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
