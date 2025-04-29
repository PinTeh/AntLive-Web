<template>
  <a-layout-header class="header">
    <a-flex>
      <div style="flex: 1"><MenuFoldBtn></MenuFoldBtn></div>
      <div><HeaderRightBar></HeaderRightBar></div>
    </a-flex>
  </a-layout-header>
</template>

<script setup>
import MenuFoldBtn from "../MenuFoldBtn.vue"
import HeaderRightBar from "../HeaderRightBar/index.vue"
</script>

<style lang="scss" scoped>
.header {
  padding: 0px 10px;
  background-color: #fff;
  border-bottom: 1px solid rgba(5, 5, 5, 0.06);
}
</style>
