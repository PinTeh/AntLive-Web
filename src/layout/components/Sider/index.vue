<template>
  <a-layout-sider class="sider" :collapsed="webStore.menuCollapse">
    <Logo></Logo>
    <Menu></Menu>
  </a-layout-sider>
</template>

<script setup>
import { useStore } from "@/stores"
import Logo from "../Logo.vue"
import Menu from "../Menu/index.vue"

const webStore = useStore().web()
</script>

<style lang="scss" scoped>
.sider {
  background-color: transparent;
  border-inline-end: 1px solid rgba(5, 5, 5, 0.06);
}
</style>
