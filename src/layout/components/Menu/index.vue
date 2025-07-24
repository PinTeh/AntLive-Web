<template>
  <a-menu class="sider-menu" v-model:openKeys="state.openKeys" v-model:selectedKeys="state.selectedKeys" mode="inline"
    :inline-collapsed="menuCollapse" :items="items" @click="handleClick">
  </a-menu>
</template>

<script setup>
import systemApi from "@/api/system"
import { ref, watch, h, onMounted, reactive, computed } from "vue"
import { useStore } from "@/stores"
import { useRouter } from "vue-router"
import SvgIcon from "@/components/SvgIcon/index.vue"

const router = useRouter()
const state = reactive({
  collapsed: false,
  selectedKeys: [""],
  openKeys: [""],
  preOpenKeys: [""],
})
const items = ref([])
const webStore = useStore().web()
const menuCollapse = computed(() => webStore.menuCollapse)
const selectItems = ref([])

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

/**
 * 菜单点击事件
 */
const handleClick = (e) => {
  console.log("click", e)
  console.log("state", state)
  console.log("items", items.value)
  selectItems.value = []
  getSelectMenus(0, e.keyPath, items.value)
  webStore.setMenuSelect(selectItems.value)
  router.push("/system/" + selectItems.value.map((item) => item.path).join("/"))
}

/**
 * 递归获取选中的菜单
 */
const getSelectMenus = (i, path, menus) => {
  if (path.length <= i) return
  let key = path[i]
  let menu = menus.find((item) => item.key === key)
  selectItems.value.push(menu)
  getSelectMenus(i + 1, path, menu.children)
}

const toggleCollapsed = () => {
  state.collapsed = !state.collapsed
  state.openKeys = state.collapsed ? [] : state.preOpenKeys
}

/**
 * 获取用户有权限的菜单列表
 */
const getMenus = async () => {
  let res = await systemApi.getMenus()
  items.value = res.data.map((item) => {
    let menuItem = {
      key: `${item.id}`,
      label: item.label,
      title: item.label,
      path: item.path,
      icon: () => h(SvgIcon, { icon: item.icon, size: "15px" }),
    }
    if (item.children) {
      menuItem.children = item.children.map((child) => ({
        key: `${child.id}`,
        label: child.label,
        title: child.label,
        path: child.path,
        icon: () => h(SvgIcon, { icon: child.icon, size: "15px" }),
      }))
    }
    return menuItem
  })
  
  // 只设置选中的菜单，不自动展开所有菜单
  state.selectedKeys = [items.value[0].key]
  // 不设置默认展开的菜单，让用户自己点击展开
  state.openKeys = []
}
</script>

<style lang="scss" scoped>
.sider-menu {
  background-color: transparent;
}
</style>
