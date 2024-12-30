<template>
  <div class="main">
    <Header></Header>

    <!-- <div class="content-wrapper">
      <div class="content">
        <LiveRoom></LiveRoom>
        <LiveRoom></LiveRoom>
        <LiveRoom></LiveRoom>
        <LiveRoom></LiveRoom>
        <LiveRoom></LiveRoom>
        <LiveRoom></LiveRoom>
        <LiveRoom></LiveRoom>
        <LiveRoom></LiveRoom>
        <LiveRoom></LiveRoom>
        <LiveRoom></LiveRoom>
        <LiveRoom></LiveRoom>
        <LiveRoom></LiveRoom>
        <LiveRoom></LiveRoom>
      </div>
    </div> -->
    <RecomandRooms />
    <RecomandRooms />
    <RecomandRooms />
    <RecomandRooms />
  </div>
</template>

<script setup>
import { useStore } from "@/stores"
import liveApi from "@/api/live"
import { onMounted, reactive } from "vue"
import LiveRoom from "@/components/LiveRoom.vue"
import RecomandRooms from "@/components/RecomandRooms.vue"
import Header from "@/components/Header.vue"
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
.main {
  .content-wrapper {
    overflow: auto;
    height: calc(100vh - 50px - 30px);
    display: flex;
    flex-direction: column;
    .content {
      flex: 1;
      width: 1280px;
      display: grid;
      grid-template-columns: repeat(4, 320px);
      margin: 0 auto;
      // border: 1px solid red;
    }
  }
}
</style>
