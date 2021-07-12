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

<!--    <a-modal-->
<!--        :title="mode === 'created' ? '新增脚本信息' : '修改脚本信息'"-->
<!--        v-model:visible="visible"-->
<!--        @ok="onSubmit"-->
<!--        :width="width"-->
<!--        ok-text="确认"-->
<!--        cancel-text="取消"-->
<!--        :ok-button-props="{ disabled: !!isOnlyShowScript }"-->
<!--        :destroyOnClose="true"-->
<!--    >-->
<!--      <div style="display: flex">-->
<!--        <div style="flex: 1">-->
<!--          <a-form :model="scriptValue" :label-col="{ span: 4 }" :wrapper-col="{ span: 18}">-->
<!--            <a-form-item label="文件名" v-if="!isOnlyShowScript">-->
<!--              <a-input  v-model:value="scriptValue.fileName" placeholder="文件名" size="small"></a-input>-->
<!--            </a-form-item>-->
<!--            <a-form-item label="备 注" v-if="!isOnlyShowScript">-->
<!--              <a-input v-model:value="scriptValue.comment" placeholder="备注" size="small"></a-input>-->
<!--            </a-form-item>-->
<!--            <a-form-item label="脚 本">-->
<!--              <a-textarea :readonly="isOnlyShowScript" v-model:value="scriptValue.script" placeholder="脚本输入框" :auto-size="{ minRows: 4 }"/>-->
<!--            </a-form-item>-->
<!--          </a-form>-->
<!--        </div>-->
<!--        <Handle v-if="visible" @widthChange="widthChangeModal" />-->
<!--      </div>-->
<!--    </a-modal>-->
  </div>
</template>

<script lang="ts">
import {computed, onMounted, reactive, ref, watch} from "vue";
import {message} from "ant-design-vue";
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
    const visible = ref(false)
    const width = ref(500)
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
        // Modal.destroyAll();
      }
    }
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
    const showCreateScript = () => {
      visible.value = true;
      mode.value = 'created';
      isOnlyShowScript.value = false;
      scriptValue.id = null
      scriptValue.fileName = ''
      scriptValue.comment = ''
      scriptValue.script = ''
    }
    const showEditScript = async (id: number, isShow: boolean) => {
      visible.value = true;
      mode.value = 'edit';
      isOnlyShowScript.value = isShow;
      const value = await systemInfo.queryPageAll(`getScriptDetail?id=${id}`)
      // scriptValue.id = value.id
      // scriptValue.fileName = value.filename
      // scriptValue.comment = value.comment
      // scriptValue.script = value.script
    }
    const handleTableChange = (pag: TableState['pagination']) => {
      pagination.pageSize = pag?.pageSize as number;
      pagination.current = pag?.current as number;
      refresh()
    };

    // const widthChangeModal = (e) => {
    //   if (visible.value) {
    //     width.value -= e
    //     if (width.value < 300) {
    //       width.value = 300;
    //     }
    //   }
    // }

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
