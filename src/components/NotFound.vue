<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="error-img"></div>
      <h2>页面找不到了！</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  props: {
    msg: String
  },
  data() {
    return {
      count: 0
    }
  }
}
</script>

<style lang="less">
 @import './index.less';
</style>
