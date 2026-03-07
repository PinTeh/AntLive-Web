<template>
  <a-modal :title="title" :open="visible" :confirm-loading="confirmLoading" @ok="handleOk"
    @cancel="handleCancel" width="800px">
    <a-form ref="formRef" :model="formState" :rules="formRules" :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }">
      <a-form-item label="用户名" name="username">
        <a-input v-model:value="formState.username" placeholder="请输入用户名" :disabled="!!formState.id" />
      </a-form-item>
      <a-form-item label="昵称" name="nickname">
        <a-input v-model:value="formState.nickname" placeholder="请输入昵称" />
      </a-form-item>
      <a-form-item label="性别" name="sex">
        <a-select v-model:value="formState.sex" placeholder="请选择性别">
          <a-select-option :value="0">未知</a-select-option>
          <a-select-option :value="1">男</a-select-option>
          <a-select-option :value="2">女</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="手机号" name="mobile">
        <a-input v-model:value="formState.mobile" placeholder="请输入手机号" />
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="formState.email" placeholder="请输入邮箱" />
      </a-form-item>
      <a-form-item label="个性签名" name="signature">
        <a-textarea v-model:value="formState.signature" placeholder="请输入个性签名" :rows="3" />
      </a-form-item>
      <a-form-item label="头像" name="avatar">
        <a-upload :file-list="fileList" :before-upload="beforeUpload" :custom-request="customUpload"
          list-type="picture-card" :show-upload-list="{ showPreviewIcon: true, showRemoveIcon: true }"
          @preview="handlePreview" @remove="handleRemove">
          <div v-if="fileList.length < 1">
            <PlusOutlined />
            <div style="margin-top: 8px">上传头像</div>
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
import systemUserApi from "@/api/systemUser"

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: "编辑用户"
  },
  editData: {
    type: Object,
    default: () => ({})
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
  username: "",
  nickname: "",
  sex: 0,
  mobile: "",
  email: "",
  signature: "",
  avatar: "",
})

// 表单验证规则
const formRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "用户名长度在3-20个字符", trigger: "blur" }
  ],
  nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  mobile: [
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号", trigger: "blur" }
  ],
  email: [
    { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
  ],
}

// 监听编辑数据变化
watch(() => props.editData, (newVal) => {
  if (newVal && Object.keys(newVal).length > 0) {
    Object.assign(formState, {
      id: newVal.id,
      username: newVal.username,
      nickname: newVal.nickname,
      sex: newVal.sex || 0,
      mobile: newVal.mobile,
      email: newVal.email,
      signature: newVal.signature,
      avatar: newVal.avatar,
    })
    
    // 如果有头像URL，设置到文件列表中
    if (newVal.avatar) {
      fileList.value = [
        {
          uid: "-1",
          name: "avatar.png",
          status: "done",
          url: newVal.avatar,
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
      formState.avatar = mockUrl
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
  formState.avatar = ""
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
    username: "",
    nickname: "",
    sex: 0,
    mobile: "",
    email: "",
    signature: "",
    avatar: "",
  })
}

// 确认
const handleOk = () => {
  formRef.value
    .validate()
    .then(() => {
      confirmLoading.value = true
      systemUserApi.saveUser(formState)
        .then(() => {
          message.success("保存成功")
          emit('update:visible', false)
          emit('success')
          resetForm()
        })
        .catch((err) => {
          message.error("保存失败: " + (err.message || "未知错误"))
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
