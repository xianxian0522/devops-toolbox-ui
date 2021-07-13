<template>
  <div class="app-common-content" >
    <CommonBreadcrumb >
      <template v-slot:first>devops</template>
      <template v-slot:second>toolbox</template>
      <template v-slot:three>日程任务管理</template>
    </CommonBreadcrumb>
    <div class="toolbox-search">
      <a-form :model="formState" layout="inline">
        <a-button>
          <router-link :to="{path: 'task-management/edit'}">新增</router-link>
        </a-button>
        <a-button @click="refresh">搜索</a-button>
<!--        <a-form-item label="脚本名">-->
<!--          <a-input v-model:value="formState.fileName" placeholder="文件名" size="small"></a-input>-->
<!--        </a-form-item>-->
        <a-form-item label="名字">
          <a-input v-model:value="formState.name" placeholder="文件名" size="small"></a-input>
        </a-form-item>
        <a-form-item label="状态">
          <a-select
              v-model:value="formState.state"
              show-search
              :allowClear="true"
              placeholder="Select a state"
              size="small"
              style="width: 200px; margin-left: 10px;"
          >
            <a-select-option value="1"> 启用 </a-select-option>
            <a-select-option value="2"> 禁用 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="开始时间">
          <a-date-picker show-time v-model:value="formState.startTime" placeholder="开始时间" size="small" />
        </a-form-item>
        <a-form-item label="结束时间">
          <a-date-picker show-time v-model:value="formState.endTime" placeholder="结束时间" size="small" />
        </a-form-item>
      </a-form>
    </div>

    <div style="min-height: 100%;">
      <a-table
          :columns="columns"
          :data-source="taskDataList"
          :loading="isResultLoading"
          :pagination="pagination"
          :scroll="{ x: 2500}"
          @change="paginationChange"
          :rowKey="(record, index) => index">
        <template #name="{ text }">
          <span> {{ text }}</span>
        </template>
        <template #tags="{ text: tags }">
          <span>
            <a-tag v-for="tag in tags" :key="tag">{{ tag }}</a-tag>
          </span>
        </template>
        <template #state="{ text: state }">
          <span>{{ state === 1 ? '启用' : '禁用' }}</span>
        </template>
        <template #time="{ text }">
          <span>{{ timeFormat(text) }}</span>
        </template>
        <template #action="{ record }">
          <span>
            <a-button type="link" >
              <router-link :to="{path: 'task-management/edit', query: {taskId: record.id}}">修改</router-link>
            </a-button>
          </span>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import moment from "moment";
import CommonBreadcrumb from "@/components/CommonBreadcrumb.vue";
import systemInfo from "../api/systemInfo";
import {TableState} from "ant-design-vue/es/table/interface";
import {TaskResponse} from "@/utils/response";
import * as _ from "lodash";

export default {
  name: "TaskManagement",
  components: {
    CommonBreadcrumb,
  },
  setup() {
    const formState = reactive({
      // fileName: '',
      name: '',
      state: '',
      endTime: null,
      startTime: null,
    })
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 1,
      showSizeChanger: true,
    })
    const columns = [
      {title: 'ID', key: 'id', dataIndex: 'id', fixed: 'left', width: 80},
      {title: '名字', key: 'name', dataIndex: 'name', fixed: 'left', width: 120},
      {title: '脚本名', key: 'scriptName', dataIndex: 'scriptName'},
      {title: 'crontab', key: 'scheduleTime', dataIndex: 'scheduleTime'},
      {title: '执行时间', key: 'execTime', dataIndex: 'execTime', slots: { customRender: 'time'}, width: 190},
      {title: '执行服务用户', key: 'user', dataIndex: 'user'},
      {title: '选中服务器', key: 'serverInfo', dataIndex: 'serverInfo'},
      {title: '执行路径', key: 'cwd', dataIndex: 'cwd'},
      {title: '参数', key: 'tags', dataIndex: 'tags', slots: { customRender: 'tags' },},
      {title: '创建时间', key: 'created_at', dataIndex: 'created_at', slots: { customRender: 'time'}, width: 190},
      {title: '修改时间', key: 'updated_at', dataIndex: 'updated_at', slots: { customRender: 'time'}, width: 190},
      {title: '备注', key: 'comment', dataIndex: 'comment'},
      {title: '状态', key: 'state', dataIndex: 'state', slots: { customRender: 'state'}, width: 80},
      {
        title: '操作', key: 'action', slots: { customRender: 'action' }, fixed: 'right', width: 120
      },
    ];
    const isResultLoading = ref(false);
    const taskDataList = ref<TaskResponse[]>([]);

    const refresh = async () => {
      isResultLoading.value = true
      const value: any = {...formState}
      value.page = pagination.current
      value.size = pagination.pageSize
      if (value.startTime) {
        value.startTime = moment(value.startTime).valueOf()
      }
      if (value.endTime) {
        value.endTime = moment(value.endTime).valueOf()
      }
      try {
        const data = await systemInfo.queryPageTasks(value)
        taskDataList.value = data.task
        pagination.total = data.total
        isResultLoading.value = false
      } catch (e) {
        isResultLoading.value = false
        console.error(e)
      }
    }
    const timeFormat = (value: string) => {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }

    const paginationChange = (value: TableState['pagination']) => {
      pagination.pageSize = value?.pageSize as number
      pagination.current = value?.current as number
      refresh()
    }
    onMounted(() => {
      refresh()
    })
    watch(formState, _.debounce(refresh, 300))

    return {
      isResultLoading,
      taskDataList,
      columns,
      formState,
      pagination,
      refresh,
      paginationChange,
      timeFormat,
    }
  }
}
</script>

<style scoped lang="less">
@import '../components/index.less';
</style>
