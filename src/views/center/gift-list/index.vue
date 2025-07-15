<template>
  <div class="overview">
    <div class="result-list">
      <a-table :dataSource="dataSource" :columns="columns" :loading="loading" :pagination="pagination"
        @change="handleTableChange" size="small">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'fromUserNickname'">
            <a-flex align="center">
              <a-avatar v-if="record.fromUserAvatar" :size="25" :src="record.fromUserAvatar" alt="U" />
              <a-avatar v-else :size="20" style="color: #f56a00; background-color: #fde3cf">{{
                record.fromUserNickname.substring(0, 2) }}</a-avatar>
              <section style="width: 10px"></section>
              <span>{{ record.fromUserNickname }}</span>
            </a-flex>
          </template>
          <template v-if="column.key === 'presentName'">
            <a-flex align="center">
              <a-avatar :size="25" :src="record.presentIcon" alt="U" />
              <section style="width: 10px"></section>
              <span>{{ `${record.presentName} x ${record.number}` }}</span>
            </a-flex>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup>
import liveAPI from "@/api/live"
import giftApi from "@/api/gift"
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
  giftApi
    .getRewardRecords({
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
    title: "赠送人",
    dataIndex: "fromUserNickname",
    key: "fromUserNickname",
  },
  {
    title: "礼物",
    dataIndex: "presentName",
    key: "presentName",
  },
  {
    title: "礼物单价",
    dataIndex: "unitPrice",
    key: "unitPrice",
  },
  {
    title: "开心果总数",
    dataIndex: "totalPrice",
    key: "totalPrice",
  },
  {
    title: "赠送时间",
    dataIndex: "createTime",
    key: "createTime",
    width: 220
  }
])
</script>

<style scoped lang="scss">
.overview {
  background-color: #fff;
  padding: 15px;
}
</style>
