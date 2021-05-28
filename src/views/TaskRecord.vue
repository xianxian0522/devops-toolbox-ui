<template>
  <div class="app-common-content" >
    <a-breadcrumb separator=">" class="app-common-header">
      <a-breadcrumb-item>devops</a-breadcrumb-item>
      <a-breadcrumb-item>toolbox</a-breadcrumb-item>
      <a-breadcrumb-item>日程任务记录</a-breadcrumb-item>
    </a-breadcrumb>
    <RecordCommon :formState="formState">
      <template v-slot:button>
        <a-button @click="refresh">搜索</a-button>
      </template>
    </RecordCommon>

    <div style="min-height: 100%;">
      <a-table
          :columns="columns"
          :data-source="commandsData"
          :loading="isResultLoading"
          :pagination="pagination"
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
import {onMounted, reactive, ref, UnwrapRef, watch} from "vue";
import RecordCommon from "../components/RecordCommon.vue";
import {CommandItem} from "./History.vue";
import moment from "moment";
import systemInfo from "../api/systemInfo";

export default {
  name: "TaskRecord",
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
      historyType: 2,
    })
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 20,
      showSizeChanger: true,
    })

    const columns = [
      {title: '文件名', key: 'fileName', dataIndex: 'fileName', fixed: 'left', width: 120},
      {title: '描述', key: 'description', dataIndex: 'description'},
      {title: '执行时间', key: 'startTime', dataIndex: 'startTime', slots: { customRender: 'startTime' },},
      {title: '执行脚本概略', key: 'command', dataIndex: 'command'},
      {title: '执行用户', key: 'executor', dataIndex: 'executor'},
      {title: '服务器用户', key: 'serverUser', dataIndex: 'serverUser'},
      {title: '执行完毕', key: 'done', dataIndex: 'done', slots: { customRender: 'done' },},
      {title: '备注', key: 'comment', dataIndex: 'comment'},
      {
        title: '操作', key: 'action', slots: { customRender: 'action' }, fixed: 'right', width: 120
      },
    ];
    const isResultLoading = ref(false);
    const commandsData = ref<CommandItem[]>([]);

    const refresh = async () => {
      isResultLoading.value = true
      const value = {...formState, page: pagination.current, size: pagination.pageSize};
      if (value.starttime) {
        value.starttime = new Date(value.starttime).getTime();
      }
      if (value.endtime) {
        value.endtime = new Date(value.endtime).getTime();
      }
      const data = await systemInfo.queryPageAll('getCommandHistories', value);
      isResultLoading.value = false;
      commandsData.value = data.commands
      // pagination.total = data.total
    }
    const formatDateTime = (value: string) => {
      return moment(value).format('yyyy-MM-DD HH:mm:ss')
    }

    watch(() => [pagination.pageSize, pagination.current], () => {
      console.log(';;;;')
      refresh()
    })

    onMounted(() => {
      refresh()
    })

    return {
      formState,
      isResultLoading,
      commandsData,
      columns,
      pagination,
      refresh,
      formatDateTime,
    }
  }
}
</script>

<style scoped lang="less">
@import '../components/index.less';
</style>
