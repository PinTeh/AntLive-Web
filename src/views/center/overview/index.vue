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
      <a-table :dataSource="dataSource" :columns="columns" :loading="loading" :pagination="pagination"
        @change="handleTableChange" size="small">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'clickCount'">
            <a-flex align="center">
              <LikeOutlined />
              <section style="width: 5px"></section>
              <span>{{ record.clickCount || '0' }}</span>
            </a-flex>
          </template>
          <template v-if="column.key === 'messageCount'">
            <a-flex align="center">
              <CommentOutlined />
              <section style="width: 5px"></section>
              <span>{{ record.messageCount || '0' }}</span>
            </a-flex>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup>
import { LikeOutlined, CommentOutlined } from "@ant-design/icons-vue"
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
    width: 80,
  },
  {
    title: "开始时间",
    dataIndex: "startTime",
    key: "startTime",
    width: 250,
  },
  {
    title: "结束时间",
    dataIndex: "endTime",
    key: "endTime",
    width: 250,
  },
  {
    title: "时长",
    dataIndex: "time",
    key: "time",
    width: 220,
    customRender: ({ text, record }) => {
      if (!record.endTime) return '-';
      const startTime = new Date(record.startTime).getTime();
      const endTime = new Date(record.endTime).getTime();
      const totalSeconds = Math.floor((endTime - startTime) / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return `${days ? days + '天' : ''}${hours ? hours + '时' : ''}${minutes ? minutes + '分' : ''}${seconds}秒`;
    },
  },
  {
    title: "点赞数",
    dataIndex: "clickCount",
    key: "clickCount",
    customRender: ({ text, record, index, column }) => text || 0,
  },
  {
    title: "评论数",
    dataIndex: "messageCount",
    key: "messageCount",
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
