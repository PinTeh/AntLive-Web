<script setup>
const handleClick = () => {
  window.open("https://beian.miit.gov.cn/", "_blank")
}
</script>

<template>
  <div class="footer">
    <span @click="handleClick()">桂ICP备18010581号-1</span>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  height: 30px;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  span {
    line-height: 30px;
    font-size: 10px;
    color: grey;
  }
  span:hover {
    cursor: pointer;
  }
}
</style>
