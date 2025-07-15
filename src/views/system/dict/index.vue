<template>
  <div class="search-wrapper">
    <a-form ref="formRef" class="ant-advanced-search-form" :model="formState" @finish="onFinish">
      <a-row :gutter="24">
        <a-col :span="6">
          <a-form-item name="typeName" label="类型名称">
            <a-input v-model:value="formState.typeName" placeholder="请输入类型名称" autocomplete="off"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item name="label" label="标签">
            <a-input v-model:value="formState.label" placeholder="请输入标签" autocomplete="off"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6"></a-col>
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
    <div class="operation-wrapper">
      <a-tooltip title="search">
        <a-button type="primary" @click="handleAdd" :icon="h(PlusOutlined)">新增</a-button>
      </a-tooltip>
    </div>
    <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" size="small"
      @change="handleTableChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <CellStatus :val="record.status" />
        </template>
        <template v-else-if="column.key === 'action'">
          <!-- <a @click="handleView(record)">详情</a> -->
          <!-- <a-divider type="vertical" /> -->
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a style="color: red;" @click="handleDelte(record)">删除</a>
        </template>
      </template>
    </a-table>
  </div>

  <!-- 新增/编辑弹窗 -->
  <a-modal v-model:open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel"
    :confirmLoading="confirmLoading" width="600px">
    <a-form ref="modalFormRef" :model="modalFormState" :rules="modalFormRules" :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }">
      <a-form-item label="类型" name="type">
        <a-input v-model:value="modalFormState.type" placeholder="请输入类型" />
      </a-form-item>
      <a-form-item label="类型名称" name="typeName">
        <a-input v-model:value="modalFormState.typeName" placeholder="请输入类型名称" />
      </a-form-item>
      <a-form-item label="标签" name="label">
        <a-input v-model:value="modalFormState.label" placeholder="请输入标签" />
      </a-form-item>
      <a-form-item label="标签值" name="value">
        <a-input v-model:value="modalFormState.value" placeholder="请输入标签值" />
      </a-form-item>
      <a-form-item label="排序" name="sort">
        <a-input-number v-model:value="modalFormState.sort" placeholder="请输入排序" :min="0" style="width: 100%" />
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-input v-model:value="modalFormState.description" placeholder="请输入描述" />
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-select v-model:value="modalFormState.status" placeholder="请选择状态">
          <a-select-option :value="0">启用</a-select-option>
          <a-select-option :value="-1">禁用</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { UpOutlined, DownOutlined, PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue"
import { onMounted, ref, computed, reactive, h, createVNode } from "vue"
import { message, Modal } from 'ant-design-vue'
import CellStatus from '@/components/Common/CellStatus.vue'
import systemApi from "@/api/system"

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

// 弹窗相关
const modalVisible = ref(false)
const modalTitle = ref('')
const confirmLoading = ref(false)
const modalFormRef = ref()
const isEdit = ref(false)
const editId = ref(null)

const modalFormState = reactive({
  type: '',
  typeName: '',
  label: '',
  value: '',
  sort: 0,
  status: 0
})

const modalFormRules = {
  type: [{ required: true, message: '请输入类型', trigger: 'blur' }],
  typeName: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
  label: [{ required: true, message: '请输入标签', trigger: 'blur' }],
  value: [{ required: true, message: '请输入标签值', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  description: [{ required: true, message: '请输入描述', trigger: 'change' }]
}

onMounted(() => {
  getData()
})

const getData = () => {
  systemApi
    .page("dict", {
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

// 新增
const handleAdd = () => {
  modalTitle.value = '新增字典'
  isEdit.value = false
  editId.value = null
  resetModalForm()
  modalVisible.value = true
}

// 编辑
const handleEdit = (record) => {
  modalTitle.value = '编辑字典'
  isEdit.value = true
  editId.value = record.id

  // 填充表单数据
  Object.assign(modalFormState, {
    id: record.id,
    type: record.type,
    typeName: record.typeName,
    label: record.label,
    value: record.value,
    sort: record.sort,
    status: record.status,
    description: record.description
  })

  modalVisible.value = true
}

// 查看详情
const handleView = (record) => {
  modalTitle.value = '查看字典详情'
  isEdit.value = false
  editId.value = null

  // 填充表单数据
  Object.assign(modalFormState, {
    type: record.type,
    typeName: record.typeName,
    label: record.label,
    value: record.value,
    sort: record.sort,
    status: record.status,
    description: record.description
  })

  modalVisible.value = true
}

// 重置弹窗表单
const resetModalForm = () => {
  Object.assign(modalFormState, {
    type: '',
    typeName: '',
    label: '',
    value: '',
    sort: 0,
    status: 0,
    description: ''
  })
  if (modalFormRef.value) {
    modalFormRef.value.resetFields()
  }
}

// 弹窗确定
const handleModalOk = () => {
  modalFormRef.value.validate().then(() => {
    confirmLoading.value = true

    // const apiCall = isEdit.value
    //   ? systemApi.save('dict', editId.value, modalFormState)
    //   : systemApi.save('dict', modalFormState)
    const apiCall = systemApi.save('dict', modalFormState)

    apiCall.then(() => {
      message.success(isEdit.value ? '编辑成功' : '新增成功')
      modalVisible.value = false
      getData()
    }).catch((error) => {
      message.error(isEdit.value ? '编辑失败' : '新增失败')
      console.error(error)
    }).finally(() => {
      confirmLoading.value = false
    })
  }).catch(() => {
    message.error('请检查表单输入')
  })
}

// 弹窗取消
const handleModalCancel = () => {
  modalVisible.value = false
  resetModalForm()
}

// 删除
const handleDelte = (record) => {
  Modal.confirm({
    title: '确认删除吗？',
    icon: createVNode(ExclamationCircleOutlined),
    content: `删除后将无法恢复，确定删除 ${record.type} 吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      systemApi.delete('dict', [record.id]).then(() => {
        message.success('删除成功')
        getData()
      }).catch((error) => {
        message.error('删除失败')
        console.error(error)
      })
    },
    onCancel() {
      console.log('Cancel');
    }
  })
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
    title: "类型",
    dataIndex: "type",
    key: "type",
    width: 150,
    fixed: true,
  },
  {
    title: "类型名称",
    dataIndex: "typeName",
    key: "typeName",
    width: 150,
    fixed: true,
  },
  {
    title: "标签",
    dataIndex: "label",
    key: "label",
    width: 150,
    fixed: true,
  },
  {
    title: "标签值",
    dataIndex: "value",
    key: "value",
    width: 150,
    fixed: true,
  },
  {
    title: "排序",
    dataIndex: "sort",
    key: "sort",
    sorter: (a, b) => a.sort - b.sort,
  },
  {
    title: "禁用状态",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "描述",
    dataIndex: "description",
    key: "description",
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
    width: 160,
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

  .operation-wrapper {
    margin-bottom: 20px;
    display: flex;
  }
}
</style>
