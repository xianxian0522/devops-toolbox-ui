<template>
  <div class="app-common-content" >
<!--    <a-breadcrumb separator=">" class="app-common-header">-->
<!--      <a-breadcrumb-item>devops</a-breadcrumb-item>-->
<!--      <a-breadcrumb-item>toolbox</a-breadcrumb-item>-->
<!--      <a-breadcrumb-item>日程任务管理</a-breadcrumb-item>-->
<!--    </a-breadcrumb>-->
<!--    <div class="toolbox-search">-->
<!--      <a-form :model="formState" layout="inline">-->
<!--        <a-button @click="addTask">新增</a-button>-->
<!--        <a-button @click="refresh">搜索</a-button>-->
<!--&lt;!&ndash;        <a-form-item label="脚本名">&ndash;&gt;-->
<!--&lt;!&ndash;          <a-input v-model:value="formState.fileName" placeholder="文件名" size="small"></a-input>&ndash;&gt;-->
<!--&lt;!&ndash;        </a-form-item>&ndash;&gt;-->
<!--        <a-form-item label="名字">-->
<!--          <a-input v-model:value="formState.name" placeholder="文件名" size="small"></a-input>-->
<!--        </a-form-item>-->
<!--        <a-form-item label="状态">-->
<!--          <a-select-->
<!--              v-model:value="formState.state"-->
<!--              show-search-->
<!--              :allowClear="true"-->
<!--              placeholder="Select a state"-->
<!--              size="small"-->
<!--              style="width: 200px; margin-left: 10px;"-->
<!--          >-->
<!--            <a-select-option value="1"> 启用 </a-select-option>-->
<!--            <a-select-option value="2"> 禁用 </a-select-option>-->
<!--          </a-select>-->
<!--        </a-form-item>-->
<!--        <a-form-item label="开始时间">-->
<!--          <a-space direction="vertical">-->
<!--            <a-date-picker show-time v-model:value="formState.startTime" placeholder="开始时间" size="small" />-->
<!--          </a-space>-->
<!--        </a-form-item>-->
<!--        <a-form-item label="结束时间">-->
<!--          <a-space direction="vertical">-->
<!--            <a-date-picker show-time v-model:value="formState.endTime" placeholder="结束时间" size="small" />-->
<!--          </a-space>-->
<!--        </a-form-item>-->
<!--      </a-form>-->
<!--    </div>-->

<!--    <div style="min-height: 100%;">-->
<!--      <a-table-->
<!--          :columns="columns"-->
<!--          :data-source="taskDataList"-->
<!--          :loading="isResultLoading"-->
<!--          :pagination="pagination"-->
<!--          :scroll="{ x: 2500}"-->
<!--          @change="paginationChange"-->
<!--          :rowKey="(record, index) => index">-->
<!--        <template #name="{ text }">-->
<!--          <span> {{ text }}</span>-->
<!--        </template>-->
<!--        <template #tags="{ text: tags }">-->
<!--          <span>-->
<!--            <a-tag v-for="tag in tags" :key="tag">{{ tag }}</a-tag>-->
<!--          </span>-->
<!--        </template>-->
<!--        <template #state="{ text: state }">-->
<!--          <span>{{ state === 1 ? '启用' : '禁用' }}</span>-->
<!--        </template>-->
<!--        <template #time="{ text }">-->
<!--          <span>{{ timeFormat(text) }}</span>-->
<!--        </template>-->
<!--        <template #action="{ record }">-->
<!--          <span>-->
<!--            <a-button type="link" @click="updateTask(record)">修改</a-button>-->
<!--          </span>-->
<!--        </template>-->
<!--      </a-table>-->
<!--    </div>-->

<!--    <a-modal v-model:visible="showTask" :title="taskData?.id ? '修改任务管理' : '新增任务管理'" :footer="null" :width="750">-->
<!--      <TaskEdit v-if="showTask" :mode="mode" :data="taskData" @changeShowTask="changeShowTask" />-->
<!--    </a-modal>-->
  </div>
</template>

<script lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import moment from "moment";
// import TaskEdit from './TaskEdit.vue'
import {Modal} from "ant-design-vue";
import systemInfo from "../api/systemInfo";

export default {
  name: "TaskManagement",
  // components: { TaskEdit },
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
    const taskDataList = ref([]);
    const showTask = ref(false);
    const taskData = ref()
    const mode = ref()

    const refresh = async () => {
      // isResultLoading.value = true
      // const value = {...formState}
      // value.page = pagination.current
      // value.size = pagination.pageSize
      // if (value.startTime) {
      //   value.startTime = moment(value.startTime).valueOf()
      // }
      // if (value.endTime) {
      //   value.endTime = moment(value.endTime).valueOf()
      // }
      // try {
      //   const data = await systemInfo.queryPageTasks(value)
      //   taskDataList.value = data.task
      //   pagination.total = data.total
      //   isResultLoading.value = false
      //   console.log(';;;;', data)
      // } catch (e) {
      //   isResultLoading.value = false
      //   console.error(e)
      // }
    }
    const timeFormat = (value: string) => {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
    const addTask = () => {
      showTask.value = true
      taskData.value = {}
      mode.value = 'created'
    }
    const updateTask = (el: any) => {
      console.log(el, '[[[[')
      showTask.value = true
      taskData.value = el
      mode.value = 'edit'
    }
    const changeShowTask = (value: any) => {
      showTask.value = false
      if (value) {
        refresh()
      }
    }
    const paginationChange = (value: any) => {
      pagination.pageSize = value.pageSize
      pagination.current = value.current
      refresh()
    }
    onMounted(() => {
      // refresh()
    })

    return {
      // isResultLoading,
      // taskDataList,
      // columns,
      // formState,
      // pagination,
      // showTask,
      // taskData,
      // mode,
      // refresh,
      // addTask,
      // updateTask,
      // changeShowTask,
      // paginationChange,
      // timeFormat,
    }
  }
}
</script>

<style scoped lang="less">
@import '../components/index.less';
</style>
