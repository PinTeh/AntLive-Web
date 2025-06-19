<template>
  <div class="overview">
    <!-- <a-form ref="formRef" class="search-form" :model="formState" @finish="onFinish">
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item name="dateTime" label="时间范围">
            <a-input v-model:value="formState.dateTime" placeholder="placeholder"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="16" style="text-align: right">
          <a-button type="primary" html-type="submit">Search</a-button>
        </a-col>
      </a-row>
    </a-form> -->
    <div class="result-list">
      <a-table :dataSource="dataSource" :columns="columns" :loading="loading" :pagination="pagination" @change="handleTableChange" size="small" />
    </div>
  </div>
</template>

<script setup>
import liveAPI from "@/api/live"
import { reactive, ref, computed, onMounted } from "vue"

// 属性定义
const expand = ref(false)
const formRef = ref()
const formState = reactive({
  dateTime: "",
})
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
  liveAPI
    .getLiveStatInfo({
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
const onFinish = (values) => {
  console.log("Received values of form: ", values)
  console.log("formState: ", formState)
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
    title: "开始时间",
    dataIndex: "startTime",
    key: "startTime",
    width: 300,
  },
  {
    title: "结束时间",
    dataIndex: "endTime",
    key: "endTime",
    width: 300,
  },
  {
    title: "时长(秒)",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "点赞数",
    dataIndex: "clickCount",
    key: "clickCount",
    customRender: ({ text, record, index, column }) => text || 0,
  },
  {
    title: "评论数",
    dataIndex: "danMuCount",
    key: "danMuCount",
    customRender: ({ text, record, index, column }) => text || 0,
  },
])
</script>

<style scoped lang="scss">
.overview {
  background-color: #fff;
  padding: 15px;
}
</style>
