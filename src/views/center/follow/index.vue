<template>
  <div class="history">
    <a-page-header title="我的关注" sub-title="my follows"> </a-page-header>
    <a-spin :spinning="spinning">
      <div class="content">
        <a-flex wrap="wrap" gap="large" :style="{ padding: '0px 20px' }">
          <Item v-for="item in list" :key="item.id" :="item" />
        </a-flex>
        <a-empty description="暂无观看记录" v-if="!list.length" class="empty" />
      </div>
    </a-spin>
    <div class="page">
      <a-pagination :current="current" :total="total" show-less-items @change="onChange" :defaultPageSize="pageSize" />
    </div>
  </div>
</template>

<script setup>
import Item from "../view-history/item.vue"
import liveApi from "@/api/live"
import { onMounted, reactive, ref } from "vue"

const pageSize = 1
const current = ref(1)
const total = ref(0)
const list = reactive([])
const spinning = ref(false)

onMounted(() => {
  listData()
})

const listData = async () => {
  spinning.value = true
  const res = await liveApi.listHistory({ type: 1, page: current.value, limit: pageSize })
  const { list: data, total: totalNum } = res.data
  list.splice(0, list.length)
  if (data) {
    list.push(...data)
  }
  total.value = totalNum
  spinning.value = false
}

const onChange = (currentPageNo, currentPageSize) => {
  current.value = currentPageNo
  listData()
}
</script>

<style scoped lang="scss">
.history {
  background-color: #fff;
  .content {
    min-height: 340px;
    display: flex;
  }

  .page {
    height: 60px;
    padding-top: 25px;
    text-align: center;
  }
}
.empty {
  margin: auto;
  color: $font-color;
}
</style>
