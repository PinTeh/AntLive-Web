<template>
  <div>
    <h1 class="aa" v-for="item in list" :key="item.id">{{ item.name }}</h1>
    <!-- <h2>{{ store.user.token }}</h2> -->
    <h2>{{ store.user().userInfo?.nickName || "unKnown" }}</h2>
    <RouterLink to="/">Go to Home</RouterLink>
    <RouterLink to="/login">Go to Login</RouterLink>
  </div>
</template>

<script setup>
import { useStore } from "@/stores"
import liveApi from "@/api/live"
import { onMounted, reactive } from "vue"
const store = useStore()
console.log(store.user().userInfo.nickName)

//
const list = reactive([])

onMounted(() => {
  liveApi.list({}).then((res) => {
    const { list: data } = res.data
    list.push(...data)
  })
})
</script>

<style lang="scss" scoped>
.aa {
  color: $primary-color;
}
</style>
