<template>
  <div>
    <CommonBreadcrumb >
      <template v-slot:first>devops</template>
      <template v-slot:second>toolbox</template>
      <template v-slot:three>{{ taskId ? '编辑日程任务' : '新增日程任务' }}</template>
    </CommonBreadcrumb>
    <a-form :model="formState" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
      <a-form-item label="任务名">
        <a-input v-model:value="formState.name" placeholder="input name" />
      </a-form-item>
      <a-form-item label="状态">
        <a-select v-model:value="formState.state" style="width: 100%;" placeholder="Select a state">
          <a-select-option :value="1">启用</a-select-option>
          <a-select-option :value="2">禁用</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="脚本">
        <a-select
            v-model:value="formState.scriptId"
            show-search
            placeholder="Select a script"
            style="width: 100%">
          <a-select-option v-for="option in scriptList" :key="option.id" :value="option.id">{{ option.filename }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="执行时间">
        <a-date-picker
            v-model:value="formState.execTime"
            show-time
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
        />
      </a-form-item>
      <a-form-item label="服务器">
        <a-select
            v-model:value="formState.servers"
            mode="multiple"
            :filterOption="filterOption"
            placeholder="Select a servers"
            style="width: 100%">
          <a-select-option v-for="option in serversList" :key="option.Id" :value="option.Id" :title="option.Ip + ' - ' + option.Name">{{ option.Ip }} - {{ option.Name }}</a-select-option>
        </a-select>
  <!--      <CommonTree @treeChange="selectServers"/>-->
      </a-form-item>
      <a-form-item label="备注">
        <a-input v-model:value="formState.comment" placeholder="input comment" />
      </a-form-item>
    </a-form>
    <a-row>
      <a-col :span="18" :offset="4">
        <a-collapse :bordered="false">
          <template #expandIcon="{ isActive }">
            <caret-right-outlined :rotate="isActive ? 90 : 0" />
          </template>
          <a-collapse-panel key="1" header="高级设置" :style="customStyle">
            <a-form :model="formState" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-form-item label="执行用户">
                <a-select
                  v-model:value="formState.user"
                  show-search
                  placeholder="Select a user"
                  style="width: 100%">
                  <a-select-option v-for="option in usersList" :key="option" :value="option">{{ option }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="参数">
                <a-select
                  v-model:value="formState.tags"
                  mode="tags"
                  style="width: 100%"
                  placeholder="脚本所需要的参数">
                </a-select>
              </a-form-item>
              <a-form-item label="crontab">
                <a-input v-model:value="formState.scheduleTime" placeholder="input crontab" />
              </a-form-item>
              <a-form-item label="执行路径">
                <a-input v-model:value="formState.cwd" placeholder="input cwd"></a-input>
              </a-form-item>
            </a-form>
          </a-collapse-panel>
        </a-collapse>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="18" :offset="4">
        <a-button @click="onSubmit" >确定</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import {onMounted, reactive, ref, toRefs, UnwrapRef} from "vue";
import systemInfo from "../api/systemInfo";
// import CommonTree from '../components/CommonTree.vue'
import moment, {Moment} from "moment";
import {useRoute, useRouter} from "vue-router";
import {ScriptResponse, ServerInfo} from "@/utils/response";
import CommonBreadcrumb from "@/components/CommonBreadcrumb.vue";
import { CaretRightOutlined } from '@ant-design/icons-vue'
import {message} from "ant-design-vue";

export interface TaskForms {
  id: number | undefined;
  name: string;
  state: number | undefined;
  scriptId: number | undefined;
  user: string;
  execTime: Moment | number | null;
  scheduleTime: string;
  servers: number[];
  comment: string;
  tags: string[];
  cwd: string;
}
export interface StateInfo {
  usersList: string[];
  serversList: ServerInfo[];
  scriptList: ScriptResponse[];
}

export default {
  name: "TaskEdit",
  components: {
    // CommonTree,
    CommonBreadcrumb,
    CaretRightOutlined,
  },
  emits: ['changeShowTask'],
  setup() {
    const customStyle =
      'background: #f7f7f7;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden';
    const route = useRoute()
    const router = useRouter()
    const taskId = ref()
    const formState: UnwrapRef<TaskForms> = reactive({
      id: undefined,
      name: '',
      state: undefined,
      scriptId: undefined,
      user: '',
      execTime: null,
      scheduleTime: '',
      servers: [],
      comment: '',
      tags: [],
      cwd: '',
    })
    const state: UnwrapRef<StateInfo> = reactive({
      usersList: [],
      serversList: [],
      scriptList: [],
    })

    const getTaskDetail = async () => {
      try {
        if (taskId.value) {
          const data = await systemInfo.queryTaskById(taskId.value)
          formState.id = data.id
          formState.name = data.name
          formState.state = data.state
          formState.scriptId = data.scriptId
          formState.user = data.user
          formState.execTime = moment(data.execTime)
          formState.scheduleTime = data.scheduleTime
          formState.servers = data.servers
          formState.comment = data.comment
          formState.tags = data.tags
          formState.cwd = data.cwd
        }
      } catch (e) {
        console.error(e)
      }
    }
    const onSubmit = async () => {
      const value = {...formState}
      if (value.execTime) {
        value.execTime = moment(value.execTime).valueOf()
      }
      if (value.execTime && value.scheduleTime) {
        return message.warning('执行时间和crontab只能填一个')
      }
      try {
        taskId.value ? await systemInfo.updateTask(value) : await systemInfo.addTask(value)
        message.success(taskId.value ? '修改成功' : '新增成功')
        router.push('/toolbox/task-management').then()
      } catch (e) {
        console.error(e)
      }
    }

    const getUser = async () => {
      const data = await systemInfo.queryServersUser()
      state.usersList = data.content
    }
    const getScript = async () => {
      const data = await systemInfo.queryScriptList()
      state.scriptList = data.list
    }
    const getServers = async () => {
      state.serversList = await systemInfo.queryServers()
    }
    // const selectServers = (value: number[]) => {
    //   formState.servers = value
    // }

    const filterOption = (input: string, option: any) => {
      return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }

    onMounted(() => {
      if (route.query?.taskId) {
        taskId.value = parseInt(route.query.taskId as string, 10)
        getTaskDetail()
      }
      getScript()
      getUser()
      getServers()
    })

    return {
      customStyle,
      taskId,
      formState,
      ...toRefs(state),
      onSubmit,
      // selectServers,
      filterOption,
    }
  }
}
</script>

<style lang="less">
@import "../components/index.less";
.ant-select-dropdown {
  word-break: break-all;
}
.ant-select-tree li .ant-select-tree-node-content-wrapper {
  white-space: pre-wrap;
}
</style>
