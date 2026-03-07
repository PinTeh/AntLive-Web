<template>
  <a-modal title="用户详情" :open="visible" :footer="null" @cancel="handleCancel" width="800px">
    <a-descriptions :column="2" bordered size="small">
      <a-descriptions-item label="用户ID">{{ detailData.id }}</a-descriptions-item>
      <a-descriptions-item label="状态">
        <a-tag v-if="detailData.disabled === 0" color="success">正常</a-tag>
        <a-tag v-else color="error">已封禁</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="用户名">{{ detailData.username || '-' }}</a-descriptions-item>
      <a-descriptions-item label="昵称">{{ detailData.nickname || '-' }}</a-descriptions-item>
      <a-descriptions-item label="性别">
        <a-tag v-if="detailData.sex === 1" color="blue">男</a-tag>
        <a-tag v-else-if="detailData.sex === 2" color="pink">女</a-tag>
        <span v-else>未知</span>
      </a-descriptions-item>
      <a-descriptions-item label="手机号">{{ detailData.mobile || '-' }}</a-descriptions-item>
      <a-descriptions-item label="邮箱" :span="2">{{ detailData.email || '-' }}</a-descriptions-item>
      <a-descriptions-item label="个性签名" :span="2">{{ detailData.signature || '-' }}</a-descriptions-item>
      <a-descriptions-item label="头像" :span="2">
        <a-avatar 
          v-if="detailData.avatar" 
          :size="80" 
          :src="detailData.avatar" 
          style="cursor: pointer;"
          @click="handlePreviewAvatar(detailData.avatar)"
        />
        <span v-else>-</span>
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">{{ detailData.createTime || '-' }}</a-descriptions-item>
      <a-descriptions-item label="更新时间">{{ detailData.updateTime || '-' }}</a-descriptions-item>
    </a-descriptions>
  </a-modal>

  <!-- 头像预览模态框 -->
  <a-modal :open="avatarPreviewVisible" title="头像预览" :footer="null" @cancel="handleAvatarPreviewCancel">
    <img alt="头像" style="width: 100%" :src="avatarPreviewImage" />
  </a-modal>
</template>

<script setup>
import { ref } from "vue"

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  detailData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible'])

// 头像预览
const avatarPreviewVisible = ref(false)
const avatarPreviewImage = ref("")

const handleCancel = () => {
  emit('update:visible', false)
}

const handlePreviewAvatar = (avatarUrl) => {
  avatarPreviewImage.value = avatarUrl
  avatarPreviewVisible.value = true
}

const handleAvatarPreviewCancel = () => {
  avatarPreviewVisible.value = false
  avatarPreviewImage.value = ""
}
</script>
