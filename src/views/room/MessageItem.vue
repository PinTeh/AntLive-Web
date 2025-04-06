<template>
  <div class="message-wrapper">
    <!-- <a-tag :bordered="false" color="magenta">主播</a-tag> -->
    <span class="name"> {{ data.nickname || "观众" }}：</span>
    <span class="msg">{{ data.text || "" }}</span>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    default: {},
  },
})
</script>

<style lang="scss" scoped>
.message-wrapper {
  .name {
    font-size: 14px;
    color: $font-color-light;
  }
  .msg {
    font-size: 14px;
    color: $font-color;
  }
}
</style>
