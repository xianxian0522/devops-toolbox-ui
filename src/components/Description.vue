<template>
<div>
  <a-descriptions :title="index === 0 ? '执行命令的输出' : ''" bordered v-for="(out, index) in outData">
    <a-descriptions-item label="id">{{ out.id }}</a-descriptions-item>
    <a-descriptions-item label="Ip" :span="2">{{ out.ip }}</a-descriptions-item>
    <a-descriptions-item label="pid">{{ out.pid }}</a-descriptions-item>
    <a-descriptions-item label="stderr" :span="2">{{ out.stderr }}</a-descriptions-item>
    <a-descriptions-item label="retcode">{{ out.retcode }}</a-descriptions-item>
    <a-descriptions-item label="stdout">{{ out.stdout }}</a-descriptions-item>
  </a-descriptions>
</div>
</template>

<script setup>
import { inject } from "vue";

const outData = inject('outData')
console.log(outData);

</script>

<style scoped>

</style>
