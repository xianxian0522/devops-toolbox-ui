<template>
  <div class="command-content">
    <div>
      <h2> 脚本：{{ state.command }}</h2>
    </div>
    <Description :outData="state.out" ></Description>
    <div class="command-content-server">
      <a-descriptions :title="index === 0 ? '服务器的信息' : ''" bordered v-for="(out, index) in state.serverInfo">
        <a-descriptions-item label="Id">{{ out.Id }}</a-descriptions-item>
        <a-descriptions-item label="Name" :span="2">{{ out.Name }}</a-descriptions-item>
        <a-descriptions-item label="Ip">{{ out.Ip }}</a-descriptions-item>
      </a-descriptions>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import systemInfo from "../api/systemInfo";
import Description from '../components/Description.vue';
import {reactive, ref} from "vue";

interface Info {
  Id: number;
  Name: string;
  Ip: string;
}

const route = useRoute()
const state = ref({out: [], command: '', serverInfo: [] as Info[]})

const commandDetail = async (id: number) => {
  state.value = await systemInfo.queryPageAll(`getDetail?queryId=${id}`)
}
if (route.query && route.query.commandId) {
  commandDetail(parseInt(route.query.commandId as string, 10))
}

</script>

<style scoped lang="less">
.command-content {
  padding-top: 20px;
  white-space: pre-wrap;
  .ant-descriptions {
    margin-bottom: 10px;
  }
  .command-content-server {
    margin-top: 20px;
  }
  h2 {
    font-weight: bold;
    font-size: 16px;
    white-space: pre-wrap;
  }
}
</style>
