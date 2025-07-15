<template>
  <div class="search-wrapper">
    <a-form ref="formRef" class="ant-advanced-search-form" :model="formState" @finish="onFinish">
      <a-row :gutter="24">
        <a-col :span="6">
          <a-form-item name="name" label="名称">
            <a-input v-model:value="formState.name" placeholder="请输入礼物名称" autocomplete="off"></a-input>
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
        <template v-if="column.key === 'name'">
          <a-flex align="center">
            <a-avatar v-if="record.icon" :size="25" :src="record.icon" alt="U" />
            <a-avatar v-else :size="20" style="color: #f56a00; background-color: #fde3cf">{{ record.name.substring(0, 2)
              }}</a-avatar>
            <section style="width: 10px"></section>
            <span>{{ record.name }}</span>
          </a-flex>
        </template>
        <template v-if="column.key === 'disabled'">
          <CellStatus :val="record.disabled" />
        </template>
        <template v-else-if="column.key === 'action'">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a style="color: red;" @click="handleDelte(record)">删除</a>
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
        <a-input v-model:value="modalFormState.name" placeholder="请输入礼物名称" />
      </a-form-item>
      <a-form-item label="图标" name="icon">
        <a-upload :file-list="fileList" :before-upload="beforeUpload" :custom-request="customUpload"
          list-type="picture-card" :show-upload-list="{ showPreviewIcon: true, showRemoveIcon: true }"
          @preview="handlePreview" @remove="handleRemove">
          <div v-if="fileList.length < 1">
            <plus-outlined />
            <div style="margin-top: 8px">上传图标</div>
          </div>
        </a-upload>
        <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </a-form-item>
      <a-form-item label="价格" name="price">
        <a-input-number v-model:value="modalFormState.price" :min="0" :precision="2" placeholder="请输入价格"
          style="width: 100%" />
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-textarea v-model:value="modalFormState.description" placeholder="请输入描述" :rows="3" />
      </a-form-item>
      <a-form-item label="排序" name="sort">
        <a-input-number v-model:value="modalFormState.sort" :min="0" placeholder="请输入排序" style="width: 100%" />
      </a-form-item>
      <a-form-item label="禁用状态" name="disabled">
        <a-select v-model:value="modalFormState.disabled" placeholder="请选择状态">
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
import systemGiftApi from "@/api/systemGift"
import systemApi from "@/api/system"
import CellStatus from "@/components/Common/CellStatus.vue"
import { message, Modal } from "ant-design-vue"

const expand = ref(false)
const formRef = ref()
const formState = reactive({})

// 模态框相关状态
const modalVisible = ref(false)
const modalTitle = ref("新增礼物")
const confirmLoading = ref(false)
const modalFormRef = ref()
const editId = ref(null)

// 图片上传相关状态
const fileList = ref([])
const previewVisible = ref(false)
const previewImage = ref("")
const previewTitle = ref("")

// TODO: 请替换为实际的上传接口地址
const UPLOAD_API_URL = "/api/upload/image"

// 模态框表单数据
const modalFormState = reactive({
  name: "",
  icon: "",
  price: 0,
  description: "",
  sort: 0,
  disabled: false,
})

// 表单验证规则
const modalFormRules = {
  name: [{ required: true, message: "请输入礼物名称", trigger: "blur" }],
  price: [{ required: true, message: "请输入礼物价格", trigger: "blur" }],
  sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
}
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
  systemGiftApi
    .getPageGifts({
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

// 新增礼物
const handleAdd = () => {
  modalTitle.value = "新增礼物"
  resetModalForm()
  modalVisible.value = true
}

// 编辑礼物
const handleEdit = (record) => {
  modalTitle.value = "编辑礼物"
  editId.value = record.id
  Object.assign(modalFormState, {
    id: record.id,
    name: record.name,
    icon: record.icon,
    price: record.price,
    description: record.description,
    sort: record.sort,
    disabled: record.disabled,
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

// 删除礼物
const handleDelete = (id) => {
  systemGiftApi
    .deleteGift(id)
    .then(() => {
      message.success("删除成功")
      getData()
    })
    .catch((err) => {
      message.error("删除失败: " + (err.message || "未知错误"))
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
    price: 0,
    description: "",
    sort: 0,
    disabled: false,
  })
}

// 模态框确认
const handleModalOk = () => {
  modalFormRef.value
    .validate()
    .then(() => {
      confirmLoading.value = true
      // const apiCall = editId.value
      //   ? systemGiftApi.updateGift({ id: editId.value, ...modalFormState })
      //   : systemGiftApi.createGift(modalFormState)
      const apiCall = systemApi.save('gift', modalFormState)

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

// 删除
const handleDelte = (record) => {
  Modal.confirm({
    title: '确认删除吗？',
    icon: createVNode(ExclamationCircleOutlined),
    content: `删除后将无法恢复，确定删除 ${record.name} 吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      systemApi.delete('gift', [record.id]).then(() => {
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
  return false // 阻止自动上传，使用自定义上传
}

const customUpload = async (options) => {
  const { file, onSuccess, onError } = options
  const formData = new FormData()
  formData.append("file", file)

  try {
    // TODO: 请替换为实际的上传API调用
    // const response = await fetch(UPLOAD_API_URL, {
    //   method: 'POST',
    //   body: formData,
    // })
    // const result = await response.json()

    // 模拟上传成功，返回图片URL
    // 实际使用时请替换为真实的API调用
    setTimeout(() => {
      const mockUrl = URL.createObjectURL(file)
      modalFormState.icon = mockUrl
      onSuccess({
        url: mockUrl,
      })
      message.success("图片上传成功")
    }, 1000)

  } catch (error) {
    onError(error)
    message.error("图片上传失败")
  }
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
  // {
  //   title: "图标",
  //   dataIndex: "icon",
  //   key: "icon",
  //   width: 80,
  //   customRender: ({ text }) => {
  //     return text ? h('img', { src: text, alt: 'icon', style: 'width: 30px; height: 30px; object-fit: cover;' }) : '-'
  //   },
  // },
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    width: 150,
    fixed: true,
  },
  {
    title: "价格",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "描述",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "排序",
    dataIndex: "sort",
    key: "sort",
    sorter: (a, b) => a.sort - b.sort,
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

  .operation-wrapper {
    margin-bottom: 20px;
    display: flex;
  }
}
</style>
