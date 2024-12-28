<template>
  <div>
    <h1 v-for="item in list" :key="item.id">{{ item.name }}</h1>
    <!-- <h2>{{ store.user.token }}</h2> -->
    <RouterLink to="/">Go to Home</RouterLink>
    <RouterLink to="/login">Go to Login</RouterLink>
  </div>
</template>

<script setup>
import { useStore } from "@/stores"
import liveApi from "@/api/live"
import { onMounted, reactive } from "vue"
const store = useStore()
console.log(store.user().user.token)

//
const list = reactive([])

onMounted(() => {
  liveApi.list({}).then((res) => {
    const { list: data } = res.data
    list.push(...data)
  })
})
</script>

<style lang="scss" scoped></style>
