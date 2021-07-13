<template>
  <div class="app-common-content" @scroll="mousewheel">
    <CommonBreadcrumb >
      <template v-slot:first>devops</template>
      <template v-slot:second>toolbox</template>
      <template v-slot:three>历史记录</template>
    </CommonBreadcrumb>
    <RecordCommon @updateForm="updateForm">
<!--      <template v-slot:button>-->
<!--        <a-button @click="refresh">搜索</a-button>-->
<!--      </template>-->
    </RecordCommon>
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
import {UnwrapRef, reactive, onMounted, watch, ref, computed, watchEffect, toRefs} from 'vue';
import systemInfo from "../api/systemInfo";
import * as _ from 'lodash';
import {message} from "ant-design-vue";
import moment from "moment";
import RecordCommon from "../components/RecordCommon.vue";
import CommonBreadcrumb from "@/components/CommonBreadcrumb.vue";
import {Command, SearchForm} from "@/utils/response";

export default {
  name: "History",
  components: {
    RecordCommon,
    CommonBreadcrumb,
  },
  setup() {
    const formState = ref<SearchForm>()
    const statePagination = reactive({
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
    const commandsData = ref<Command[]>([]);

    const refresh = async (formChange: boolean) => {
      isResultLoading.value = true;
      const value = {...formState.value, ...statePagination};
      if (value.starttime) {
        value.starttime = moment(value.starttime).valueOf()
      }
      if (value.endtime) {
        value.endtime = moment(value.endtime).valueOf()
      }

      const data = await systemInfo.queryCommandHistory(value)
      isResultLoading.value = false;
      total.value = data.total;
      if (formChange) {
        commandsData.value = data.commands
      } else {
        commandsData.value = commandsData.value.concat(data.commands);
      }
    };
    const updateForm = (value: SearchForm) => {
      formState.value = value
      statePagination.page = 1
      refresh(true)
    }

    const scrollFn = () => {
      if (statePagination.page * statePagination.size >= total.value) {
        return message.info('没有更多数据了')
      }
      statePagination.page ++ ;
      refresh(false)
    }
    const mousewheel = _.debounce(scrollFn, 200)

    const formatDateTime = (value: string) => {
      return moment(value).format('yyyy-MM-DD HH:mm:ss')
    }

    return {
      columns,
      commandsData,
      isResultLoading,
      mousewheel,
      formatDateTime,
      updateForm,
    }
  },
}
</script>

<style scoped lang="less">
@import '../components/index.less';
</style>
