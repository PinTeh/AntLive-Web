<template>
  <a-layout class="layout">
    <Sider></Sider>
    <a-layout>
      <Header></Header>
      <a-layout-content>
        <div class="content">
          <div class="content-breadcrumb">
            <a-breadcrumb>
              <a-breadcrumb-item>首页</a-breadcrumb-item>
              <a-breadcrumb-item v-for="item in menuSelect">
                <a href="">{{ item.label }}</a>
              </a-breadcrumb-item>
            </a-breadcrumb>
          </div>
          <div class="subpage-body">
            <RouterView />
          </div>
        </div>
      </a-layout-content>
      <Footer></Footer>
    </a-layout>
  </a-layout>
</template>

<script setup>
import Header from "./components/Header/index.vue"
import Sider from "./components/Sider/index.vue"
import Footer from "./components/Footer/index.vue"
import { useStore } from "@/stores"
import { computed } from "vue"

const menuSelect = computed(() => {
  return useStore().web().menuSelect
})
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;
  // background-color: linear-gradient(#ffffff, #f5f5f5 28%);
  background-color: #fff;
  .content {
    // background-color: transparent;
    background-color: #fff;
    margin: 10px;
    padding: 10px 20px 10px 20px;
    height: calc(100vh - 100px);
    display: flex;
    flex-direction: column;
    min-height: 0;
    .content-breadcrumb {
      margin-bottom: 15px;
    }
    .subpage-body {
      flex: 1;
      min-height: 0;
      position: relative;
      display: flex;
      flex-direction: column;

      :deep(.content-wrapper) {
        flex: 1;
        min-height: 0;
        position: relative;
        padding-bottom: 62px;
      }

      :deep(.ant-table-wrapper) {
        position: static !important;
      }

      :deep(.ant-spin-nested-loading) {
        position: static !important;
      }

      :deep(.content-wrapper .ant-pagination) {
        position: absolute !important;
        right: 0;
        bottom: 0;
        margin: 0 !important;
        z-index: 10;
        background: rgba(255, 255, 255, 0.96);
        padding: 6px 10px;
        border-radius: 6px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
      }
    }
  }
}
</style>
