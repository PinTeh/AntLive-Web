<template>
  <a-modal :title="title" :open="visible" :confirm-loading="confirmLoading" @ok="handleOk"
    @cancel="handleCancel" width="800px">
    <a-form ref="formRef" :model="formState" :rules="formRules" :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }">
      <a-form-item label="直播间标题" name="title">
        <a-input v-model:value="formState.title" placeholder="请输入直播间标题" />
      </a-form-item>
      <a-form-item label="直播间介绍" name="introduce">
        <a-textarea v-model:value="formState.introduce" placeholder="请输入直播间介绍" :rows="3" />
      </a-form-item>
      <a-form-item label="直播公告" name="notice">
        <a-textarea v-model:value="formState.notice" placeholder="请输入直播公告" :rows="3" />
      </a-form-item>
      <a-form-item label="分类" name="categoryId">
        <a-select v-model:value="formState.categoryId" placeholder="请选择分类">
          <a-select-option v-for="item in categoryOptions" :key="item.id" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="封面" name="cover">
        <a-upload :file-list="fileList" :before-upload="beforeUpload" :custom-request="customUpload"
          list-type="picture-card" :show-upload-list="{ showPreviewIcon: true, showRemoveIcon: true }"
          @preview="handlePreview" @remove="handleRemove">
          <div v-if="fileList.length < 1">
            <PlusOutlined />
            <div style="margin-top: 8px">上传封面</div>
          </div>
        </a-upload>
        <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancelPreview">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { PlusOutlined } from "@ant-design/icons-vue"
import { ref, watch, reactive } from "vue"
import { message } from "ant-design-vue"
import systemRoomApi from "@/api/systemRoom"

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: "编辑直播间"
  },
  editData: {
    type: Object,
    default: () => ({})
  },
  categoryOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'success'])

const formRef = ref()
const confirmLoading = ref(false)

// 图片上传相关状态
const fileList = ref([])
const previewVisible = ref(false)
const previewImage = ref("")
const previewTitle = ref("")

// 表单数据
const formState = reactive({
  id: null,
  title: "",
  introduce: "",
  notice: "",
  categoryId: undefined,
  cover: "",
})

// 表单验证规则
const formRules = {
  title: [{ required: true, message: "请输入直播间标题", trigger: "blur" }],
  categoryId: [{ required: true, message: "请选择分类", trigger: "change" }],
}

// 监听编辑数据变化
watch(() => props.editData, (newVal) => {
  if (newVal && Object.keys(newVal).length > 0) {
    Object.assign(formState, {
      id: newVal.id,
      title: newVal.title,
      introduce: newVal.introduce,
      notice: newVal.notice,
      categoryId: newVal.categoryId,
      cover: newVal.cover,
    })
    
    // 如果有封面URL，设置到文件列表中
    if (newVal.cover) {
      fileList.value = [
        {
          uid: "-1",
          name: "cover.png",
          status: "done",
          url: newVal.cover,
        },
      ]
    } else {
      fileList.value = []
    }
  }
}, { immediate: true, deep: true })

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
    // 模拟上传成功，返回图片URL
    // TODO: 实际使用时请替换为真实的API调用
    setTimeout(() => {
      const mockUrl = URL.createObjectURL(file)
      formState.cover = mockUrl
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
  formState.cover = ""
  fileList.value = []
}

const handleCancelPreview = () => {
  previewVisible.value = false
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  fileList.value = []
  Object.assign(formState, {
    id: null,
    title: "",
    introduce: "",
    notice: "",
    categoryId: undefined,
    cover: "",
  })
}

// 确认
const handleOk = () => {
  formRef.value
    .validate()
    .then(() => {
      confirmLoading.value = true
      systemRoomApi.saveRoom(formState)
        .then(() => {
          message.success("更新成功")
          emit('update:visible', false)
          emit('success')
          resetForm()
        })
        .catch((err) => {
          message.error("更新失败: " + (err.message || "未知错误"))
        })
        .finally(() => {
          confirmLoading.value = false
        })
    })
    .catch((err) => {
      console.log("表单验证失败:", err)
    })
}

// 取消
const handleCancel = () => {
  emit('update:visible', false)
  resetForm()
}
</script>
