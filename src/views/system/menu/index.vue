<template>
  <div class="search-wrapper">
    <a-form ref="formRef" class="ant-advanced-search-form" :model="formState" @finish="onFinish">
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item name="name" label="名称">
            <a-input v-model:value="formState.name" placeholder="请输入名称" autocomplete="off"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="16" style="text-align: right">
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
    <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" size="small" @change="handleTableChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'icon'">
          <a-flex align="center">
            <SvgIcon :="{ icon: record.icon, size: '15px' }" />
            <section style="width: 10px"></section>
            <span>{{ record.icon }}</span>
          </a-flex>
        </template>
        <template v-if="column.key === 'disabled'">
          <a-tag v-if="record.disabled" color="red">禁用</a-tag>
          <a-tag v-else color="green">启用</a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
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
import systemMenuApi from "@/api/systemMenu"
import SvgIcon from "@/components/SvgIcon/index.vue"

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
  systemMenuApi
    .getPage({
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
    fixed: true,
  },

  {
    title: "名称",
    dataIndex: "title",
    key: "title",
    width: 150,
    fixed: true,
  },
  {
    title: "图标",
    dataIndex: "icon",
    key: "icon",
  },
  {
    title: "路径",
    dataIndex: "path",
    key: "path",
  },
  {
    title: "排序",
    dataIndex: "sort",
    key: "sort",
  },
  {
    title: "禁用状态",
    dataIndex: "disabled",
    key: "disabled",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
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
