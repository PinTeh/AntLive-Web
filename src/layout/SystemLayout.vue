<template>
  <a-layout class="layout">
    <Sider></Sider>
    <a-layout>
      <Header></Header>
      <a-layout-content>
        <div class="content">
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
  .content {
    background-color: #eeeeee;
    padding: 10px;
  }
}
</style>
