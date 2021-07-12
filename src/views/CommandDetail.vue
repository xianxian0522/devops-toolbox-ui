<template>
  <div class="command-content">
    <div>
      <h2> 脚本：{{ command }}</h2>
    </div>
    <Description :outData="out" ></Description>
    <div class="command-content-server">
      <a-descriptions :title="index === 0 ? '服务器的信息' : ''" v-for="(out, index) in serverInfo" :key="out.Id" bordered >
        <a-descriptions-item label="Id">{{ out.Id }}</a-descriptions-item>
        <a-descriptions-item label="Name" :span="2">{{ out.Name }}</a-descriptions-item>
        <a-descriptions-item label="Ip">{{ out.Ip }}</a-descriptions-item>
      </a-descriptions>
    </div>
  </div>
</template>

<script lang="ts">
import {useRoute} from "vue-router";
import systemInfo from "../api/systemInfo";
import Description from '../components/Description.vue';
import {reactive, toRefs, UnwrapRef} from "vue";
import {CommandDetail} from "@/utils/response";

export default {
  name: 'CommandDetail',
  components: {Description},
  setup() {
    const route = useRoute()
    const state: UnwrapRef<CommandDetail> = reactive({
      out: [],
      command: '',
      serverInfo: [],
    })

    const commandDetail = async (id: number) => {
      const data = await systemInfo.queryCommandDetail(id)
      state.command = data.command
      state.out = data.out
      state.serverInfo = data.serverInfo
    }
    if (route.query && route.query.commandId) {
      commandDetail(parseInt(route.query.commandId as string, 10))
    }

    return {
      ...toRefs(state),
    }
  }
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
