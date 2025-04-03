<template>
  <div class="bill-wapper">
    <a-page-header title="交易记录" sub-title="Bill">
      <div class="result-list">
        <a-table
          :dataSource="dataSource"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          @change="handleTableChange"
          size="small" /></div
    ></a-page-header>
  </div>
</template>

<script setup>
import walletAPI from "@/api/wallet"
import { reactive, ref, computed, onMounted } from "vue"

// 属性定义
const loading = ref(false)
const total = ref(0)
const current = ref(1)
const pageSize = ref(10)
const pagination = computed(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
  size: "middle",
}))

// 方法定义
onMounted(() => {
  getData()
})

const getData = () => {
  walletAPI
    .listWalletLogs({
      pageNo: current.value,
      pageSize: pageSize.value,
    })
    .then((res) => {
      if (res.code === 0) {
        total.value = res.data.total
        dataSource.value = res.data.list
      }
    })
}

const handleTableChange = (pag, filters, sorter) => {
  current.value = pag.current
  pageSize.value = pag.pageSize
  getData()
}

// 常量定义
const dataSource = ref([])
const columns = reactive([
  {
    title: "序号",
    dataIndex: "index",
    customRender: ({ text, record, index, column }) => index + 1,
    width: 120,
  },
  {
    title: "变动金额",
    dataIndex: "fee",
    key: "fee",
    width: 300,
    customRender: ({ text, record, index, column }) => {
      return text > 0 ? `+${text}` : `-${text}`
    },
  },
  {
    title: "变动类型",
    dataIndex: "actionType",
    key: "actionType",
    width: 300,
  },
  {
    title: "时间",
    dataIndex: "createTime",
    key: "createTime",
  },
])
</script>

<style scoped lang="scss">
.bill-wapper {
  background-color: #fff;
  // padding: 15px;
}
</style>
