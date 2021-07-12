<template>
<div class="common-breadcrumb">
  <a-breadcrumb separator=">">
    <a-breadcrumb-item>
      <slot name="first"></slot>
    </a-breadcrumb-item>
    <a-breadcrumb-item>
      <slot name="second"></slot>
    </a-breadcrumb-item>
    <a-breadcrumb-item >
      <slot name="three"></slot>
    </a-breadcrumb-item>
  </a-breadcrumb>
</div>
</template>

<script lang="ts">
export default {
  name: "CommonBreadcrumb",
}
</script>

<style scoped lang="less">
.common-breadcrumb {
  height: 53px;
  .ant-breadcrumb {
    line-height: 53px;
  }
}
</style>
