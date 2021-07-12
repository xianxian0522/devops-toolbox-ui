<template>
  <div class="app-common-content">
    <a-spin :spinning="isLoading" tip="Loading..." size="large">
      <CommonBreadcrumb >
        <template v-slot:first>devops</template>
        <template v-slot:second>toolbox</template>
        <template v-slot:three>首页</template>
      </CommonBreadcrumb>
      <div class="home-select">
<!--        <CommonTree @treeChange="selectIds" />-->
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
<!--      <div class="home-command-out">-->
<!--        <Description v-if="isShowChild" :outData="outData"/>-->
<!--&lt;!&ndash;        <a-descriptions :title="index === 0 ? '执行命令的输出' : ''" bordered v-for="(out, index) in outData">&ndash;&gt;-->
<!--&lt;!&ndash;          <a-descriptions-item label="id">{{ out.id }}</a-descriptions-item>&ndash;&gt;-->
<!--&lt;!&ndash;          <a-descriptions-item label="Ip" :span="2">{{ out.ip }}</a-descriptions-item>&ndash;&gt;-->
<!--&lt;!&ndash;          <a-descriptions-item label="pid">{{ out.pid }}</a-descriptions-item>&ndash;&gt;-->
<!--&lt;!&ndash;          <a-descriptions-item label="stderr" :span="2">{{ out.stderr }}</a-descriptions-item>&ndash;&gt;-->
<!--&lt;!&ndash;          <a-descriptions-item label="retcode">{{ out.retcode }}</a-descriptions-item>&ndash;&gt;-->
<!--&lt;!&ndash;          <a-descriptions-item label="stdout">{{ out.stdout }}</a-descriptions-item>&ndash;&gt;-->
<!--&lt;!&ndash;        </a-descriptions>&ndash;&gt;-->
<!--      </div>-->
    </a-spin>
  </div>
</template>

<script lang="ts">
import {onMounted, reactive, ref, watch, toRefs, getCurrentInstance, provide, onBeforeUnmount, UnwrapRef} from 'vue';
import systemInfo from "../api/systemInfo";
import {useRoute} from "vue-router";
import Description from '../components/Description.vue';
import CommonTree from '../components/CommonTree.vue'
import CommonBreadcrumb from "@/components/CommonBreadcrumb.vue";
import {OutResponse, TreeDataItem} from "@/utils/response";

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
    // Description, CommonTree,
    CommonBreadcrumb,
  },
  setup() {
    const value = ref<string[]>([]);
    const treeData = ref<TreeDataItem[]>([]);
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

    const getServers = async () => {
      try {
        // const data = await systemInfo.queryPageAll('getServers');
        // if (data && data.Biz) {
        //   data.Biz.map((biz: any, index: number) => {
        //     // console.log(treeData, biz);
        //     treeData.value.push({
        //       value: biz.Name,
        //       title: biz.Name,
        //       key: biz.Name,
        //       disabled: true,
        //       children: [],
        //     });
        //     if ((biz.Apps && biz.Apps.length > 0) || (biz.Hosts && biz.Hosts.length > 0)) {
        //       (treeData.value[index].children as TreeDataItem[]).push({
        //         value: '主机-' + index + '-' + biz.Name,
        //         title: '主机',
        //         key: '主机-' + index + '-' + biz.Name,
        //         disabled: true,
        //         children: (biz.Hosts.map((h: any) => ({
        //           value: h.Name + '-' + h.Id,
        //           title: h.Ip,
        //           key: h.Name + '-' + h.Id,
        //           disabled: false,
        //         }))),
        //       })
        //       if (biz.Apps[0].Hosts && biz.Apps[0].Hosts.length > 0) {
        //         (treeData.value[index].children as TreeDataItem[]).push({
        //           value: '应用-' + index + '-' + biz.Name,
        //           title: '应用',
        //           key: '应用-' + index + '-' + biz.Name,
        //           disabled: true,
        //           children: (biz.Apps.map((a: any) => ({
        //             value: a.Name,
        //             title: a.Name,
        //             key: a.Name,
        //             disabled: true,
        //             children: (a.Hosts.map((h: any) => ({
        //               value: a.Name + '-' + h.HostName + '-' + h.Id,
        //               title: (Object.keys(h).filter(id => id !== 'Id').map(key => `${key}:${h[key]}`).join(',')),
        //               key: a.Name + '-' + h.HostName + '-' + h.Id,
        //               disabled: false,
        //             })))
        //           }))),
        //         })
        //       } else {
        //         (treeData.value[index].children as TreeDataItem[]).push({
        //           value: '应用-' + index + '-' + biz.Name,
        //           title: '应用',
        //           key: '应用-' + index + '-' + biz.Name,
        //           disabled: true,
        //           children: (biz.Apps.map((a: any) => ({
        //             value: a.Name,
        //             title: a.Name,
        //             key: a.Name,
        //             disabled: true,
        //           }))),
        //         });
        //       }
        //     }
        //   });
        // }
      } catch (e) {
        console.error(e)
      }
    }

    const selectIds = (value: number[]) => {
      state.ids = value
    }

    const execScript = async () => {
      stateOut.isLoading = true;
      const res = await systemInfo.execCommandScript('execScript', state);
      // if (res && res.id) {
      //   await getCurrentOutById(res.id)
      // } else {
      //   stateOut.isLoading = false;
      // }
    }
    const execCommand = async () => {
      stateOut.isLoading = true;
      const res = await systemInfo.execCommandScript('execCommand', state);
      // if (res && res.id) {
      //   await getCurrentOutById(res.id);
      // } else {
      //   stateOut.isLoading = false;
      // }
    }

    const queryContent = async () => {
      const data = await systemInfo.queryHomeEditById(state.scriptId);
      // if (data && data.command) {
      //   if (state.scriptId === 0) {
      //     state.commandHolder = data.command;
      //     state.commentHolder = data.comment;
      //   } else {
      //     state.command = data.command;
      //     state.comment = data.comment;
      //   }
      // }
    }

    const getCurrentOutById = async (outId: number) => {
      const data = await systemInfo.queryPageAll('getCurrentOut', { outId });
      // if (data?.out?.length === 0) {
      //   timer.value = await setTimeout( () => getCurrentOutById(outId), 2000);
      // } else {
      //   stateOut.isLoading = false;
      //   stateOut.outData = data.out;
      //   stateOut.isShowChild = true;
      // }
    }

    const getServerUser = async () => {
      const data = await systemInfo.queryPageAll('getServerUser');
      // userData.value = data.content
      // state.user = userData.value?.[0]
    }

    onMounted(() => {
      // getServers();
      // queryContent();
      // getServerUser();
    })
    onBeforeUnmount(() => {
      clearTimeout(timer.value)
    })

    // watch(value, () => {
    //   if (value.value.length > 0) {
    //     state.ids = value.value.map(v => {
    //       const arr = v.split('-');
    //       return parseInt(arr[arr.length - 1], 10);
    //     });
    //   } else {
    //     state.ids = [];
    //   }
    // });
    watch(scriptParams, () => {
      state.args = scriptParams.value;
    });

    return {
      // // value,
      // // treeData,
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
