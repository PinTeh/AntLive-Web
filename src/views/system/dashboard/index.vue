<template>
  <div class="dashboard">
    <div class="dashboard-grid">
      <div class="left-column">
        <div class="profile-card">
          <a-avatar v-if="avatarUrl" :src="avatarUrl" :size="72" />
          <a-avatar v-else :size="72" style="background-color: #1677ff;">
            {{ avatarText }}
          </a-avatar>
          <div class="profile-meta">
            <div class="nickname">{{ displayName }}</div>
            <div class="signature">{{ signatureText }}</div>
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-grid">
            <a-statistic title="用户数量" :value="statValues.userCount" />
            <a-statistic title="直播数量" :value="statValues.liveCount" />
            <a-statistic title="充值金额" :value="statValues.rechargeAmount" :precision="2" />
            <a-statistic title="弹幕数量" :value="statValues.messageCount" />
          </div>
        </div>

        <div class="traffic-card">
          <div class="traffic-title">今日系统访问量</div>
          <div class="traffic-placeholder">预留区域</div>
        </div>
      </div>

      <div class="right-column">
        <div class="side-card">
          <div class="side-title">快捷信息</div>
          <div class="side-text">预留区域</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import systemUserApi from '@/api/systemUser'
import systemRoomApi from '@/api/systemRoom'
import systemMessageApi from '@/api/system/systemMessage'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo || {})

const avatarUrl = computed(() => userInfo.value.avatar || '')
const displayName = computed(() => userInfo.value.nickName || userInfo.value.nickname || userInfo.value.username || '未命名用户')
const signatureText = computed(() => userInfo.value.signature || '这个人很懒，什么都没留下')

const avatarText = computed(() => displayName.value.slice(0, 1).toUpperCase())

const statValues = reactive({
  userCount: 0,
  liveCount: 0,
  rechargeAmount: 0,
  messageCount: 0,
})

onMounted(() => {
  fetchDashboardStats()
})

const fetchDashboardStats = async () => {
  const [userRes, roomRes, messageRes] = await Promise.allSettled([
    systemUserApi.getPageUsers({ pageNo: 1, pageSize: 1 }),
    systemRoomApi.getPageRooms({ pageNo: 1, pageSize: 1 }),
    systemMessageApi.pageDetail({ pageNo: 1, pageSize: 1 }),
  ])

  if (userRes.status === 'fulfilled') {
    statValues.userCount = Number(userRes.value?.data?.total || 0)
  }
  if (roomRes.status === 'fulfilled') {
    statValues.liveCount = Number(roomRes.value?.data?.total || 0)
  }
  if (messageRes.status === 'fulfilled') {
    statValues.messageCount = Number(messageRes.value?.data?.total || 0)
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 20px 0;
  height: 100%;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 8fr 2fr;
  gap: 20px;
  height: 100%;
}

.left-column,
.right-column {
  min-width: 0;
}

.profile-card {
  height: 120px;
  padding: 24px;
  background: linear-gradient(135deg, #f8fbff 0%, #eef5ff 100%);
  border: 1px solid #e8efff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 16px;

  .profile-meta {
    min-width: 0;
  }

  .nickname {
    font-size: 22px;
    line-height: 30px;
    font-weight: 600;
    color: #1f2937;
  }

  .signature {
    margin-top: 8px;
    color: #4b5563;
    font-size: 14px;
    line-height: 20px;
    word-break: break-word;
  }
}

.stats-card {
  margin-top: 16px;
  height: 120px;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  background: #fff;
  padding: 16px 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  height: 100%;
  align-items: center;
}

.stats-grid :deep(.ant-statistic) {
  min-width: 0;
}

.stats-grid :deep(.ant-statistic-title) {
  font-size: 13px;
  color: #6b7280;
}

.stats-grid :deep(.ant-statistic-content) {
  font-size: 24px;
  color: #1f2937;
}

.traffic-card {
  margin-top: 16px;
  height: 250px;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  background: #fff;
  padding: 16px 20px;
}

.traffic-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.traffic-placeholder {
  height: calc(100% - 28px);
  margin-top: 12px;
  border-radius: 8px;
  background: #f8fafc;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.side-card {
  height: 200px;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  background: #fff;

  .side-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }

  .side-text {
    margin-top: 12px;
    font-size: 13px;
    color: #6b7280;
  }
}

@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
