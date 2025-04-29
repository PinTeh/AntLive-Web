<template>
  <a-menu
    class="sider-menu"
    v-model:openKeys="state.openKeys"
    v-model:selectedKeys="state.selectedKeys"
    mode="inline"
    :inline-collapsed="menuCollapse"
    :items="items"
    @click="handleClick">
  </a-menu>
</template>

<script setup>
import systemApi from "@/api/system"
import { ref, watch, h, onMounted, reactive, computed } from "vue"
import { DesktopOutlined, AppstoreOutlined } from "@ant-design/icons-vue"
import { useStore } from "@/stores"
import { useRouter } from "vue-router"

const router = useRouter()
const state = reactive({
  collapsed: false,
  selectedKeys: ["1"],
  openKeys: ["sub1"],
  preOpenKeys: ["sub1"],
})
const items = ref([])
const webStore = useStore().web()
const menuCollapse = computed(() => webStore.menuCollapse)

watch(
  () => state.openKeys,
  (_val, oldVal) => {
    console.log(_val, oldVal)
    state.preOpenKeys = oldVal
  }
)

onMounted(() => {
  getMenus()
})

const handleClick = (e) => {
  console.log("click", e)
  console.log(state)
  router.push("/system/" + e.item.path)
}

const toggleCollapsed = () => {
  state.collapsed = !state.collapsed
  state.openKeys = state.collapsed ? [] : state.preOpenKeys
}

const getMenus = async () => {
  let res = await systemApi.getMenus()
  items.value = res.data.map((item) => {
    let menuItem = {
      key: `${item.id}`,
      label: item.label,
      title: item.label,
      path: item.path,
      icon: () => h(DesktopOutlined),
    }
    if (item.children) {
      menuItem.children = item.children.map((child) => ({
        key: `${child.id}`,
        label: child.label,
        title: child.label,
        path: item.path,
        icon: () => h(AppstoreOutlined),
      }))
    }
    return menuItem
  })
}
</script>

<style lang="scss" scoped>
.sider-menu {
  background-color: transparent;
}
</style>
