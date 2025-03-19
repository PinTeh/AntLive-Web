<template>
  <div class="profile-wrapper">
    <a-card title="基本信息" class="left">
      <a-descriptions :column="1" :colon="false">
        <a-descriptions-item class="label-with-icon">
          <template #label>
            <div><IdcardOutlined /><span>ID</span></div>
          </template>
          {{ userInfo.userId || "" }}
        </a-descriptions-item>
        <a-descriptions-item class="label-with-icon">
          <template #label>
            <div><UserOutlined /><span>昵称</span></div>
          </template>
          {{ userInfo.nickName || "" }}
        </a-descriptions-item>
        <a-descriptions-item class="label-with-icon">
          <template #label>
            <div><MessageOutlined /><span>签名</span></div>
          </template>
          {{ userInfo.signature || "这个人很懒，什么都没留下" }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <div class="right">
      <a-card title="安全设置" class="security-settings">
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </a-card>
      <a-card title="其他信息" class="other-account">
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { UserOutlined, MessageOutlined, IdcardOutlined } from "@ant-design/icons-vue"
import { useStore } from "@/stores"

const store = useStore()
const userInfo = store.user().userInfo
console.log(userInfo)
</script>

<style lang="scss" scoped>
.profile-wrapper {
  //   border: 1px solid red;
  // background-color: #fff;
  // height: 800px;
  display: flex;
  flex-direction: row;
  .left {
    width: 300px;
    height: 500px;
    background-color: #fff;
    span {
      font-size: 16px;
      color: &color-primary;
    }
  }
  .right {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-left: 15px;
    .security-settings {
      height: 200px;
      background-color: #fff;
    }
    .other-account {
      margin-top: 25px;
      height: 200px;
      background-color: #fff;
    }
  }
  .label-with-icon {
    display: flex;
    align-items: center;
    span {
      margin-left: 5px;
      font-size: 14px;
      color: $font-color;
    }
  }
}
</style>
