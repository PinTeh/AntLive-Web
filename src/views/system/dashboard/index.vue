<template>
  <div class="dashboard">
    <div class="overview-section">
      <div class="overview-card">
        <div class="card-title">访问次数</div>
        <div class="card-value">{{ visitCount }}</div>
        <div class="card-trend">
          <span :class="[visitTrend > 0 ? 'up' : 'down']">{{ Math.abs(visitTrend) }}%</span>
          较上周
        </div>
      </div>
      <div class="overview-card">
        <div class="card-title">独立IP</div>
        <div class="card-value">{{ uniqueIpCount }}</div>
        <div class="card-trend">
          <span :class="[ipTrend > 0 ? 'up' : 'down']">{{ Math.abs(ipTrend) }}%</span>
          较上周
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import systemAPI from '@/api/system'

// 数据定义
const visitCount = ref(0)
const uniqueIpCount = ref(0)
const visitTrend = ref(5) // 默认值，实际应从API获取
const ipTrend = ref(-2) // 默认值，实际应从API获取

// 获取数据
onMounted(() => {
  fetchOverviewData()
})

const fetchOverviewData = () => {
  // 这里应该调用实际的API
  // 示例：
  // systemAPI.getSystemOverview().then(res => {
  //   if (res.code === 0) {
  //     visitCount.value = res.data.visitCount
  //     uniqueIpCount.value = res.data.uniqueIpCount
  //     visitTrend.value = res.data.visitTrend
  //     ipTrend.value = res.data.ipTrend
  //   }
  // })
  
  // 模拟数据
  setTimeout(() => {
    visitCount.value = 12580
    uniqueIpCount.value = 3456
  }, 500)
}
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 20px;
}

.overview-section {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.overview-card {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  
  .card-title {
    font-size: 16px;
    color: #666;
    margin-bottom: 10px;
  }
  
  .card-value {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }
  
  .card-trend {
    font-size: 14px;
    color: #999;
    
    .up {
      color: #f56c6c;
      &:before {
        content: '↑';
      }
    }
    
    .down {
      color: #67c23a;
      &:before {
        content: '↓';
      }
    }
  }
}
</style>
