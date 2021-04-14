<template>
  <div class="app-common-content">
    <a-breadcrumb separator=">" class="app-common-header">
      <a-breadcrumb-item>devops</a-breadcrumb-item>
      <a-breadcrumb-item>toolbox</a-breadcrumb-item>
      <a-breadcrumb-item>脚本管理</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="toolbox-search">
      <a-form :model="formState" layout="inline">
        <a-button @click="refresh">搜索</a-button>
        <a-button @click="showCreateScript">添加</a-button>
        <a-form-item label="文件名">
          <a-input v-model:value="formState.name" placeholder="文件名" size="small"></a-input>
        </a-form-item>
      </a-form>
    </div>
    <div>
      <a-table
          :columns="columns"
          :row-key="record => record.id"
          :data-source="dataList"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
      >
        <template #name="{ text }">{{ text }}</template>
        <template #detail="{ record }">
          <a-button type="link" @click="showEditScript(record.id, true)">详情</a-button>
        </template>
        <template #action="{ record }">
          <router-link :to="{path: '/toolbox/home', query: {scriptId: record.id}}">脚本</router-link>
          <a-button type="link" @click="showEditScript(record.id, false)">编辑</a-button>
        </template>
      </a-table>
    </div>

    <a-modal
        :title="mode === 'created' ? '新增脚本信息' : '修改脚本信息'"
        v-model:visible="visible"
        @ok="onSubmit"
        ok-text="确认"
        cancel-text="取消"
        :ok-button-props="{ disabled: !!isOnlyShowScript }"
        :destroyOnClose="true"
    >
      <a-form :model="scriptValue" :label-col="{ span: 4 }" :wrapper-col="{ span: 18}">
        <a-form-item label="文件名" v-if="!isOnlyShowScript">
          <a-input  v-model:value="scriptValue.fileName" placeholder="文件名" size="small"></a-input>
        </a-form-item>
        <a-form-item label="备 注" v-if="!isOnlyShowScript">
          <a-input v-model:value="scriptValue.comment" placeholder="备注" size="small"></a-input>
        </a-form-item>
        <a-form-item label="脚 本">
          <a-textarea :readonly="isOnlyShowScript" v-model:value="scriptValue.script" placeholder="脚本输入框" :auto-size="{ minRows: 4 }"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import systemInfo from "../api/systemInfo";
import {message, Modal} from "ant-design-vue";
import {debounce, throttle} from "../utils/debounce";


const columns = [
  {title: 'ID', key: 'id', dataIndex: 'id', fixed: 'left', width: 80},
  {title: '文件名', key: 'filename', dataIndex: 'filename',},
  {title: '备注', key: 'comment', dataIndex: 'comment'},
  {title: '详细', key: 'detail', dataIndex: 'detail', slots: { customRender: 'detail' },},
  {title: '操作', key: 'action', dataIndex: 'action', fixed: 'right', width: 120, slots: { customRender: 'action' },},
]
const formState = reactive({
  name: '',
})
const state = reactive({
  page: 1,
  size: 10,
})
const total = ref(1)
const loading = ref(false)
const dataList = ref([])
const pagination = computed(() => ({
  total: total.value,
  current: state.page,
  pageSize: state.size,
  showSizeChanger: true,
  showPageChanger: true,
  showTotal: total => `共 ${total} 条数据`,
  pageSizeOptions: ['10', '20', '30', '40', '50'],
}))

const visible = ref(false)
const scriptValue = reactive({
  id: null,
  comment: '',
  fileName: '',
  script: '',
})
const mode = ref('')
const isOnlyShowScript = ref(false)
const onSubmit = async () => {
  const url = mode.value === 'created' ? 'saveScript' : 'updateScript'
  const value = {...scriptValue}
  if (!value.fileName || !value.script || !value.comment) {
    return message.info('不能为空')
  }
  const data = await systemInfo.execCommandScript( url, value)
  if (data) {
    visible.value = false;
    await refresh()
    Modal.destroyAll();
  }
}

const refresh = async () => {
  const value = {...formState, ...state}
  const data = await systemInfo.queryPageAll('getManagerList', value)
  total.value = data.total;
  dataList.value = data.list;
}
const showCreateScript = () => {
  visible.value = true;
  mode.value = 'created';
  isOnlyShowScript.value = false;
  scriptValue.id = null
  scriptValue.fileName = ''
  scriptValue.comment = ''
  scriptValue.script = ''
}
const showEditScript = async (id, isShow) => {
  visible.value = true;
  mode.value = 'edit';
  isOnlyShowScript.value = isShow;
  const value = await systemInfo.queryPageAll(`getScriptDetail?id=${id}`)
  scriptValue.id = value.id
  scriptValue.fileName = value.filename
  scriptValue.comment = value.comment
  scriptValue.script = value.script
}
const handleTableChange = (pag, filters, sorter) => {
  state.size = pag.pageSize;
  state.page = pag.current;
  refresh()
};

const formStateHandle = throttle(refresh, 200)

onMounted(() => {
  refresh()
  watch(formState, formStateHandle)
})

</script>

<style scoped lang="less">
@import '../components/index.less';
</style>
