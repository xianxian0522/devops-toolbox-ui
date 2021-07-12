<template>
  <div class="app-common-content">
    <CommonBreadcrumb >
      <template v-slot:first>devops</template>
      <template v-slot:second>toolbox</template>
      <template v-slot:three>脚本管理</template>
    </CommonBreadcrumb>
    <div class="toolbox-search">
      <a-form :model="formState" layout="inline">
        <a-button @click="refresh">搜索</a-button>
        <a-button><router-link :to="{path: 'script/edit', query: {isEdit: true}}">添加</router-link></a-button>
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
          <a-button type="link" >
            <router-link :to="{path: 'script/edit', query: {scriptId: record.id}}">详情</router-link>
          </a-button>
        </template>
        <template #action="{ record }">
          <a-button type="link">
            <router-link :to="{path: '/toolbox/home', query: {scriptId: record.id}}">脚本</router-link>
          </a-button>
          <a-button type="link">
            <router-link :to="{path: 'script/edit', query: {isEdit: true, scriptId: record.id}}">编辑</router-link>
          </a-button>
        </template>
      </a-table>
    </div>

  </div>
</template>

<script lang="ts">
import {computed, onMounted, reactive, ref, watch} from "vue";
import systemInfo from "@/api/systemInfo";
import * as _ from "lodash";
import {TableState} from "ant-design-vue/es/table/interface";
import {ScriptResponse} from "@/utils/response";
import CommonBreadcrumb from "@/components/CommonBreadcrumb.vue";

export default {
  name: "ScriptManagement",
  components: {CommonBreadcrumb},
  setup() {
    const columns = [
      {title: 'ID', key: 'id', dataIndex: 'id', fixed: 'left', width: 80},
      {title: '文件名', key: 'filename', dataIndex: 'filename',},
      {title: '备注', key: 'comment', dataIndex: 'comment'},
      {title: '详细', key: 'detail', dataIndex: 'detail', slots: { customRender: 'detail' },},
      {title: '操作', key: 'action', dataIndex: 'action', align: 'center', fixed: 'right', width: 160, slots: { customRender: 'action' },},
    ]
    const formState = reactive({
      name: '',
    })
    const loading = ref(false)
    const dataList = ref<ScriptResponse[]>([])
    const pagination = reactive({
      total: 1,
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      showPageChanger: true,
      showTotal: (total: number) => `共 ${total} 条数据`,
      pageSizeOptions: ['10', '20', '30', '40', '50'],
    })

    const refresh = async () => {
      loading.value = true
      try {
        const value = {...formState, page: pagination.current, size: pagination.pageSize,}
        const data = await systemInfo.queryScriptManager(value)
        pagination.total = data.total;
        dataList.value = data.list;
        loading.value = false
      } catch (e) {
        loading.value = false
        console.error(e)
      }
    }
    const handleTableChange = (pag: TableState['pagination']) => {
      pagination.pageSize = pag?.pageSize as number;
      pagination.current = pag?.current as number;
      refresh()
    }
    watch(formState, _.debounce(refresh, 300))
    onMounted(() => {
      refresh()
    })

    return {
      formState,
      columns,
      dataList,
      pagination,
      loading,
      handleTableChange,
      refresh,
    }
  }
}

</script>

<style scoped lang="less">
@import '../components/index.less';
</style>
