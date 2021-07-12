<template>
  <div>
    <CommonBreadcrumb >
      <template v-slot:first>devops</template>
      <template v-slot:second>toolbox</template>
      <template v-slot:three>脚本编辑</template>
    </CommonBreadcrumb>
    <div class="edit-title">
      <span>{{ isEdit ? scriptId ? '修改脚本信息' : '新增脚本信息' : '脚本详情'}}</span>
      <a-button type="primary" @click="updateScript" :disabled="!isEdit">确定</a-button>
    </div>
    <a-form :model="scriptValue" >
      <a-form-item label="文件名" v-if="isEdit">
        <a-input v-model:value="scriptValue.fileName" placeholder="文件名" size="small"></a-input>
      </a-form-item>
      <a-form-item label="备 注" v-if="isEdit">
        <a-input v-model:value="scriptValue.comment" placeholder="备注" size="small"></a-input>
      </a-form-item>
      <a-form-item label="脚 本">
        <a-textarea :readonly="!isEdit" v-model:value="scriptValue.script" placeholder="脚本输入框" :auto-size="{ minRows: 4 }"/>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from 'vue'
import {useRoute} from "vue-router";
import CommonBreadcrumb from "@/components/CommonBreadcrumb.vue";
import systemInfo from "@/api/systemInfo";

export default defineComponent({
  name: 'ScriptEdit',
  components: {CommonBreadcrumb},
  setup() {
    const route = useRoute()
    const isEdit = ref(route.query.isEdit)
    const scriptId = ref(0)

    const scriptValue = reactive({
      id: 0,
      comment: '',
      fileName: '',
      script: '',
    })
    const getScript = async () => {
      try {
        if (scriptId.value) {
          const data = await systemInfo.queryScriptDetail(scriptId.value)
          scriptValue.comment = data.comment
          scriptValue.script = data.script
          scriptValue.fileName = data.filename
          scriptValue.id = data.id
        }
      } catch (e) {
        console.error(e)
      }
    }
    const updateScript = async () => {
      try {
        const value = {...scriptValue}
        scriptId.value ? await systemInfo.updateScript(value)
          : await systemInfo.addScript(value)
        console.log(';;;;')
      } catch (e) {
        console.error(e)
      }
    }
    onMounted(() => {
      scriptId.value = parseInt(route.query.scriptId as string, 10)
      getScript()
    })

    return {
      scriptId,
      isEdit,
      scriptValue,
      updateScript,
    }
  }
})
</script>

<style scoped lang="less">
.edit-title {
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 10px;
  button {
    margin-left: 10px;
  }
}
</style>
