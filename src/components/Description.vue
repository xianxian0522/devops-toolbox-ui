<template>
<div>
  <a-descriptions :column="4" layout="vertical" v-for="(out, index) in outData" :key="out.id" :title="index === 0 ? '执行命令的输出' : ''" bordered>
    <a-descriptions-item label="id">{{ out.id }}</a-descriptions-item>
    <a-descriptions-item label="Ip" >{{ out.ip }}</a-descriptions-item>
    <a-descriptions-item label="pid">{{ out.pid }}</a-descriptions-item>
    <a-descriptions-item label="retcode">{{ out.retcode }}</a-descriptions-item>
    <a-descriptions-item :span="4" label="stderr">{{ out.stderr }}</a-descriptions-item>
    <a-descriptions-item label="stdout">{{ out.stdout }}</a-descriptions-item>
  </a-descriptions>
</div>
</template>

<script lang="ts">

export default {
  name: 'Description',
  props: {
    outData: Array,
  },
  setup() {
    return {

    }
  }
}

</script>

<style scoped lang="less">
.ant-descriptions {
  margin-bottom: 10px;
  white-space: pre-wrap;
  //word-break: break-all;
  text-align: left;
}
</style>
