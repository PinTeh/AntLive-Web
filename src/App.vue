<script setup>
import Footer from "@/components/Footer.vue"
</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        // colorPrimary: '#00b96b',
        // borderRadiuos: '1px',
      },
    }">
    <RouterView />
    <Footer></Footer>
  </a-config-provider>
</template>

<style scoped></style>
