<template>
  <div class="app-common-content" @scroll="mousewheel">
    <a-breadcrumb separator=">" class="app-common-header">
      <a-breadcrumb-item>devops</a-breadcrumb-item>
      <a-breadcrumb-item>toolbox</a-breadcrumb-item>
      <a-breadcrumb-item>历史记录</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="toolbox-search">
      <a-form :model="formState" layout="inline">
        <a-button @click="refresh">搜索</a-button>
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
    <div >
      <a-table
          :columns="columns"
          :data-source="commandsData"
          :loading="isResultLoading"
          :pagination="false"
          :scroll="{ x: 1300}"
          :rowKey="(record, index) => index">
        <template #name="{ text }">
          <a>{{ text }}</a>
        </template>
        <template #action="{ record }">
          <span>
            <router-link :to="{path: 'command', query: {commandId: record.id}}">详情</router-link>
          </span>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import {UnwrapRef, reactive, onMounted, watch, ref, computed, watchEffect} from 'vue';
import systemInfo from "../api/systemInfo";
import _ from 'lodash';
import {debounce} from "../utils/debounce";
import {message} from "ant-design-vue";

export default {
  name: "History",
  setup() {
    const formState: UnwrapRef<any> = reactive({
      done: false,
      fileName: '',
      starttime: null,
      endtime: null,
    });
    const state = reactive({
      page: 1,
      size: 10,
    })
    const total = ref(1);
    const columns = [
      {title: '文件名', key: 'fileName', dataIndex: 'fileName', fixed: 'left', width: 120},
      {title: '描述', key: 'description', dataIndex: 'description'},
      {title: '执行时间', key: 'starttime', dataIndex: 'starttime'},
      {title: '执行脚本概略', key: 'command', dataIndex: 'command'},
      {title: '执行完毕', key: 'done', dataIndex: 'done'},
      {title: '备注', key: 'comment', dataIndex: 'comment'},
      {
        title: '操作', key: 'action', slots: { customRender: 'action' }, fixed: 'right', width: 120
      },
    ];
    const isResultLoading = ref(false);
    const commandsData = ref<[]>([]);

    const refresh = async (e) => {
      if (e === formState) {
        commandsData.value = [];
        state.page = 1;
      }
      const value = {...formState, ...state};
      isResultLoading.value = true;
      if (value.starttime) {
        value.starttime = new Date(value.starttime).getTime();
      }
      if (value.endtime) {
        value.endtime = new Date(value.endtime).getTime();
      }
      const data = await systemInfo.queryPageAll('getCommandHistories', value);
      isResultLoading.value = false;
      if (data && data.commands) {
        commandsData.value = commandsData.value.concat(data.commands);
        // state.page = parseInt(data.page, 10);
        // state.size = parseInt(data.size, 10);
        total.value = data.total;
      }
    };
    const formStateHandle = _.throttle(refresh, 1000);
    const stateHandle = _.throttle(refresh, 1000);

    const scrollFn = async () => {
      if (state.page * state.size >= total.value) {
        return message.info('没有更多数据了')
      }
      state.page ++ ;
    }
    const mousewheel = debounce(scrollFn, 200)

    onMounted(() => {
      refresh();
      watch(formState, formStateHandle);
      watch(state, stateHandle)
    })

    return {
      formState,
      columns,
      commandsData,
      isResultLoading,
      mousewheel,
      refresh
    }
  },
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
