<template>
  <div class="app-common-content" >
    <a-breadcrumb separator=">" class="app-common-header">
      <a-breadcrumb-item>devops</a-breadcrumb-item>
      <a-breadcrumb-item>toolbox</a-breadcrumb-item>
      <a-breadcrumb-item>日程任务管理</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="toolbox-search">
      <a-form :model="formState" layout="inline">
        <a-button @click="addTAsk">新增</a-button>
        <a-button @click="refresh">搜索</a-button>
        <a-form-item label="脚本名">
          <a-input v-model:value="formState.fileName" placeholder="文件名" size="small"></a-input>
        </a-form-item>
        <a-form-item label="名字">
          <a-input v-model:value="formState.name" placeholder="文件名" size="small"></a-input>
        </a-form-item>
        <a-form-item label="状态">
          <a-select
              v-model:value="formState.state"
              show-search
              placeholder="Select a state"
              size="small"
              style="width: 200px; margin-left: 10px;"
          >
            <a-select-option value="1"> 启用 </a-select-option>
            <a-select-option value="2"> 禁用 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="修改时间">
          <a-space direction="vertical">
            <a-date-picker show-time v-model:value="formState.updated_at" placeholder="开始时间" size="small" />
          </a-space>
        </a-form-item>
      </a-form>
    </div>

    <div style="min-height: 100%;">
      <a-table
          :columns="columns"
          :data-source="commandsData"
          :loading="isResultLoading"
          :pagination="pagination"
          :scroll="{ x: 1300}"
          :rowKey="(record, index) => index">
        <template #name="{ text }">
          <span> {{ text }}</span>
        </template>
        <template #tags="{ text: tags }">
          <span>
            <a-tag v-for="tag in tags" :key="tag">{{ tag }}</a-tag>
          </span>
        </template>
        <template #time="{ text }">
          <span>{{ formatDate(text, 'YYYY-MM-DD HH:mm:ss') }}</span>
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
import {reactive, ref} from "vue";
import {CommandItem} from "@/views/History.vue";
import moment from "moment";

export default {
  name: "TaskManagement",
  setup() {
    const formState = reactive({
      fileName: '',
      name: '',
      state: '',
      updated_at: null,
    })
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 20,
      showSizeChanger: true,
    })
    const columns = [
      {title: 'ID', key: 'id', dataIndex: 'id', fixed: 'left', width: 80},
      {title: '名字', key: 'name', dataIndex: 'name', fixed: 'left', width: 120},

      {title: '脚本名', key: 'fileName', dataIndex: 'fileName'},
      {title: 'crontab', key: 'schedule_time', dataIndex: 'schedule_time'},
      {title: '执行时间', key: 'exec_time', dataIndex: 'exec_time', slots: { customRender: 'time'}},
      {title: '执行服务用户', key: 'user_id', dataIndex: 'user_id'},

      {title: '选中服务器', key: 'serverUser', dataIndex: 'serverUser'},
      {title: '参数', key: 'tags', dataIndex: 'tags', slots: { customRender: 'tags' },},
      {title: '创建时间', key: 'created_at', dataIndex: 'created_at', slots: { customRender: 'time'}},
      {title: '修改时间', key: 'updated_at', dataIndex: 'updated_at', slots: { customRender: 'time'}},
      {title: '备注', key: 'comment', dataIndex: 'comment'},
      {title: '状态', key: 'state', dataIndex: 'state'},
      {
        title: '操作', key: 'action', slots: { customRender: 'action' }, fixed: 'right', width: 120
      },
    ];
    const isResultLoading = ref(false);
    const commandsData = ref<CommandItem[]>([]);

    const addTAsk = async () => {

    }
    const refresh = async () => {

    }

    return {
      isResultLoading,
      commandsData,
      columns,
      formState,
      pagination,
      addTAsk,
      refresh,
    }
  }
}
</script>

<style scoped lang="less">
@import '../components/index.less';
</style>
