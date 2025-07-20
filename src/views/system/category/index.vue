<template>
  <div class="search-wrapper">
    <a-form ref="formRef" class="ant-advanced-search-form" :model="formState" @finish="onFinish">
      <a-row :gutter="24">
        <a-col :span="6">
          <a-form-item name="name" label="分类名称">
            <a-input v-model:value="formState.name" placeholder="请输入分类名称" autocomplete="off"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6"></a-col>
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
        <template v-if="column.key === 'icon'">
          <a-flex align="center">
            <a-avatar v-if="record.icon" shape="square" :size="25" :src="record.icon" alt="U" />
            <a-avatar v-else :size="25" shape="square" :style="{ backgroundColor: getAvatarColor(record.name) }">{{
              record.name.substring(0, 2) }}</a-avatar>
          </a-flex>
        </template>
        <template v-if="column.key === 'status'">
          <CellStatus :val="record.status" />
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a style="color: red;" @click="handleDelete(record)">删除</a>
          </span>
        </template>
      </template>
    </a-table>
  </div>

  <!-- 新增/编辑模态框 -->
  <a-modal :title="modalTitle" :open="modalVisible" :confirm-loading="confirmLoading" @ok="handleModalOk"
    @cancel="handleModalCancel">
    <a-form ref="modalFormRef" :model="modalFormState" :rules="modalFormRules" :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }">
      <a-form-item label="名称" name="name">
        <a-input v-model:value="modalFormState.name" placeholder="请输入分类名称" />
      </a-form-item>
      <a-form-item label="图标" name="icon">
        <a-upload :before-upload="beforeUpload" list-type="picture-card" :show-upload-list="false"
          @change="handleUploadChange" action="/api/api/v1/upload/file" :headers="userToken">
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" style="height: 100px;width: 100px;" />
          <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </a-form-item>
      <a-form-item label="排序" name="sort">
        <a-input-number v-model:value="modalFormState.sort" :min="0" placeholder="请输入排序" style="width: 100%" />
      </a-form-item>
      <a-form-item label="禁用状态" name="status">
        <a-select v-model:value="modalFormState.status" placeholder="请选择状态">
          <a-select-option :value="0">启用</a-select-option>
          <a-select-option :value="-1">禁用</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { UpOutlined, DownOutlined, PlusOutlined, ExclamationCircleOutlined, LoadingOutlined, BranchesOutlined } from "@ant-design/icons-vue"
import { onMounted, ref, computed, reactive, h, createVNode } from "vue"
import CellStatus from '@/components/Common/CellStatus.vue'
import systemApi from "@/api/system"
import { message, Modal } from "ant-design-vue"
import { useStore } from "@/stores"

const expand = ref(false)
const formRef = ref()
const formState = reactive({})
const store = useStore()
const loading = ref(false);
const imageUrl = ref('');

// 用户令牌，用于上传文件时的身份验证
const userToken = computed(() => {
  return {
    Authorization: `${store.user().userToken}`,
  }
})
const onFinish = (values) => {
  console.log("Received values of form: ", values)
  console.log("formState: ", formState)
  getData()
}

// 模态框相关状态
const modalVisible = ref(false)
const modalTitle = ref("新增分类")
const confirmLoading = ref(false)
const modalFormRef = ref()
const editId = ref(null)

// 图片上传相关状态
const fileList = ref([])
const previewVisible = ref(false)
const previewImage = ref("")
const previewTitle = ref("")

// 模态框表单数据
const modalFormState = reactive({
  name: "",
  icon: "",
  sort: 0,
  status: 0,
})

// 表单验证规则
const modalFormRules = {
  name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
  sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
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
  systemApi
    .page("category", {
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

// 新增分类
const handleAdd = () => {
  modalTitle.value = "新增分类"
  resetModalForm()
  modalVisible.value = true
}

// 编辑分类
const handleEdit = (record) => {
  modalTitle.value = "编辑分类"
  editId.value = record.id
  imageUrl.value = record.icon
  Object.assign(modalFormState, {
    id: record.id,
    name: record.name,
    icon: record.icon,
    sort: record.sort,
    status: record.status,
  })
  // 如果有图标URL，设置到文件列表中
  if (record.icon) {
    fileList.value = [
      {
        uid: "-1",
        name: "icon.png",
        status: "done",
        url: record.icon,
      },
    ]
  } else {
    fileList.value = []
  }
  modalVisible.value = true
}

// 删除分类
const handleDelete = (record) => {
  Modal.confirm({
    title: '确认删除吗？',
    icon: createVNode(ExclamationCircleOutlined),
    content: `删除后将无法恢复，确定删除 ${record.name} 吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      systemApi.delete('category', [record.id]).then(() => {
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

// 重置模态框表单
const resetModalForm = () => {
  if (modalFormRef.value) {
    modalFormRef.value.resetFields()
  }
  editId.value = null
  fileList.value = []
  Object.assign(modalFormState, {
    id: null,
    name: "",
    icon: "",
    sort: 0,
    status: 0,
  })
}

// 模态框确认
const handleModalOk = () => {
  modalFormRef.value
    .validate()
    .then(() => {
      confirmLoading.value = true
      const apiCall = systemApi.save('category', modalFormState)

      apiCall
        .then(() => {
          message.success(editId.value ? "更新成功" : "新增成功")
          modalVisible.value = false
          getData()
        })
        .catch((err) => {
          message.error((editId.value ? "更新" : "新增") + "失败: " + (err.message || "未知错误"))
        })
        .finally(() => {
          confirmLoading.value = false
        })
    })
    .catch((err) => {
      console.log("表单验证失败:", err)
    })
}

// 模态框取消
const handleModalCancel = () => {
  modalVisible.value = false
  resetModalForm()
}

// 图片上传相关方法
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif"
  if (!isJpgOrPng) {
    message.error("只能上传 JPG/PNG/GIF 格式的图片!")
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error("图片大小不能超过 2MB!")
    return false
  }
  return true // 允许自动上传，使用 action 属性指定的上传路径
}

const handlePreview = (file) => {
  previewImage.value = file.url || file.preview
  previewVisible.value = true
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
}

const handleRemove = () => {
  modalFormState.icon = ""
  fileList.value = []
}

const handleCancel = () => {
  previewVisible.value = false
}

// 根据名称生成固定的头像颜色
const getAvatarColor = (name) => {
  if (!name) return '#1890ff'

  // 预定义的颜色数组
  const colors = [
    '#f56a00', '#7265e6', '#ffbf00', '#00a2ae',
    '#87d068', '#108ee9', '#f50', '#2db7f5',
    '#52c41a', '#fa8c16', '#eb2f96', '#722ed1',
    '#13c2c2', '#fa541c', '#a0d911', '#1890ff'
  ]

  // 使用简单的哈希函数生成固定索引
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  // 确保索引为正数并在颜色数组范围内
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

// 上传成功回调
const handleUploadChange = (info) => {
  console.log(info);

  if (info.file.status === 'uploading') {
    loading.value = true;
    return
  }
  if (info.file.status === 'done') {
    // 上传成功，从响应中获取URL
    if (info.file.response && info.file.response.code === 0) {
      loading.value = false;
      const url = info.file.response.data
      modalFormState.icon = url
      imageUrl.value = url;
      message.success('图片上传成功')
    } else {
      message.error('图片上传失败: ' + (info.file.response?.message || '未知错误'))
    }
  } else if (info.file.status === 'error') {
    loading.value = false;
    message.error('图片上传失败')
  }
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
    title: "图标",
    dataIndex: "icon",
    key: "icon",
    width: 80,
  },
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    width: 150,
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

  .operation-wrapper {
    margin-bottom: 20px;
    display: flex;
  }
}
</style>
