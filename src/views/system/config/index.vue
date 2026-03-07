<template>
  <div class="system-config-page">
    <div class="config-layout">
      <aside class="config-menu">
        <a-menu
          mode="inline"
          :selectedKeys="[activeMenu]"
          :items="configMenuItems"
          @click="handleMenuClick"
        />
      </aside>
      <main class="config-content">
        <div class="menu-title">{{ activeMenuLabel }}</div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"

const activeMenu = ref("website-config")

const configMenuItems = [
  { key: "website-config", label: "网站配置", title: "网站配置" },
  { key: "security-config", label: "安全配置", title: "安全配置" },
  { key: "login-config", label: "登录配置", title: "登录配置" },
  { key: "email-config", label: "邮件配置", title: "邮件配置" },
  { key: "sms-config", label: "短信配置", title: "短信配置" },
  { key: "storage-config", label: "存储配置", title: "存储配置" },
  { key: "live-config", label: "直播配置", title: "直播配置" },
  { key: "client-config", label: "客户端配置", title: "客户端配置" },
]

const handleMenuClick = ({ key }) => {
  activeMenu.value = key
}

const activeMenuLabel = computed(() => {
  const menu = configMenuItems.find((item) => item.key === activeMenu.value)
  return menu?.label || ""
})
</script>

<style lang="scss" scoped>
.system-config-page {
  height: calc(100% - 10px);
}

.config-layout {
  display: flex;
  min-height: 100%;
  background-color: #fff;
}

.config-menu {
  width: 220px;
  padding: 8px 0;
}

.config-content {
  flex: 1;
  min-height: 480px;
  padding: 12px 20px;
}

.menu-title {
  font-size: 16px;
  color: #1f1f1f;
}

:deep(.ant-menu-inline) {
  border-inline-end: none !important;
}
</style>
