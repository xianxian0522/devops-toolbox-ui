<template>
  <div class="app-common-content">
    <a-spin :spinning="isLoading" tip="Loading..." size="large">
      <CommonBreadcrumb >
        <template v-slot:first>devops</template>
        <template v-slot:second>toolbox</template>
        <template v-slot:three>首页</template>
      </CommonBreadcrumb>
      <div class="home-select">
        <CommonTree @treeChange="selectIds" />
        <div class="btns">
          <a-select
              v-model:value="scriptParams"
              mode="tags"
              style="width: 400px"
              placeholder="脚本所需要的参数">
          </a-select>
          <a-button type="primary" :disabled="scriptId === 0" @click="execScript">执行脚本</a-button>
          <a-button type="primary" :disabled="scriptId !== 0" @click="execCommand">执行命令</a-button>
          <a-select
              v-model:value="user"
              show-search
              placeholder="Select a person"
              style="width: 200px; margin-left: 10px; margin-right: 10px;"
          >
            <a-select-option v-for="option in userData" :key="option" :value="option">{{option}}</a-select-option>
          </a-select>
          <a-input style="width: 200px;" v-model:value="cwd" placeholder="执行路径"></a-input>
        </div>
      </div>
      <div class="home-command">
        <a-textarea v-model:value="command" :readonly="scriptId !== 0" :placeholder="scriptId === 0 ? commandHolder : '脚本输入框'" :rows="6" />
        <a-textarea v-model:value="comment" :readonly="scriptId !== 0" :placeholder="scriptId === 0 ? commentHolder : '备注'" :rows="6" />
      </div>
      <div class="home-command-out">
        <Description v-if="isShowChild" :outData="outData"/>
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts">
import {onMounted, reactive, ref, watch, toRefs, onBeforeUnmount, UnwrapRef} from 'vue';
import systemInfo from "../api/systemInfo";
import {useRoute} from "vue-router";
import Description from '../components/Description.vue';
import CommonTree from '../components/CommonTree.vue'
import CommonBreadcrumb from "@/components/CommonBreadcrumb.vue";
import {OutResponse} from "@/utils/response";

export interface StateOut {
  isLoading: boolean;
  isShowChild: boolean;
  outData: OutResponse[];
}
export interface StateArg {
  ids: number[];
  args: string[];
  scriptId: number;
  command: string;
  comment: string;
  user: string;
  cwd: string;
  commandHolder: string;
  commentHolder: string;
}

export default {
  name: "Home",
  components: {
    Description,
    CommonTree,
    CommonBreadcrumb,
  },
  setup() {
    const scriptParams = ref<string[]>([]);
    const userData = ref<string[]>([])
    const state: UnwrapRef<StateArg> = reactive({
      ids: [],
      args: [],
      scriptId: 0,
      command: '',
      comment: '',
      user: '',
      cwd: '',
      commandHolder: '',
      commentHolder: '',
    });
    const stateOut: UnwrapRef<StateOut> = reactive({
      isLoading: false,
      isShowChild: false,
      outData: [],
    });
    const timer = ref()

    const route = useRoute()
    if (route.query && route.query.scriptId) {
      state.scriptId = parseInt(route.query.scriptId as string, 10);
    }

    const selectIds = (value: number[]) => {
      state.ids = value
    }

    const execScript = async () => {
      try {
        stateOut.isLoading = true;
        const value = {...state}
        const res = await systemInfo.execScript(value)
        await getCurrentOutById(res.id)
      } catch (e) {
        stateOut.isLoading = false;
        console.error(e)
      }
    }
    const execCommand = async () => {
      try {
        stateOut.isLoading = true;
        const value = {...state}
        const res = await systemInfo.execCommand(value)
        await getCurrentOutById(res.id);
      } catch (e) {
        stateOut.isLoading = false;
        console.error(e)
      }
    }

    const queryContent = async () => {
      const data = await systemInfo.queryHomeEditById(state.scriptId);
      if (state.scriptId === 0) {
        state.commandHolder = data.command;
        state.commentHolder = data.comment;
      } else {
        state.command = data.command;
        state.comment = data.comment;
      }
    }

    const getCurrentOutById = async (outId: number) => {
      try {
        const data = await systemInfo.queryCurrentOutById(outId)
        if (data?.out?.length === 0) {
          timer.value = await setTimeout( () => getCurrentOutById(outId), 2000);
        } else {
          stateOut.isLoading = false;
          stateOut.outData = data?.out || [];
          stateOut.isShowChild = true;
        }
      } catch (e) {
        stateOut.isLoading = false
        console.error(e)
      }
    }

    const getServerUser = async () => {
      const data = await systemInfo.queryServersUser()

      userData.value = data.content
      state.user = userData.value?.[0]
    }

    onMounted(() => {
      queryContent();
      getServerUser();
    })
    onBeforeUnmount(() => {
      clearTimeout(timer.value)
    })

    watch(scriptParams, () => {
      state.args = scriptParams.value;
    });

    return {
      scriptParams,
      userData,
      ...toRefs(state),
      ...toRefs(stateOut),
      execCommand,
      execScript,
      selectIds,
    };
  },
}
</script>

<style lang="less">
@import '../components/index.less';
.home-select {
  text-align: left;
}
.ant-select-dropdown {
  word-break: break-all;
}
.ant-select-tree li {
  white-space: pre-wrap;
}
.home-command {
  display: flex;
  margin-top: 20px;
  textarea:nth-child(1) {
    margin-right: 20px;
  }
  textarea:nth-child(2) {
    width: 35%;
  }
}
.home-command-out {
  margin-top: 20px;
  .ant-descriptions {
    margin-bottom: 10px;
    white-space: pre-wrap;
    word-break: break-all;
  }
}
</style>
