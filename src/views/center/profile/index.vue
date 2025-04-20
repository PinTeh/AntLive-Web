<template>
  <div class="profile-wrapper">
    <a-card title="基本信息" class="left">
      <div class="avatar-wrapper">
        <a-upload
          v-model:file-list="fileList"
          name="file"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          action="/api/api/v1/upload/avatar"
          :headers="userToken"
          :before-upload="beforeUpload"
          @change="handleChange">
          <img class="avatar-img" v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
      </div>
      <a-descriptions :column="1" :colon="false">
        <a-descriptions-item class="label-with-icon">
          <template #label>
            <div><IdcardOutlined /><span>ID</span></div>
          </template>
          <span val>{{ userInfo.userId || "" }}</span>
        </a-descriptions-item>
        <a-descriptions-item class="label-with-icon">
          <template #label>
            <div><UserOutlined /><span>昵称</span></div>
          </template>
          <span val>{{ userInfo.nickName || "" }}</span>
        </a-descriptions-item>
        <a-descriptions-item class="label-with-icon">
          <template #label>
            <div><MessageOutlined /><span>签名</span></div>
          </template>
          <span val>{{ userInfo.signature || "这个人很懒，什么都没留下" }}</span>
        </a-descriptions-item>
        <!-- <a-descriptions-item class="label-with-icon">
          <template #label>
            <div><MobileOutlined /><span>手机</span></div>
          </template>
          <span val>{{ userInfo.mobile || "--" }}</span>
        </a-descriptions-item>
        <a-descriptions-item class="label-with-icon">
          <template #label>
            <div><MailOutlined /><span>邮箱</span></div>
          </template>
          <span val>{{ userInfo.email || "--" }}</span>
        </a-descriptions-item> -->
      </a-descriptions>
    </a-card>
    <div class="right">
      <a-card title="账号安全" class="security-settings">
        <SecurityItem />
      </a-card>
      <a-card title="信息认证" class="other-account">
        <Authentication />
      </a-card>
    </div>
  </div>
</template>

<script setup>
import SecurityItem from "./SecurityItem.vue"
import Authentication from "./Authentication.vue"
import { UserOutlined, MessageOutlined, IdcardOutlined, PlusOutlined, MailOutlined, MobileOutlined } from "@ant-design/icons-vue"
import { useStore } from "@/stores"
import { message } from "ant-design-vue"
import { computed, onMounted, ref } from "vue"

const store = useStore()
const userInfo = store.user().userInfo
const fileList = ref([])
const loading = ref(false)
const imageUrl = ref("")

const userToken = computed(() => {
  return {
    Authorization: `${store.user().userToken}`,
  }
})

onMounted(() => {
  imageUrl.value = userInfo.avatar
})

/**
 * 文件上传
 */
const handleChange = (info) => {
  if (info.file.status === "uploading") {
    loading.value = true
    return
  }
  if (info.file.status === "done") {
    imageUrl.value = info.file.response.data
    store.user().updateAvatar(imageUrl.value)
    loading.value = false
  }
  if (info.file.status === "error") {
    loading.value = false
    message.error("upload error")
  }
}
/**
 * 图片大小判断
 */
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
  if (!isJpgOrPng) {
    message.error("只能上传JPG格式图片!")
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error("上传文件大小不能超过2MB!")
  }
  return isJpgOrPng && isLt2M
}
</script>

<style lang="scss" scoped>
.profile-wrapper {
  display: flex;
  flex-direction: row;
  .left {
    width: 300px;
    height: 500px;
    background-color: #fff;
    .avatar-wrapper {
      height: 100px;
      margin: 20px 0px 40px 0px;
      .ant-upload-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        ::v-deep .ant-upload {
          width: 105px;
          height: 105px;
          border-radius: 50%;
        }
        .ant-upload-text {
          margin-top: 8px;
          color: #666;
        }
      }
      .avatar-img {
        width: 110px;
        height: 110px;
        border-radius: 50%;
        object-fit: cover;
      }
    }
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
      background-color: #fff;
      ::v-deep .ant-card-body {
        padding: 0px;
      }
    }
    .other-account {
      margin-top: 25px;
      background-color: #fff;
      ::v-deep .ant-card-body {
        padding: 0px;
      }
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
    span[val] {
      color: $font-color-light;
    }
  }
  ::v-deep(.ant-card-head) {
    background: linear-gradient(180deg, #e8f4ff80, #fff0);
  }
}
</style>
