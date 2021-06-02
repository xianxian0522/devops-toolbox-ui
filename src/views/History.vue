<template>
  <div class="app-common-content" @scroll="mousewheel">
    <a-breadcrumb separator=">" class="app-common-header">
      <a-breadcrumb-item>devops</a-breadcrumb-item>
      <a-breadcrumb-item>toolbox</a-breadcrumb-item>
      <a-breadcrumb-item>历史记录</a-breadcrumb-item>
    </a-breadcrumb>
    <RecordCommon :formState="formState">
      <template v-slot:button>
        <a-button @click="refresh">搜索</a-button>
      </template>
    </RecordCommon>
<!--    <div class="toolbox-search">-->
<!--      <a-form :model="formState" layout="inline">-->
<!--        <a-button @click="refresh">搜索</a-button>-->
<!--        <a-form-item label="是否完成">-->
<!--          <a-checkbox v-model:checked="formState.done"></a-checkbox>-->
<!--        </a-form-item>-->
<!--        <a-form-item label="文件名">-->
<!--          <a-input v-model:value="formState.fileName" placeholder="文件名" size="small"></a-input>-->
<!--        </a-form-item>-->
<!--        <a-form-item label="开始时间">-->
<!--          <a-space direction="vertical">-->
<!--            <a-date-picker show-time v-model:value="formState.starttime" placeholder="开始时间" size="small" />-->
<!--          </a-space>-->
<!--        </a-form-item>-->
<!--        <a-form-item label="结束时间">-->
<!--          <a-space direction="vertical">-->
<!--            <a-date-picker show-time v-model:value="formState.endtime" placeholder="结束时间" size="small" />-->
<!--          </a-space>-->
<!--        </a-form-item>-->
<!--      </a-form>-->
<!--    </div>-->
    <div style="min-height: 100%;">
      <a-table
          :columns="columns"
          :data-source="commandsData"
          :loading="isResultLoading"
          :pagination="false"
          :scroll="{ x: 1300}"
          :rowKey="(record, index) => index">
        <template #name="{ text }">
          <a> {{ text }}</a>
        </template>
        <template #done="{ text: done }">
          <span> {{ done ? '是' : '否' }}</span>
        </template>
        <template #startTime="{ text: startTime }">
          <span> {{ formatDateTime(startTime) }}</span>
        </template>
        <template #action="{ record }">
          <span>
            <router-link :to="{path: 'history/command', query: {commandId: record.id}}">详情</router-link>
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
import {debounce} from '../utils/debounce';
import {message} from "ant-design-vue";
import moment from "moment";
import RecordCommon from "../components/RecordCommon.vue";

export interface CommandItem {
  command: string;
  comment: string;
  description: string;
  done: boolean
  fileName: string;
  id: number;
  startTime: string;
  updateTime: string;
}

export default {
  name: "History",
  components: {
    RecordCommon,
  },
  setup() {
    const formState: UnwrapRef<any> = reactive({
      done: true,
      fileName: '',
      starttime: null,
      endtime: null,
      serverUser: '',
    });
    const state = reactive({
      page: 1,
      size: 10,
    })
    const total = ref(1);
    const columns = [
      {title: '文件名', key: 'fileName', dataIndex: 'fileName', fixed: 'left', width: 120},
      {title: '描述', key: 'description', dataIndex: 'description'},
      {title: '执行时间', key: 'startTime', dataIndex: 'startTime', slots: { customRender: 'startTime' },},
      {title: '执行脚本概略', key: 'command', dataIndex: 'command'},
      {title: '执行用户', key: 'executor', dataIndex: 'executor'},
      {title: '服务器用户', key: 'serverUser', dataIndex: 'serverUser'},
      {title: '执行路径', key: 'cwd', dataIndex: 'cwd'},
      {title: '执行完毕', key: 'done', dataIndex: 'done', slots: { customRender: 'done' },},
      {title: '备注', key: 'comment', dataIndex: 'comment'},
      {
        title: '操作', key: 'action', slots: { customRender: 'action' }, fixed: 'right', width: 120
      },
    ];
    const isResultLoading = ref(false);
    const commandsData = ref<CommandItem[]>([]);

    const refresh = async (e?: any) => {
      isResultLoading.value = true;
      if (e === formState) {
        commandsData.value = [];
        state.page = 1;
      }
      const value = {...formState, ...state};
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

    const formatDateTime = (value: string) => {
      return moment(value).format('yyyy-MM-DD HH:mm:ss')
    }

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
      refresh,
      formatDateTime,
    }
  },
}
</script>

<style scoped lang="less">
@import '../components/index.less';
</style>
