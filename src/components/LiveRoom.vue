<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useRouter} from "vue-router"
import ChatApi from "@/api/chat"

const router = useRouter()
const props = defineProps({
  room: {
    type: Object,
    default: () => ({}),
  }
})
const roomId = computed(() => Number(props.room?.id || 0))
const popularity = ref(0)
const popularityTimer = ref(null)

const handleItemClick = () => {
    router.push({ path: `/room/${props.room.id}`})
}

const formatPopularity = (value) => {
  const count = Number(value || 0)
  if (!Number.isFinite(count) || count <= 0) {
    return "0"
  }
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1).replace(/\.0$/, "")}万`
  }
  return `${count}`
}

const loadPopularity = async () => {
  if (!roomId.value) {
    popularity.value = 0
    return
  }
  try {
    const res = await ChatApi.getPopularity({ roomId: roomId.value })
    popularity.value = Number(res?.data || 0)
  } catch (error) {
    popularity.value = Number(props.room?.popularity || 0)
  }
}

const clearPopularityTimer = () => {
  if (popularityTimer.value) {
    clearInterval(popularityTimer.value)
    popularityTimer.value = null
  }
}

const startPopularityPolling = () => {
  clearPopularityTimer()
  loadPopularity()
  popularityTimer.value = setInterval(() => {
    loadPopularity()
  }, 10000)
}

onMounted(() => {
  startPopularityPolling()
})

watch(roomId, () => {
  startPopularityPolling()
})

onBeforeUnmount(() => {
  clearPopularityTimer()
})
</script>

<template>
  <a-card hoverable class="live-room-card" :bodyStyle="{ padding: 0, borderRadius: 2 }" @click="handleItemClick">
    <img draggable="false" class="cover" :src="room.cover"> </img>
    <!-- <a-tag class="tag" type="success" effect="plain"> 直播 </a-tag> -->
    <span class="legibility"> 蓝光10M </span>
    <div class="live-room-info-container">
      <span title>{{ room.title }}</span>
      <div class="bottom">
        <img class="avatar" :src="room.userInfo.avatar" />
        <span class="nick-name">{{ room.userInfo.name || 'User'}}</span>
        <span class="fire">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-renqi"></use>
          </svg>
          <span>{{ formatPopularity(popularity) }}</span>
        </span>
      </div>
    </div>
  </a-card>
</template>

<style lang="scss" scoped>
.live-room-card {
  width: 300px;
  height: 240px;
  cursor: pointer;
  margin: 10px;
  position: relative;
  border: 0px;
  .tag {
    position: absolute;
    left: 7px;
    top: 7px;
    height: 24px;
    line-height: 24px;
    background-color: #ffffff6b;
  }
  .legibility {
    position: absolute;
    right: 7px;
    top: 7px;
    background-color: #1f69ffcc;
    padding: 0 5px;
    height: 20px;
    font-size: 8px;
    line-height: 20px;
    color: #fff;
    border-radius: 3px;
    text-align: center;
    display: inline-block;
  }
  .cover {
    width: 300px;
    height: 170px;
    display: block;
    padding: 0px;
    -webkit-user-drag: none;
    object-fit: cover;
  }
  .live-room-info-container {
    padding: 10px;
    span[title]{
      display:inline-block;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space:nowrap;
    }
    .bottom{
      .avatar {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .nick-name {
        font-size: 13px;
        color: rgb(112, 112, 112);
        vertical-align: top;
        line-height: 22px;
      }
      .fire {
        font-size: 14px;
        color: #999;
        line-height: 22px;
        float: right;
        .icon{
          height: 14px;
          width: 14px;
          margin-right: 2px
        }
        span {
          font-size: 10px;
          color: #999;
          margin-left: 2px;
        }
      }
    }
  }
}
</style>
