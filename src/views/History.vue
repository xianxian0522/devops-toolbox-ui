<template>
  <div class="app-common-content">
    <a-breadcrumb separator=">" class="app-common-header">
      <a-breadcrumb-item>devops</a-breadcrumb-item>
      <a-breadcrumb-item>devops</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="toolbox-search">
      <a-form :model="formState" layout="inline">
        <a-button @click="refresh">搜索</a-button>
        <a-form-item label="查询命令">
          <a-input v-model:value="formState.command" placeholder="查询命令" size="small" />
        </a-form-item>
        <a-form-item label="是否完成">
          <a-checkbox v-model:checked="formState.done"></a-checkbox>
        </a-form-item>
        <a-form-item label="文件名">
          <a-input v-model:value="formState.fileName" placeholder="文件名" size="small"></a-input>
        </a-form-item>
        <a-form-item label="开始时间">
          <a-space direction="vertical">
            <a-date-picker show-time v-model:value="formState.starttime" placeholder="开始时间" size="small" />
          </a-space>
        </a-form-item>
        <a-form-item label="结束时间">
          <a-space direction="vertical">
            <a-date-picker show-time v-model:value="formState.endtime" placeholder="结束时间" size="small" />
          </a-space>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
import {UnwrapRef, reactive, onMounted, watchEffect} from 'vue';
import systemInfo from "../api/systemInfo";

export default {
  name: "History",
  setup() {
    const formState: UnwrapRef = reactive({
      command: '',
      done: false,
      fileName: '',
      starttime: null,
      endtime: null,
      page: 1,
      size: 10,
    });
    const refresh = async (query) => {
      const data = await systemInfo.queryPageAll('getCommandHistories', query);
      console.log(data, 'ddd');
    };
    onMounted(() => {
      watchEffect(() => {
        refresh(formState);
      })
    })

    return {
      formState,
      refresh
    }
  }
}
</script>

<style scoped lang="less">
@import '../components/index.less';
.toolbox-search {
  text-align: left;
  button {
    margin-right: 20px;
  }
}
</style>
