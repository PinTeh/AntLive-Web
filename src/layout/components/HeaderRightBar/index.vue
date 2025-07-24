<template>
  <div class="header-right-bar">
    <a-dropdown v-if="userStore.isLogin" placement="bottomRight" :trigger="['hover']">
      <div class="user-info">
        <a-avatar :size="32" :src="userStore.userInfo.avatar"
          :style="{ backgroundColor: '#1890ff', cursor: 'pointer' }">
          {{ userStore.userInfo.username?.charAt(0)?.toUpperCase() }}
        </a-avatar>
        <span class="username">{{ userStore.userInfo.nickName }}</span>
        <DownOutlined class="dropdown-icon" />
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item key="profile" @click="goToProfile">
            <UserOutlined />
            <span>个人中心</span>
          </a-menu-item>
          <a-menu-item key="messages" @click="goToMessages">
            <MessageOutlined />
            <span>消息中心</span>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="logout" @click="handleLogout">
            <LogoutOutlined />
            <span>退出登录</span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>

    <!-- 未登录状态显示登录按钮 -->
    <div v-else class="login-actions">
      <a-button type="primary" @click="goToLogin">登录</a-button>
    </div>
  </div>
</template>

<script setup>
import {
  DownOutlined,
  UserOutlined,
  MessageOutlined,
  LogoutOutlined
} from "@ant-design/icons-vue"
import { useUserStore } from '@/stores/modules/user'
import { useRouter } from 'vue-router'
import { Modal } from 'ant-design-vue'

const userStore = useUserStore()
const router = useRouter()

// 跳转到个人中心
const goToProfile = () => {
  router.push('/center')
}

// 跳转到消息中心
const goToMessages = () => {
  router.push('/center/messages')
}

// 处理退出登录
const handleLogout = () => {
  Modal.confirm({
    title: '确认退出',
    content: '确定要退出登录吗？',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      userStore.logout()
      router.push('/login')
    }
  })
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.header-right-bar {
  display: flex;
  align-items: center;
  height: 100%;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .username {
    font-size: 14px;
    color: #333;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dropdown-icon {
    font-size: 12px;
    color: #999;
    transition: transform 0.2s;
  }
}

.login-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.ant-dropdown-menu) {
  min-width: 200px;
}

:deep(.ant-dropdown-menu-item) {
  display: flex;
  align-items: center;
  gap: 8px;

  .ant-dropdown-menu-title-content {
    span {
      margin-right: 5px;
    }
  }

  &:hover {
    background-color: #f5f5f5;
  }
}
</style>
