<template>
  <div>
    <h1>hh</h1>
    <!-- <h2>{{ store.user.token }}</h2> -->
    <RouterLink to="/">Go to Home</RouterLink>
    <RouterLink to="/login">Go to Login</RouterLink>
  </div>
</template>

<script setup>
import { useStore } from "@/stores"
const store = useStore()
console.log(store.user().user.token)
</script>

<style lang="scss" scoped></style>
