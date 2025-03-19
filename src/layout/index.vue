<template>
  <div>
    <Header></Header>
    <div class="app-content">
      <RouterView />
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
</script>

<style lang="scss" scoped>
.app-content {
  overflow: auto;
  height: calc(100vh - 80px);
  scrollbar-gutter: stable;
}
</style>
