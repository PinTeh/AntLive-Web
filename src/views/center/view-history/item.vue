<template>
  <div class="item">
    <span>{{ name }}</span>
    <img :src="todo" alt="" />
  </div>
</template>

<script setup>
const propsObj = defineProps({
  name: String,
  cover: String,
})
</script>

<style lang="scss" scoped>
.item {
  height: 140px;
  width: 242px;
  // border: 1px solid blue;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  span {
    position: absolute;
    bottom: 0;
    color: #fff;
  }
}
.item :hover {
  transition: all 0.8s;
}
</style>
