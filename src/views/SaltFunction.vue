<template>
  <div class="app-common-content" >
    <a-spin :spinning="isLoading" tip="Loading..." size="large">
      <CommonBreadcrumb >
        <template v-slot:first>devops</template>
        <template v-slot:second>toolbox</template>
        <template v-slot:three>Salt Function</template>
      </CommonBreadcrumb>
      <div class="toolbox-search">
        <a-form :model="formState" layout="inline" style="display: flex; align-items: center">
          <a-form-item label="服务器">
            <a-select
                v-model:value="formState.ids"
                mode="multiple"
                :filterOption="filterOption"
                placeholder="Select a servers"
                style="width: 400px">
              <a-select-option v-for="option in serversList" :key="option.Id" :value="option.Id" :title="option.Ip + ' - ' + option.Name">{{ option.Ip }} - {{ option.Name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="参数">
            <a-select
                v-model:value="formState.args"
                mode="tags"
                style="width: 200px"
                placeholder="脚本所需要的参数">
            </a-select>
          </a-form-item>
          <a-button type="primary" @click="runFunction">运行</a-button>
        </a-form>
        <div class="salt-function">
          <a-textarea v-model:value="formState.functionName" placeholder="Salt 函数" :rows="6" />
          <a-textarea v-model:value="formState.comment" placeholder="备注" :rows="6" />
        </div>
      </div>
      <div >
        <Description v-if="isShowChild" :outData="outData"/>
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts">
import systemInfo from "../api/systemInfo";
import {onMounted, reactive, ref, toRefs, UnwrapRef} from "vue";
import Description from '../components/Description.vue'
import {OutResponse, ServerInfo} from "@/utils/response";
import CommonBreadcrumb from "@/components/CommonBreadcrumb.vue";
import {StateOut} from "@/views/Home.vue";

export default {
  name: "SaltFunction",
  components: {
    Description,
    CommonBreadcrumb,
  },
  setup() {
    const formState = reactive({
      ids: [],
      args: [],
      comment: '',
      functionName: '',
    })
    const serversList = ref<ServerInfo[]>([])
    const stateOut: UnwrapRef<StateOut> = reactive({
      isLoading: false,
      isShowChild: false,
      outData: [],
    });

    const getServers = async () => {
      serversList.value = await systemInfo.queryServers()
    }
    const filterOption = (input: string, option: any) => {
      return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }

    const runFunction = async () => {
      try {
        stateOut.isLoading = true
        const value = {...formState}
        const data = await systemInfo.doCustomComplete(value)
        stateOut.isLoading = false
        stateOut.isShowChild = true
        stateOut.outData = data
      } catch (e) {
        console.error(e)
        stateOut.isLoading = false
      }
    }

    onMounted(() => {
      getServers()
    })

    return {
      formState,
      serversList,
      ...toRefs(stateOut),
      filterOption,
      runFunction,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
.salt-function {
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
  textarea:nth-child(1) {
    margin-right: 20px;
  }
  textarea:nth-child(2) {
    width: 35%;
  }
}
</style>
