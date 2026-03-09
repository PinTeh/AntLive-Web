<template>
  <div class="search-wrapper">
    <a-form ref="formRef" class="ant-advanced-search-form" :model="formState" @finish="onFinish">
      <a-row :gutter="24">
        <a-col :span="6">
          <a-form-item name="id" label="直播间ID">
            <a-input v-model:value="formState.id" placeholder="请输入直播间ID" autocomplete="off"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item name="title" label="直播间标题">
            <a-input v-model:value="formState.title" placeholder="请输入直播间标题" autocomplete="off"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item name="userId" label="主播ID">
            <a-input v-model:value="formState.userId" placeholder="请输入主播ID" autocomplete="off"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6" style="text-align: right">
          <a-button type="primary" html-type="submit">查询</a-button>
          <a-button style="margin: 0 8px" @click="handleReset">重置</a-button>
          <a v-if="showExpand" style="font-size: 12px" @click="expand = !expand">
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
      <a-row v-show="expand" :gutter="24" style="margin-top: 20px;">
        <a-col :span="6">
          <a-form-item name="status" label="直播状态">
            <a-select v-model:value="formState.status" placeholder="请选择直播状态" allow-clear>
              <a-select-option :value="0">未开播</a-select-option>
              <a-select-option :value="1">直播中</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item name="disabled" label="封禁状态">
            <a-select v-model:value="formState.disabled" placeholder="请选择封禁状态" allow-clear>
              <a-select-option :value="0">正常</a-select-option>
              <a-select-option :value="-1">已封禁</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
  <div class="content-wrapper" ref="containerRef">
    <a-table :scroll="{ x: 1400, y: tableScrollY }" :dataSource="dataSource" :columns="columns" :pagination="false" size="small">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">
          <a-flex align="center">
            <a-avatar v-if="record.cover" shape="square" :size="18" :src="record.cover" alt="封面" 
              style="cursor: pointer;" @click="handlePreviewCover(record.cover)" />
            <a-avatar v-else shape="square" :size="18" style="color: #f56a00; background-color: #fde3cf">
              {{ record.title?.substring(0, 2) || '直播' }}
            </a-avatar>
            <section style="width: 10px"></section>
            <span>{{ record.title }}</span>
          </a-flex>
        </template>
        <template v-if="column.key === 'userInfo'">
          <a-flex align="center">
            <a-avatar v-if="record.userAvatar" :size="25" :src="record.userAvatar" alt="头像" />
            <a-avatar v-else :size="25" style="color: #f56a00; background-color: #fde3cf">
              {{ record.userNickname?.substring(0, 2) || 'U' }}
            </a-avatar>
            <section style="width: 10px"></section>
            <div style="display: flex; flex-direction: column; align-items: flex-start;">
              <span style="font-weight: 500;">{{ record.userNickname || '未知' }}</span>
              <!-- <span v-if="record.userSignature" style="font-size: 12px; color: #999; margin-top: 2px;">{{ record.userSignature }}</span> -->
            </div>
          </a-flex>
        </template>
        <template v-if="column.key === 'categoryInfo'">
          <a-tag v-if="record.categoryName" color="blue">{{ record.categoryName }}</a-tag>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag v-if="record.status === 1" color="green">
            <PlayCircleOutlined /> 直播中
          </a-tag>
          <a-tag v-else color="default">未开播</a-tag>
        </template>
        <template v-if="column.key === 'disabled'">
          <a-tag v-if="record.disabled === 0" color="success">正常</a-tag>
          <a-tag v-else color="error">已封禁</a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a @click="handleView(record)">详情</a>
            <a-divider type="vertical" />
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a v-if="record.disabled === 0" style="color: red;" @click="handleToggleStatus(record, -1)">封禁</a>
            <a v-else style="color: green;" @click="handleToggleStatus(record, 0)">解禁</a>
          </span>
        </template>
      </template>
    </a-table>
    <a-pagination
      :total="total"
      :current="current"
      :page-size="pageSize"
      size="middle"
      :show-size-changer="true"
      :show-quick-jumper="true"
      :page-size-options="['10', '20', '50', '100']"
      @change="handlePageChange"
    />
  </div>

  <!-- 编辑模态框 -->
  <Edit 
    v-model:visible="modalVisible" 
    :title="modalTitle" 
    :edit-data="editData" 
    :category-options="categoryOptions"
    @success="getData" 
  />

  <!-- 详情模态框 -->
  <Detail v-model:visible="detailVisible" :detail-data="detailData" />

  <!-- 封面预览模态框 -->
  <a-modal :open="coverPreviewVisible" title="封面预览" :footer="null" @cancel="handleCoverPreviewCancel">
    <img alt="封面" style="width: 100%" :src="coverPreviewImage" />
  </a-modal>
</template>

<script setup>
import { UpOutlined, DownOutlined, PlayCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue"
import { onMounted, ref, reactive, createVNode } from "vue"
import systemRoomApi from "@/api/systemRoom"
import liveApi from "@/api/live"
import { message, Modal } from "ant-design-vue"
import Detail from "./Detail.vue"
import Edit from "./Edit.vue"
import { useTableScroll } from "@/composables/useTableScroll"
import { useSearchExpand } from "@/composables/useSearchExpand"

const formRef = ref()
const { expand, showExpand } = useSearchExpand(formRef)
const formState = reactive({})
const { containerRef, tableScrollY } = useTableScroll()

// 分类选项
const categoryOptions = ref([])

// 模态框相关状态
const modalVisible = ref(false)
const modalTitle = ref("编辑直播间")
const editData = ref({})

// 详情模态框
const detailVisible = ref(false)
const detailData = ref({})

// 封面预览模态框
const coverPreviewVisible = ref(false)
const coverPreviewImage = ref("")

const total = ref(0)
const current = ref(1)
const pageSize = ref(10)
onMounted(() => {
  getData()
  getCategories()
})

const onFinish = (values) => {
  getData()
}

const getData = () => {
  systemRoomApi
    .getPageRooms({
      pageNo: current.value,
      pageSize: pageSize.value,
      ...formState,
    })
    .then((res) => {
      total.value = res.data.total
      dataSource.value = res.data.list
    })
    .catch((err) => {
      message.error("获取数据失败: " + (err.message || "未知错误"))
    })
}

const getCategories = () => {
  liveApi.listCategories().then((res) => {
    if (res.code === 0) {
      categoryOptions.value = res.data || []
    }
  }).catch((err) => {
    console.error("获取分类失败:", err)
  })
}

const handlePageChange = (page, size) => {
  if (size && size !== pageSize.value) {
    pageSize.value = size
  }
  current.value = page
  getData()
}

const handleReset = () => {
  formRef.value.resetFields()
  getData()
}

// 查看详情
const handleView = (record) => {
  detailData.value = { ...record }
  detailVisible.value = true
}

// 编辑直播间
const handleEdit = (record) => {
  modalTitle.value = "编辑直播间"
  editData.value = { ...record }
  modalVisible.value = true
}

// 切换封禁状态
const handleToggleStatus = (record, status) => {
  const actionText = status === -1 ? '封禁' : '解禁'
  Modal.confirm({
    title: `确认${actionText}吗？`,
    icon: createVNode(ExclamationCircleOutlined),
    content: `确定要${actionText}直播间"${record.title}"吗？`,
    okText: '确定',
    okType: status === -1 ? 'danger' : 'primary',
    cancelText: '取消',
    onOk() {
      systemRoomApi.toggleRoomStatus({ id: record.id, disabled: status }).then(() => {
        message.success(`${actionText}成功`)
        getData()
      }).catch((error) => {
        message.error(`${actionText}失败: ` + (error.message || "未知错误"))
      })
    },
  })
}

// 预览封面图片
const handlePreviewCover = (coverUrl) => {
  coverPreviewImage.value = coverUrl
  coverPreviewVisible.value = true
}

// 关闭封面预览
const handleCoverPreviewCancel = () => {
  coverPreviewVisible.value = false
  coverPreviewImage.value = ""
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
    title: "直播间ID",
    dataIndex: "id",
    key: "id",
    width: 100,
    fixed: "left",
  },
  {
    title: "直播间标题",
    dataIndex: "title",
    key: "title",
    width: 200,
    fixed: "left",
  },
  {
    title: "主播信息",
    dataIndex: "userInfo",
    key: "userInfo",
    width: 200,
  },
  {
    title: "分类",
    dataIndex: "categoryInfo",
    key: "categoryInfo",
    width: 120,
  },
  {
    title: "直播状态",
    dataIndex: "status",
    key: "status",
    width: 100,
  },
  {
    title: "封禁状态",
    dataIndex: "disabled",
    key: "disabled",
    width: 100,
  },
  {
    title: "直播间介绍",
    dataIndex: "introduce",
    key: "introduce",
    width: 200,
    ellipsis: true,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
    width: 180,
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    key: "updateTime",
    width: 180,
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    width: 180,
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

    :deep(.ant-form-item .ant-row) {
      flex-wrap: nowrap;
    }

    :deep(.ant-form-item-label) {
      width: 84px;
      text-align: right;
    }

    :deep(.ant-form-item-control) {
      flex: 1;
      min-width: 0;
    }
  }
}

.content-wrapper {
  margin-top: 20px;
}
</style>
