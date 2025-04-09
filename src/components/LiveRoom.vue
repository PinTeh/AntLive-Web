<script setup>
import { reactive } from "vue"

const handleClick = () => {}
const room = reactive({
  cover: "http://localhost:9000/live.file.bucket/【报纸女孩】2024-09-03 07_35_35_1725495031.png",
  title: "xxx",
  userInfo: {
    name: "Pinteh",
    avatar: "http://localhost:9000/live.file.bucket/【报纸女孩】2024-09-03 07_35_35_1725495031.png",
  },
})
</script>

<template>
  <a-card hoverable class="live-room-card" @click.native="handleClick" :bodyStyle="{ padding: 0, borderRadius: 2 }">
    <a-image :preview="false" draggable="false" class="live-room-image-cover" :src="room.cover"> </a-image>
    <a-tag class="live-room-tag" type="success" effect="plain"> 直播 </a-tag>
    <span class="live-room-tag-legibility"> 蓝光10M </span>
    <div class="live-room-info-container">
      <span class="title">{{ room.title }}</span>
      <div class="bottom clearfix">
        <img class="avatar" :src="room.userInfo.avatar" />
        <span class="nick-name">{{ room.userInfo.name }}</span>
        <span class="fire ant-live icon-huo">
          <span>4.9万</span>
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
  .live-room-image-cover {
    width: 300px;
    height: 170px;
    display: block;
    padding: 0px;
    -webkit-user-drag: none;
  }
  .live-room-info-container {
    padding: 14px;
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
      span {
        font-size: 10px;
        color: #999;
        margin-left: 2px;
      }
    }
  }
}
.live-room-tag {
  position: absolute;
  left: 7px;
  top: 7px;
  height: 24px;
  line-height: 24px;
  background-color: #ffffff6b;
}
.live-room-tag-legibility {
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
.bottom {
  margin-top: 5px;
  line-height: 20px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
