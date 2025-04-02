<script setup>
import { MailOutlined, AppstoreOutlined, WalletOutlined, PlaySquareOutlined, BarChartOutlined } from "@ant-design/icons-vue"
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
    icon: () => h(PlaySquareOutlined),
    label: "我的直播间",
    title: "我的直播间",
    children: [
      {
        key: "live-settings",
        label: "开播设置",
        title: "开播设置",
      },
    ],
  },
  {
    key: "dollar",
    icon: () => h(WalletOutlined),
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
        label: "购买果子",
        title: "购买果子",
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
    icon: () => h(BarChartOutlined),
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
        <a-flex align="center">
          <span nick-name>{{ userInfo.nickName || "Hello World" }}</span>
          <svg class="level-icon" aria-hidden="true">
            <use xlink:href="#icon-ic_userlevel_5"></use>
          </svg>
        </a-flex>
        <span uid>{{ userInfo.signature || "这个人很懒，什么都没留下" }}</span>
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
    height: 160px;
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
    img:hover {
      border: 1px solid rgba(118, 118, 118, 0.5);
    }
    .info {
      color: $font-color;
      font-weight: 400;
      .level-icon {
        height: 25px;
        width: 30px;
        margin-left: 5px;
      }
      span[nick-name] {
        font-weight: 400;
        font-size: 20px;
        line-height: 20px;
      }
      span[uid] {
        margin-top: 10px;
        display: block;
        font-size: 14px;
        color: $font-color-light;
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
    margin-top: 20px;
    margin-bottom: 20px;
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
