<script setup>
import { MailOutlined, AppstoreOutlined, SettingOutlined } from "@ant-design/icons-vue"
import { useStore } from "@/stores"
import { useRouter } from "vue-router"

import { h, onMounted, ref } from "vue"

const store = useStore()
const route = useRouter()
const userInfo = store.user().userInfo

onMounted(() => {
  const path = route.currentRoute.value.path.split("/").slice(-2)
  current.value = path.length === 2 ? path : ["personnel", "profile"]
})

const handleClick = (e) => {
  current.value = e.keyPath
  route.push("/center/" + e.keyPath[0] + "/" + e.keyPath[1])
}

const current = ref(["personnel", "profile"])
const items = ref([
  {
    key: "personnel",
    icon: () => h(MailOutlined),
    label: "个人中心",
    title: "个人中心",
    children: [
      {
        key: "profile",
        label: "个人信息",
        title: "个人信息",
      },
      {
        key: "follow",
        label: "我的关注",
        title: "我的关注",
      },
      {
        key: "history",
        label: "观看历史",
        title: "观看历史",
      },
    ],
  },
  {
    key: "live",
    icon: () => h(AppstoreOutlined),
    label: "我的直播间",
    title: "我的直播间",
    children: [
      {
        key: "live-info",
        label: "直播信息",
        title: "直播信息",
      },
      {
        key: "live-settings",
        label: "开播设置",
        title: "开播设置",
      },
      {
        key: "live-boss",
        label: "我的大哥",
        title: "我的大哥",
      },
    ],
  },
  {
    key: "dollar",
    icon: () => h(AppstoreOutlined),
    label: "我的钱包",
    title: "我的钱包",
    children: [
      {
        key: "wallet",
        label: "我的钱包",
        title: "我的钱包",
      },
      {
        key: "recharge",
        label: "购买金币",
        title: "购买金币",
      },
      {
        key: "bill",
        label: "交易记录",
        title: "交易记录",
      },
    ],
  },
  {
    key: "statistic",
    icon: () => h(SettingOutlined),
    label: "直播数据",
    title: "直播数据",
    children: [
      {
        key: "overview",
        label: "数据总览",
        title: "数据总览",
      },
      {
        key: "gift-list",
        label: "礼物流水",
        title: "礼物流水",
      },
      {
        key: "comment",
        label: "弹幕统计",
        title: "弹幕统计",
      },
      {
        key: "punishment",
        label: "运营奖惩",
        title: "运营奖惩",
      },
    ],
  },
])
</script>
<template>
  <div class="wrapper">
    <div class="portrait">
      <img draggable="false" :src="userInfo.avatar" width="80" height="80" />
      <div class="info">
        <span nick-name>{{ userInfo.nickName || "User" }}</span>
        <span level>lv6</span>
        <span uid>UID{{ userInfo.userId }}</span>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="menu-wrapper">
        <a-menu :selectedKeys="current" :openKeys="current" mode="inline" :items="items" @click="handleClick" />
      </div>
      <div class="content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  width: 1300px;
  margin: 0 auto;
  .portrait {
    width: 1300px;
    height: 180px;
    margin: 20px 0px 0px 0px;
    display: flex;
    align-items: center;
    background-color: #fff;
    transition: box-shadow 0.3s ease;
    cursor: pointer;
    img {
      width: 80px;
      height: 80px;
      overflow: hidden;
      border-radius: 40px;
      object-fit: cover;
      border: 1px solid rgba(205, 205, 205, 0.5);
      margin: 0px 20px;
    }
    .info {
      color: $font-color;
      font-weight: 400;
      span[nick-name] {
        font-weight: 400;
        font-size: 20px;
      }
      span[level] {
        display: block;
        font-size: 12px;
        line-height: 25px;
      }
      span[uid] {
        display: block;
        font-size: 14px;
        line-height: 25px;
      }
    }
  }
  .portrait:hover {
    box-shadow:
      0 5px 5px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  .content-wrapper {
    display: flex;
    align-items: flex-start;
    margin-top: 30px;
    .menu-wrapper {
      width: 200px;
    }
    .content {
      flex: 1;
      // background-color: #fff;
      margin-left: 10px;
    }
  }
}
</style>
