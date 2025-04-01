<template>
  <a-modal class="stats-wrapper" v-model:open="modalOpen" @cancel="handleCancel" centered width="600px" :maskClosable="false">
    <template #footer> </template>
    <template #title> </template>
    <h2 title>直播已结束</h2>
    <h3>太棒了，努力就会有收获！</h3>
    <a-row justify="space-evenly">
      <a-col :span="4">
        <a-flex vertical justify="center" class="item">
          <span>0元</span>
          <span>开心果流水</span>
        </a-flex>
      </a-col>
      <a-col :span="4">
        <a-flex vertical justify="center" class="item">
          <span>0条</span>
          <span>弹幕数</span>
        </a-flex>
      </a-col>
      <a-col :span="4">
        <a-flex vertical justify="center" class="item">
          <span>0人</span>
          <span>累计观看</span>
        </a-flex>
      </a-col>
      <a-col :span="4">
        <a-flex vertical justify="center" class="item">
          <span>0秒</span>
          <span>直播时长</span>
        </a-flex>
      </a-col>
    </a-row>
    <h3>部分数据有统计延迟，请以结算为准</h3>
  </a-modal>
</template>

<script setup>
import { defineModel } from "vue"
const modalOpen = defineModel()

const handleCancel = () => {
  modalOpen.value = false
}
</script>

<style lang="scss" scoped>
.stats-wrapper {
  h2[title] {
    text-align: center;
    color: #666;
  }
  h3 {
    text-align: center;
    color: #666;
    margin: 20px 0px;
  }
  .item {
    height: 60px;
    width: 80px;
    span {
      display: block;
      text-align: center;
      font-size: 16px;
      color: #666;
    }
  }
}
</style>
