<template>
  <div class="app-common-content" >
    <CommonBreadcrumb >
      <template v-slot:first>devops</template>
      <template v-slot:second>toolbox</template>
      <template v-slot:three>日程任务记录</template>
    </CommonBreadcrumb>
    <RecordCommon @updateForm="updateForm">
    </RecordCommon>

    <div style="min-height: 100%;">
      <a-table
          :columns="columns"
          :data-source="commandsData"
          :loading="isResultLoading"
          :pagination="pagination"
          @change="paginationChange"
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
            <router-link :to="{path: 'task-record/command', query: {commandId: record.id}}">详情</router-link>
          </span>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import {onMounted, reactive, ref, UnwrapRef, watch} from "vue";
import RecordCommon from "../components/RecordCommon.vue";
import CommonBreadcrumb from "@/components/CommonBreadcrumb.vue";
import moment from "moment";
import systemInfo from "../api/systemInfo";
import {TableState} from "ant-design-vue/es/table/interface";
import {Command, SearchForm} from "@/utils/response";

export default {
  name: "TaskRecord",
  components: {
    RecordCommon,
    CommonBreadcrumb,
  },
  setup() {
    const formState = ref<SearchForm>()
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
      {title: '执行路径', key: 'cwd', dataIndex: 'cwd'},
      {title: '执行完毕', key: 'done', dataIndex: 'done', slots: { customRender: 'done' },},
      {title: '备注', key: 'comment', dataIndex: 'comment'},
      {
        title: '操作', key: 'action', slots: { customRender: 'action' }, fixed: 'right', width: 120
      },
    ];
    const isResultLoading = ref(false);
    const commandsData = ref<Command[]>([]);

    const updateForm = (value: SearchForm) => {
      formState.value = value
      refresh()
    }

    const refresh = async () => {
      isResultLoading.value = true
      const value = {...formState.value, historyType: 2, page: pagination.current, size: pagination.pageSize};
      if (value.starttime) {
        value.starttime = moment(value.starttime).valueOf()
      }
      if (value.endtime) {
        value.endtime = moment(value.endtime).valueOf()
      }
      try {
        const data = await systemInfo.queryCommandHistory(value)
        commandsData.value = data.commands
        pagination.total = data.total
        isResultLoading.value = false
      } catch (e) {
        isResultLoading.value = false
        console.error(e)
      }
    }
    const formatDateTime = (value: string) => {
      return moment(value).format('yyyy-MM-DD HH:mm:ss')
    }

    const paginationChange = (value: TableState['pagination']) => {
      pagination.pageSize = value?.pageSize as number
      pagination.current = value?.current as number
      refresh()
    }

    return {
      isResultLoading,
      commandsData,
      columns,
      pagination,
      formatDateTime,
      paginationChange,
      updateForm,
    }
  }
}
</script>

<style scoped lang="less">
@import '../components/index.less';
</style>
