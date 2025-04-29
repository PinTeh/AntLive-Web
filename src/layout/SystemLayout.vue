<template>
  <a-layout class="layout">
    <Sider></Sider>
    <a-layout>
      <Header></Header>
      <a-layout-content>
        <div class="content">
          <div class="content-breadcrumb">
            <a-breadcrumb>
              <a-breadcrumb-item>Home</a-breadcrumb-item>
              <a-breadcrumb-item><a href="">Application Center</a></a-breadcrumb-item>
              <a-breadcrumb-item>An Application</a-breadcrumb-item>
            </a-breadcrumb>
          </div>
          <RouterView />
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
    padding: 10px 20px 0px 20px;
    .content-breadcrumb {
      margin-bottom: 15px;
    }
  }
}
</style>
