<template>
  <div class="live-settings">
    <a-flex>
      <div class="info-wrapper">
        <a-page-header title="直播间信息" sub-title="Live Room Info">
          <a-descriptions :column="1">
            <a-descriptions-item label="直播间 ID">
              <span class="link" title="">{{ roomInfo.id }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="直播间链接">
              <span class="link" title="">http://live.bilibili.com/10086</span>
            </a-descriptions-item>
            <a-descriptions-item label="直播间状态">
              <a-tag v-if="roomInfo.disabled !== 0" :bordered="false" color="error">封禁中</a-tag>
              <a-tag v-else :bordered="false" color="green">正常</a-tag>
            </a-descriptions-item>
          </a-descriptions>
        </a-page-header>
      </div>
      <div class="cover-wrapper">
        <a-page-header title="封面设置" sub-title="Cover Settings">
          <a-upload
            v-model:file-list="fileList"
            name="file"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="/api/v1/upload/room/cover"
            :before-upload="beforeUpload"
            @change="handleChange">
            <img class="cover-img" v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
              <loading-outlined v-if="loading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-page-header>
      </div>
    </a-flex>
    <a-flex>
      <div class="live-wrapper">
        <a-page-header title="开始直播" sub-title="Live Settings">
          <a-flex>
            <a-descriptions :column="1">
              <a-descriptions-item label="直播推流地址">
                <span class="link" title="">{{ roomLiveInfo.livePushUrl }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="直播推流密钥">
                <span class="link" title="">{{ roomLiveInfo.livePushSecret || "--" }}</span>
              </a-descriptions-item>
            </a-descriptions>
            <a-button v-if="roomLiveInfo.liveStatus === 0" type="primary" size="large" @click="startLive">
              <template #icon>
                <PlayCircleOutlined />
              </template>
              开始直播
            </a-button>
            <a-button v-else type="primary" danger @click="stopLive">
              <template #icon>
                <StopOutlined />
              </template>
              停止直播
            </a-button>
          </a-flex>
        </a-page-header>
      </div>
    </a-flex>
    <a-flex>
      <div class="config-wrapper">
        <a-page-header title="信息编辑" sub-title="Live Settings">
          <div class="settings">
            <a-form
              :model="formState"
              name="basic"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 22 }"
              autocomplete="off"
              @finish="onFinish"
              @finishFailed="onFinishFailed">
              <a-form-item label="直播标题" name="title" :rules="[{ required: true, message: '请填写直播标题!' }]">
                <a-input v-model:value="formState.title" />
              </a-form-item>
              <a-form-item label="直播公告" name="notice">
                <a-input v-model:value="formState.notice" />
              </a-form-item>
              <a-form-item label="直播分类" name="categoryId">
                <a-select ref="select" v-model:value="formState.categoryId" :options="categoryOptions"></a-select>
              </a-form-item>
              <a-form-item label="直播简介" name="introduce">
                <a-input v-model:value="formState.introduce" />
              </a-form-item>
              <a-form-item :wrapper-col="{ offset: 2, span: 22 }">
                <a-button type="primary" style="width: 80px" html-type="submit" :loading="saveBtnLoading">保存</a-button>
              </a-form-item>
            </a-form>
          </div>
        </a-page-header>
      </div>
    </a-flex>
    <LiveStats v-model="modalOpen" />
  </div>
</template>

<script setup>
import { reactive } from "vue"
import { ref, onMounted } from "vue"
import { message } from "ant-design-vue"
import { PlusOutlined, LoadingOutlined, PlayCircleOutlined, StopOutlined } from "@ant-design/icons-vue"
import liveAPI from "@/api/live"
import LiveStats from "./LiveStats.vue"

const fileList = ref([])
const loading = ref(false)
const modalOpen = ref(false)
const saveBtnLoading = ref(false)
const imageUrl = ref("")
const roomInfo = ref({})
const roomLiveInfo = ref({})
const formState = reactive({
  title: "",
  introduce: "",
  notice: "",
  categoryId: undefined,
})
const categoryOptions = ref([])

onMounted(() => {
  getRoomInfo()
  getLiveStatus()
  getCategories()
})

/**
 * 获取直播间信息
 */
const getRoomInfo = () => {
  liveAPI.getRoomSettingsInfo().then((res) => {
    if (res.code === 0) {
      const { data: room } = res
      roomInfo.value = room
      imageUrl.value = room.cover
      formState.title = room.title
      formState.notice = room.notice
      formState.introduce = room.introduce
      formState.categoryId = room.categoryId
    }
  })
}

/**
 * 获取直播分类
 */
const getCategories = () => {
  liveAPI.list().then((res) => {
    const { list: data } = res.data
    categoryOptions.value = []
    data.map((item) => {
      categoryOptions.value.push({
        label: item.name,
        value: item.id,
      })
    })
  })
}

/**
 * 获取直播状态
 * @returns {Promise<void>}
 */
const getLiveStatus = () => {
  liveAPI.getLiveStatus().then((res) => {
    if (res.code === 0) {
      roomLiveInfo.value = res.data
    }
  })
}

/**
 * 开始直播
 * @returns {Promise<void>}
 */
const startLive = () => {
  modalOpen.value = true
  // liveAPI.applySecret().then((res) => {
  //   if (res.code === 0) {
  //     message.success("直播已开始")
  //     getLiveStatus()
  //   } else {
  //     message.error(res.msg)
  //   }
  // })
}

/**
 * 停止直播
 * @returns {Promise<void>}
 */
const stopLive = () => {
  liveAPI.stopLive().then((res) => {
    if (res.code === 0) {
      message.success("直播已停止")
      getLiveStatus()
    } else {
      message.error(res.msg)
    }
  })
}

/**
 * 直播封面上传变更
 * @param info
 */
const handleChange = (info) => {
  if (info.file.status === "uploading") {
    loading.value = true
    return
  }
  if (info.file.status === "done") {
    // TODO: 上传成功
    loading.value = false
    console.log(info.file.response)
  }
  if (info.file.status === "error") {
    loading.value = false
    message.error("upload error")
  }
}
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
  if (!isJpgOrPng) {
    message.error("You can only upload JPG file!")
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!")
  }
  return isJpgOrPng && isLt2M
}

const onFinish = async (values) => {
  try {
    saveBtnLoading.value = true
    const res = await liveAPI.saveRoomInfo({
      title: values.title,
      notice: values.notice,
      cid: values.categoryId,
      introduce: values.introduce,
    })
    if (res.code === 0) {
      getRoomInfo()
      message.success("保存成功")
    }
  } finally {
    saveBtnLoading.value = false
  }
}
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo)
}
</script>

<style scoped lang="scss">
.live-settings {
  display: flex;
  flex-direction: column;
  .info-wrapper {
    background-color: #fff;
    flex: 1;
    .link {
      font-size: 14px;
      font-weight: 500;
      color: #00b7ff;
      cursor: pointer;
    }
  }
  .cover-wrapper {
    margin-left: 10px;
    background-color: #fff;
    ::v-deep .ant-upload {
      width: 245px;
      height: 135px;
    }
    .cover-img {
      object-fit: cover;
      width: 250px;
      height: 140px;
    }
  }
  .live-wrapper {
    margin-top: 10px;
    width: 100%;
    background-color: #fff;
    .link {
      font-size: 14px;
      font-weight: 500;
      color: #666;
      cursor: pointer;
    }
  }
  .config-wrapper {
    margin-top: 10px;
    background-color: #fff;
    width: 100%;
    .settings {
      margin-bottom: 20px;
    }
  }
}
</style>
