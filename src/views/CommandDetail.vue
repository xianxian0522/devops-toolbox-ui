<template>
  <div class="command-content">
    <div>
      <h2> 脚本：{{ state.command }}</h2>
    </div>
    <Description :outData="state.out"></Description>
    <div class="command-content-server">
      <a-descriptions :title="index === 0 ? '服务器的信息' : ''" bordered v-for="(out, index) in state.serverInfo">
        <a-descriptions-item label="Id">{{ out.Id }}</a-descriptions-item>
        <a-descriptions-item label="Name" :span="2">{{ out.Name }}</a-descriptions-item>
        <a-descriptions-item label="Ip">{{ out.Ip }}</a-descriptions-item>
      </a-descriptions>
    </div>
  </div>
</template>

<script setup>
import {useRoute} from "vue-router";
import systemInfo from "../api/systemInfo";
import Description from '../components/Description.vue';
import {reactive, ref} from "vue";

const route = useRoute()
const state = ref({out: [], command: '', serverInfo: []})

const commandDetail = async (id) => {
  const data = await systemInfo.queryPageAll(`getDetail?queryId=${id}`)
  console.log(data)
  state.value = data
}
if (route.query && route.query.commandId) {
  commandDetail(route.query.commandId)
}

</script>

<style scoped lang="less">
.command-content {
  padding-top: 20px;
  .ant-descriptions {
    margin-bottom: 10px;
  }
  .command-content-server {
    margin-top: 20px;
  }
  h2 {
    font-weight: bold;
    font-size: 16px;
  }
}
</style>
