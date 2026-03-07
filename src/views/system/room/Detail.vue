<template>
  <a-modal title="直播间详情" :open="visible" :footer="null" @cancel="handleCancel" width="800px">
    <a-descriptions :column="2" bordered size="small">
      <a-descriptions-item label="直播间ID">{{ detailData.id }}</a-descriptions-item>
      <a-descriptions-item label="直播状态">
        <a-tag v-if="detailData.status === 1" color="green">
          <PlayCircleOutlined /> 直播中
        </a-tag>
        <a-tag v-else color="default">未开播</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="直播间标题" :span="2">{{ detailData.title || '-' }}</a-descriptions-item>
      <a-descriptions-item label="主播昵称">{{ detailData.userNickname || '-' }}</a-descriptions-item>
      <a-descriptions-item label="主播ID">{{ detailData.userId || '-' }}</a-descriptions-item>
      <a-descriptions-item label="主播签名" :span="2">{{ detailData.userSignature || '-' }}</a-descriptions-item>
      <a-descriptions-item label="主播头像" :span="2">
        <a-avatar v-if="detailData.userAvatar" :size="64" :src="detailData.userAvatar" />
        <span v-else>-</span>
      </a-descriptions-item>
      <a-descriptions-item label="分类">
        <a-tag v-if="detailData.categoryName" color="blue">{{ detailData.categoryName }}</a-tag>
        <span v-else>-</span>
      </a-descriptions-item>
      <a-descriptions-item label="封禁状态">
        <a-tag v-if="detailData.disabled === 0" color="success">正常</a-tag>
        <a-tag v-else color="error">已封禁</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="直播间介绍" :span="2">{{ detailData.introduce || '-' }}</a-descriptions-item>
      <a-descriptions-item label="直播公告" :span="2">{{ detailData.notice || '-' }}</a-descriptions-item>
      <a-descriptions-item label="封面" :span="2">
        <img v-if="detailData.cover" :src="detailData.cover" alt="封面" style="max-width: 300px; max-height: 200px;" />
        <span v-else>-</span>
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">{{ detailData.createTime || '-' }}</a-descriptions-item>
      <a-descriptions-item label="更新时间">{{ detailData.updateTime || '-' }}</a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>

<script setup>
import { PlayCircleOutlined } from "@ant-design/icons-vue"

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

const handleCancel = () => {
  emit('update:visible', false)
}
</script>
