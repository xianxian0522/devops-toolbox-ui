<template>
<div>
  <a-descriptions :title="index === 0 ? '执行命令的输出' : ''" bordered v-for="(out, index) in props.outData">
    <a-descriptions-item label="id">{{ out.id }}</a-descriptions-item>
    <a-descriptions-item label="Ip" :span="2">{{ out.ip }}</a-descriptions-item>
    <a-descriptions-item label="pid">{{ out.pid }}</a-descriptions-item>
    <a-descriptions-item style="text-align: left" label="stderr" :span="2">{{ out.stderr }}</a-descriptions-item>
    <a-descriptions-item label="retcode">{{ out.retcode }}</a-descriptions-item>
    <a-descriptions-item style="text-align: left" label="stdout">{{ out.stdout }}</a-descriptions-item>
  </a-descriptions>
</div>
</template>

<script setup lang="ts" name="Description">
import {defineProps, inject} from "vue";

const props = defineProps({
  outData: {type: Array}
})
// const outData = inject('outData')

</script>

<style scoped>

</style>
