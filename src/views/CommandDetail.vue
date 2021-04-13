<template>
  <div >
    <Description :outData="state.out"></Description>
  </div>
</template>

<script setup>
import {useRoute} from "vue-router";
import systemInfo from "../api/systemInfo";
import Description from '../components/Description.vue';
import {reactive, ref} from "vue";

const use = useRoute()
const state = ref({out: [], command: '', serverInfo: []})

const commandDetail = async (id) => {
  const data = await systemInfo.queryPageAll(`getDetail?queryId=${id}`)
  console.log(data)
  state.value = data
}
if (use.query && use.query.commandId) {
  commandDetail(use.query.commandId)
}

</script>

<style scoped>

</style>
