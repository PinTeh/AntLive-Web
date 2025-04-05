<template>
  <div class="recharge-wapper">
    <a-page-header title="充值" sub-title="Bill">
      <template #extra>
        <QuestionCircleOutlined />
        <!-- <span>常见问题</span> -->
      </template>
      <a-flex wrap="wrap" :gap="20">
        <div
          :class="item.id === currentSelect ? 'item item-active' : 'item'"
          v-for="item in chargeList"
          :key="item.id"
          @click="handleItemClick(item)">
          <div>
            <span num>{{ item.value }}</span>
            <span unit>开心果</span>
          </div>
          <span rmb>{{ "¥" + item.fee }}</span>
        </div>
      </a-flex>
    </a-page-header>
    <a-flex vertical justify="center" align="center" style="padding: 20px">
      <a-button type="primary">前往收银台</a-button>
      <div class="agreement">
        <a-checkbox name="type">我已阅读并同意<a>《AntLive开心果用户协议》</a></a-checkbox>
      </div>
    </a-flex>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { QuestionCircleOutlined } from "@ant-design/icons-vue"
const currentSelect = ref(1)
const chargeList = ref([
  {
    id: 1,
    value: 6,
    fee: "6.00",
  },
  {
    id: 2,
    value: 10,
    fee: "10.00",
  },
  {
    id: 3,
    value: 50,
    fee: "50.00",
  },
  {
    id: 4,
    value: 100,
    fee: "100.00",
  },
  {
    id: 5,
    value: 128,
    fee: "128.00",
  },
  {
    id: 6,
    value: 256,
    fee: "256.00",
  },
  {
    id: 7,
    value: 328,
    fee: "328.00",
  },
  {
    id: 8,
    value: 648,
    fee: "648.00",
  },
])

const handleItemClick = (item) => {
  currentSelect.value = item.id
}
</script>

<style lang="scss" scoped>
.recharge-wapper {
  background-color: #fff;
  .item {
    width: 240px;
    height: 100px;
    border: 1px solid #ccc;
    cursor: pointer;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    span[num] {
      font-size: 24px;
      font-weight: bold;
      color: $font-color;
    }
    span[unit] {
      margin-left: 5px;
      color: $font-color-light;
    }
    span[rmb] {
      display: block;
      color: $font-color-light;
    }
  }
  .item:hover {
    background-color: #fbfbfb;
  }
  .item-active {
    border: 1px solid $primary-color;
    span {
      color: $primary-color !important;
    }
  }
  .agreement {
    margin: 25px 0px 15px 0px;
    color: $font-color-light;
  }
}
</style>
