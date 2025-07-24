<template>
  <div class="messages-container">
    <div class="messages-header">
      <h2>消息中心</h2>
      <a-button type="primary" @click="markAllAsRead" :disabled="!hasUnreadMessages">
        全部标记为已读
      </a-button>
    </div>
    
    <a-tabs v-model:activeKey="activeTab" @change="handleTabChange">
      <a-tab-pane key="system" tab="系统消息">
        <div class="message-list">
          <a-list
            :data-source="systemMessages"
            :loading="loading"
            :pagination="{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handlePageChange,
              onShowSizeChange: handlePageSizeChange
            }"
          >
            <template #renderItem="{ item }">
              <a-list-item 
                :class="{ 'unread': !item.isRead }"
                @click="markAsRead(item)"
              >
                <a-list-item-meta>
                  <template #title>
                    <div class="message-title">
                      <span>{{ item.title }}</span>
                      <a-tag v-if="!item.isRead" color="red" size="small">未读</a-tag>
                    </div>
                  </template>
                  <template #description>
                    <div class="message-content">{{ item.content }}</div>
                    <div class="message-time">{{ formatTime(item.createTime) }}</div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </a-tab-pane>
      
      <a-tab-pane key="notice" tab="通知消息">
        <div class="message-list">
          <a-list
            :data-source="noticeMessages"
            :loading="loading"
            :pagination="{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handlePageChange,
              onShowSizeChange: handlePageSizeChange
            }"
          >
            <template #renderItem="{ item }">
              <a-list-item 
                :class="{ 'unread': !item.isRead }"
                @click="markAsRead(item)"
              >
                <a-list-item-meta>
                  <template #title>
                    <div class="message-title">
                      <span>{{ item.title }}</span>
                      <a-tag v-if="!item.isRead" color="red" size="small">未读</a-tag>
                    </div>
                  </template>
                  <template #description>
                    <div class="message-content">{{ item.content }}</div>
                    <div class="message-time">{{ formatTime(item.createTime) }}</div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

// 响应式数据
const activeTab = ref('system')
const loading = ref(false)
const systemMessages = ref([])
const noticeMessages = ref([])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 计算属性
const hasUnreadMessages = computed(() => {
  const currentMessages = activeTab.value === 'system' ? systemMessages.value : noticeMessages.value
  return currentMessages.some(msg => !msg.isRead)
})

// 格式化时间
const formatTime = (time) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

// 获取消息列表
const fetchMessages = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    const mockSystemMessages = [
      {
        id: 1,
        title: '系统维护通知',
        content: '系统将于今晚22:00-24:00进行维护，期间可能影响正常使用，请提前做好准备。',
        isRead: false,
        createTime: new Date().toISOString()
      },
      {
        id: 2,
        title: '功能更新提醒',
        content: '新版本已发布，增加了多项实用功能，请及时更新体验。',
        isRead: true,
        createTime: new Date(Date.now() - 86400000).toISOString()
      }
    ]
    
    const mockNoticeMessages = [
      {
        id: 3,
        title: '直播间互动提醒',
        content: '您关注的主播正在直播，快来参与互动吧！',
        isRead: false,
        createTime: new Date().toISOString()
      }
    ]
    
    systemMessages.value = mockSystemMessages
    noticeMessages.value = mockNoticeMessages
    pagination.total = activeTab.value === 'system' ? mockSystemMessages.length : mockNoticeMessages.length
    
  } catch (error) {
    message.error('获取消息失败')
  } finally {
    loading.value = false
  }
}

// 标记单条消息为已读
const markAsRead = (item) => {
  if (!item.isRead) {
    item.isRead = true
    message.success('消息已标记为已读')
  }
}

// 标记全部为已读
const markAllAsRead = () => {
  const currentMessages = activeTab.value === 'system' ? systemMessages.value : noticeMessages.value
  currentMessages.forEach(msg => {
    msg.isRead = true
  })
  message.success('全部消息已标记为已读')
}

// 切换标签页
const handleTabChange = (key) => {
  activeTab.value = key
  pagination.current = 1
  fetchMessages()
}

// 分页变化
const handlePageChange = (page) => {
  pagination.current = page
  fetchMessages()
}

// 页面大小变化
const handlePageSizeChange = (current, size) => {
  pagination.current = 1
  pagination.pageSize = size
  fetchMessages()
}

// 组件挂载时获取数据
onMounted(() => {
  fetchMessages()
})
</script>

<style lang="scss" scoped>
.messages-container {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
}

.messages-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
  }
}

.message-list {
  .unread {
    background-color: #f6ffed;
    border-left: 3px solid #52c41a;
  }
  
  .message-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
  }
  
  .message-content {
    color: #666;
    margin-bottom: 8px;
    line-height: 1.5;
  }
  
  .message-time {
    color: #999;
    font-size: 12px;
  }
}

:deep(.ant-list-item) {
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #fafafa;
  }
}

:deep(.ant-tabs-content-holder) {
  padding-top: 16px;
}
</style>