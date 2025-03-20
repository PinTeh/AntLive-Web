<template>
  <div class="history">
    <a-page-header title="我的关注" sub-title="my follows">
      <template #extra>
        <a-button key="1">清空记录</a-button>
      </template>
    </a-page-header>
    <div class="content">
      <a-flex wrap="wrap" gap="large" :style="{ padding: '0px 20px' }">
        <div class="item" v-for="item in pageSize"></div>
      </a-flex>
    </div>
    <div class="page">
      <a-pagination v-model:current="current" :total="50" show-less-items />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const pageSize = 12

const current = ref(2)
</script>

<style scoped lang="scss">
.history {
  background-color: #fff;
  .content {
    min-height: 400px;
  }
  .item {
    height: 140px;
    width: 242px;
    border: 1px solid blue;
  }
  .page {
    height: 60px;
    padding-top: 25px;
    text-align: center;
  }
}
</style>
