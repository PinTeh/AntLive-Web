<script setup></script>

<template>
  <a-config-provider
    :theme="{
      token: {
        // colorPrimary: '#00b96b',
        // borderRadiuos: '1px',
      },
    }">
    <RouterView />
  </a-config-provider>
</template>

<style scoped></style>
