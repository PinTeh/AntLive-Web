<template>
  <div class="wallet">
    <a-page-header title="我的钱包" sub-title="My wallet">
      <a-flex>
        <div class="left">
          <a-flex align="center" class="wallet-info">
            <svg class="wallet-icon" aria-hidden="true">
              <use xlink:href="#icon-kaixinguo"></use>
            </svg>
            <h3>开心果余额：</h3>
            <span>{{ balance }}</span>
          </a-flex>
          <div class="wallet-record">
            <span title>开心果记录</span>
            <span tips>最近的变化情况</span>
            <a-table :dataSource="dataSource" :columns="columns" size="small" bordered :pagination="false" />
          </div>
        </div>
        <div class="right">
          <h4>开心果有什么用？</h4>
          <p>开心果是AntLive世界中非常重要的物品</p>
          <p>开心果用于对优秀的主播进行打赏支持，这是对主播的一种肯定</p>
          <h4>如何获得开心果？</h4>
          <p>
            充钱
            <a href="#" @click="">立即充值</a>
          </p>
          <h4>如何将开心果提现？</h4>
          <p>
            提现
            <a href="#" @click="">去提现</a>
          </p>
        </div>
      </a-flex>
    </a-page-header>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import walletApi from "@/api/wallet"

const balance = ref(0)

onMounted(() => {
  getBalance()
  listLogs()
})

/**
 * 获取钱包余额
 */
const getBalance = async () => {
  const res = await walletApi.getBalance()
  if (res.code === 0) {
    balance.value = res.data.balance
  }
}

const listLogs = async () => {
  const res = await walletApi.listRecentWalletLogs()
  if (res.code === 0) {
    dataSource.value = res.data.list
  }
}

const dataSource = ref([])
const columns = ref([
  {
    title: "时间",
    dataIndex: "createTime",
    key: "createTime",
    width: 220,
  },
  {
    title: "变化",
    dataIndex: "fee",
    key: "fee",
    customRender: ({ text }) => {
      return text > 0 ? `+${text}` : `-${text}`
    },
    width: 120,
  },
  {
    title: "备注",
    dataIndex: "remark",
    key: "remark",
  },
])
</script>

<style lang="scss" scoped>
.wallet {
  min-height: 350px;
  background-color: #fff;
  .left {
    width: 50%;
    height: 100%;
    .wallet-info {
      .wallet-icon {
        width: 30px;
        height: 30px;
        margin: 0px 10px;
      }
      h3 {
        color: $font-color;
      }
      span {
        font-size: 20px;
        color: rgb(0, 136, 255);
        font-weight: 600;
      }
    }
    .wallet-record {
      margin-top: 20px;
      span[title] {
        font-weight: 600;
        margin-left: 5px;
      }
      span[tips] {
        font-size: 12px;
        color: #999;
        margin-left: 10px;
      }
      ::v-deep .ant-table-wrapper {
        margin-top: 10px;
      }
    }
  }
  .right {
    margin-left: 60px;
    h4 {
      margin: 20px 0px 5px 0px;
    }
  }
}
</style>
