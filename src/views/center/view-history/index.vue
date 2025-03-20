<template>
  <div class="history">
    <a-page-header title="观看历史" sub-title="view history">
      <template #extra>
        <a-button key="1">清空记录</a-button>
      </template>
    </a-page-header>
    <a-spin :spinning="spinning">
      <div class="content">
        <a-flex wrap="wrap" gap="large" :style="{ padding: '0px 20px' }">
          <Item v-for="item in list" :key="item.id" :="item" />
        </a-flex>
      </div>
    </a-spin>

    <div class="page">
      <a-pagination v-model:current="current" :total="total" show-less-items />
    </div>
  </div>
</template>

<script setup>
import Item from "./item.vue"
import liveApi from "@/api/live"
import { onMounted, reactive, ref } from "vue"

const pageSize = 12
const current = ref(1)
const total = ref(0)
const list = reactive([])
const spinning = ref(false)

onMounted(() => {
  spinning.value = true
  liveApi
    .listHistory({
      type: 1,
      pageNo: current.value,
      pageSize,
    })
    .then((res) => {
      const { list: data, total: t } = res.data
      list.push(...data)
      total.value = t
      spinning.value = false
    })
})
</script>

<style scoped lang="scss">
.history {
  background-color: #fff;
  .content {
    min-height: 400px;
  }

  .page {
    height: 60px;
    padding-top: 25px;
    text-align: center;
  }
}
</style>
