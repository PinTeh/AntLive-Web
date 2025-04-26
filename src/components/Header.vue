<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "@/stores"
import liveApi from "@/api/live"
import { DownOutlined } from "@ant-design/icons-vue"

const route = useRouter()
const store = useStore()

const userInfo = store.user().userInfo
const notIndexPage = ref(false)
const isLogin = store.user().isLogin
const visible = ref(true)
const hasAdminRole = ref(true)
const categorys = ref([])

onMounted(() => {
  liveApi.listCategories({}).then((res) => {
    const { list: data } = res.data
    categorys.value.push(...data)
  })
  store.web().selectCategory(null)
})
const handleCategoryClick = (item) => {
  store.web().selectCategory(item)
}
const handleLogin = () => {
  route.push("/login")
}
const handleGoToIndex = () => {
  route.push("/")
}
const handleLogout = () => {
  store.user().logout()
}
</script>
<template>
  <div class="main-header">
    <div class="main-header-nav">
      <div class="left-nav-container">
        <div class="nav-span" @click="handleGoToIndex">首页</div>
        <div>
          <a-popover v-if="!notIndexPage" v-model="visible">
            <template #content>
              <div class="popover-container">
                <a-button class="category-item" v-for="item in categorys" :key="item.id" plain size="mini" @click="handleCategoryClick(item)">
                  {{ item.name }}
                </a-button>
              </div>
            </template>
            <div class="nav-span">分类</div>
          </a-popover>
        </div>
      </div>
      <div class="right-nav-container">
        <div class="nav-span" v-if="!isLogin" href="#" @click="handleLogin">登录</div>
        <a-dropdown v-else>
          <span class="nav-span" href="#" @click="handleClick">
            <span class="nav-span-content">
              <img class="header-avatar" :src="userInfo?.avatar" />
              <span class="header-nickname">{{ userInfo?.nickName || "unknown" }}</span>
              <DownOutlined :style="{ fontSize: '12px' }" />
            </span>
          </span>
          <template #overlay>
            <a-menu slot="dropdown">
              <a-menu-item key="center"><a href="/#/center">个人中心</a></a-menu-item>
              <a-menu-item key="admin" v-if="hasAdminRole" command="/admin"><a target="_blank" href="/#/system">管理后台</a></a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout" divided><a href="javascript:;" @click="handleLogout">登出</a></a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-header {
  background: rgb(255, 255, 255);
  border-bottom: 2px solid #f3f3f3;
  height: 48px;
  text-align: center;
  width: 100%;
  position: sticky;
  top: 0px;
  z-index: 998;
}
.main-header-nav {
  width: 1300px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: start;
  .left-nav-container {
    display: flex;
    flex-grow: 2;
  }
  .right-nav-container {
    flex-grow: 1;
    display: flex;
    justify-content: right;
  }
}
.nav-span {
  line-height: 50px;
  min-width: 70px;
  color: black;
  .nav-span-content {
    padding: 10px;
  }
  .header-avatar {
    position: relative;
    top: 10px;
    width: 30px;
    height: 30px;
    border-radius: 30px;
    object-fit: cover;
  }
  .header-nickname {
    padding: 5px;
    font-size: 15px;
  }
}
.nav-span:hover {
  /* 主题颜色 */
  background: $primary-color;
  color: white;
  cursor: pointer;
  span {
    color: white;
  }
}
.popover-container {
  display: flex;
  width: 280px;
  flex-wrap: wrap;
  flex-flow: row wrap;
  gap: 8px;
}
</style>
