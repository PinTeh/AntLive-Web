<script setup>
import { useRouter} from "vue-router"

const router = useRouter()
const props = defineProps({
  room: {
    type: Object,
    default: () => ({}),
  }
})

const handleItemClick = () => {
    router.push({ path: `/room/${props.room.id}`})
}
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
          <span>{{room.popularity || '1'}}万</span>
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
