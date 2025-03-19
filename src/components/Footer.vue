<script setup>
const handleClick = () => {
  window.open("https://beian.miit.gov.cn/", "_blank")
}
</script>

<template>
  <div class="footer">
    <span @click="handleClick()">Copyright © 2025 Ant-Live 版权所有 · 桂ICP备18010581号-1</span>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  height: 30px;
  text-align: center;
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
