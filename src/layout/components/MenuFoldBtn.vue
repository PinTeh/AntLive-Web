<template>
  <a-button type="primary" shape="circle" @click="handleBtnClick">
    <template #icon>
      <MenuUnfoldOutlined v-if="webStore.menuCollapse" />
      <MenuFoldOutlined v-else />
    </template>
  </a-button>
</template>

<script setup>
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue"
import { useStore } from "@/stores"

const webStore = useStore().web()
const handleBtnClick = () => {
  webStore.setMenuCollapse(!webStore.menuCollapse)
}
</script>

<style lang="scss" scoped></style>
