<template>
  <div class="main">
    <div class="content-wrapper">
      <div class="content">
        <div class="nav">
          <a-breadcrumb>
            <a-breadcrumb-item>
              <a @click="handleAllClick">全部</a>
            </a-breadcrumb-item>
            <a-breadcrumb-item v-if="!!currentSelectCategory">
              <a>{{ currentSelectCategory.name }}</a>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="main">
          <LiveRoom v-for="item in livingRooms" :room="item" :key="item.id"></LiveRoom>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "@/stores"
import liveApi from "@/api/live"
import { computed, onMounted, ref, watch } from "vue"
import LiveRoom from "@/components/LiveRoom.vue"

const store = useStore()
const currentSelectCategory = computed(() => {
  return store.web().category.currentSelect
})

watch(
  () => currentSelectCategory.value,
  () => {
    getLiveRooms()
  }
)

const livingRooms = ref([])

onMounted(() => {
  getLiveRooms()
})

/**
 * 获取直播列表
 */
const getLiveRooms = () => {
  liveApi
    .listLivingRooms({
      cid: currentSelectCategory.value?.id,
    })
    .then((res) => {
      livingRooms.value = []
      const { list } = res.data
      livingRooms.value.push(...list)
    })
}

const handleAllClick = () => {
  store.web().selectCategory(null)
}
</script>

<style lang="scss" scoped>
.aa {
  color: $primary-color;
}
.main {
  .content-wrapper {
    height: calc(100vh - 50px - 30px);
    display: flex;
    flex-direction: column;
    width: 100%;
    .content {
      flex: 1;
      width: 1280px;
      margin: 0 auto;
      .nav {
        padding: 10px;
        height: 20px;
      }
      .main {
        display: grid;
        grid-template-columns: repeat(4, 320px);
      }
    }
  }
}
</style>
