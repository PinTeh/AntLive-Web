<template>
  <section class="logo-wrapper">
    <img class="logo" src="/vite.svg" alt="logo" />
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  .logo {
    width: 25px;
    height: 25px;
    border-radius: 6px;
    transition: all 0.2s;
  }
}
</style>
