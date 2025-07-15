<template>
  <div class="search-wrapper">
    <a-form ref="formRef" class="ant-advanced-search-form" :model="formState" @finish="onFinish">
      <a-row :gutter="24">
        <a-col :span="6">
          <a-form-item name="id" label="用户标识">
            <a-input v-model:value="formState.id" placeholder="请输入用户标识" autocomplete=" off"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item name="username" label="用户名">
            <a-input v-model:value="formState.username" placeholder="请输入用户名" autocomplete="off"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item name="nickname" label="昵称">
            <a-input v-model:value="formState.nickname" placeholder="请输入用户昵称" autocomplete="off"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6" style="text-align: right">
          <a-button type="primary" html-type="submit">查询</a-button>
          <a-button style="margin: 0 8px" @click="handleReset">重置</a-button>
          <a style="font-size: 12px" @click="expand = !expand">
            <template v-if="expand">
              <UpOutlined />
            </template>
            <template v-else>
              <DownOutlined />
            </template>
            展开
          </a>
        </a-col>
      </a-row>
    </a-form>
  </div>
  <div class="content-wrapper">
    <a-table :scroll="{ x: 1200 }" :dataSource="dataSource" :columns="columns" :pagination="pagination" size="small"
      @change="handleTableChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'nickname'">
          <a-flex align="center">
            <a-avatar v-if="record.avatar" :size="25" :src="record.avatar" alt="U" />
            <a-avatar v-else :size="20" style="color: #f56a00; background-color: #fde3cf">{{
              record.nickname.substring(0, 2) }}</a-avatar>
            <section style="width: 10px"></section>
            <span>{{ record.nickname }}</span>
          </a-flex>
        </template>
        <template v-if="column.key === 'disabled'">
          <CellStatus :val="record.disabled" />
        </template>
        <template v-if="column.key === 'sex'">
          <CellSex :val="record.sex" />
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a-divider type="vertical" />
            <a>详情</a>
            <a-divider type="vertical" />
            <a>修改</a>
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { UpOutlined, DownOutlined } from "@ant-design/icons-vue"
import { onMounted, ref, computed, reactive } from "vue"
import CellStatus from '@/components/Common/CellStatus.vue'
import CellSex from '@/components/Common/CellSex.vue'
import systemUserApi from "@/api/systemUser"

const expand = ref(false)
const formRef = ref()
const formState = reactive({})
const onFinish = (values) => {
  console.log("Received values of form: ", values)
  console.log("formState: ", formState)
  getData()
}

const total = ref(0)
const current = ref(1)
const pageSize = ref(10)
const pagination = computed(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
  size: "middle",
}))

onMounted(() => {
  getData()
})

const getData = () => {
  systemUserApi
    .getPageUsers({
      pageNo: current.value,
      pageSize: pageSize.value,
      ...formState,
    })
    .then((res) => {
      total.value = res.data.total
      dataSource.value = res.data.list
    })
}

const handleTableChange = (pag, filters, sorter) => {
  current.value = pag.current
  pageSize.value = pag.pageSize
  getData()
}
const handleReset = () => {
  formRef.value.resetFields()
  getData()
}

const dataSource = ref([])
const columns = ref([
  {
    title: "序号",
    dataIndex: "index",
    align: "center",
    customRender: ({ text, record, index, column }) => index + 1,
    width: 80,
    fixed: "left",
  },

  {
    title: "用户标识",
    dataIndex: "id",
    key: "id",
    width: 100,
    fixed: "left",
  },
  {
    title: "用户名",
    dataIndex: "username",
    key: "username",
    width: 180,
    fixed: "left",
  },
  {
    title: "昵称",
    dataIndex: "nickname",
    key: "nickname",
    width: 180
  },
  {
    title: "性别",
    dataIndex: "sex",
    key: "sex",
    width: 100
  },
  {
    title: "手机",
    dataIndex: "mobile",
    key: "mobile",
    width: 160
  },
  {
    title: "邮箱",
    dataIndex: "email",
    key: "email",
    width: 200
  },
  {
    title: "状态",
    dataIndex: "disabled",
    key: "disabled",
    width: 100
  },
  {
    title: "个性签名",
    dataIndex: "signature",
    key: "signature",
    width: 180
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
    width: 180
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    width: 120,
    fixed: "right",
  },
])
</script>

<style lang="scss" scoped>
.search-wrapper {
  .ant-advanced-search-form {
    .ant-form-item {
      margin-bottom: 0px;
    }
  }
}

.content-wrapper {
  margin-top: 20px;
}
</style>
