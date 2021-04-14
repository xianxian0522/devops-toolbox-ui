<template>
  <div class="app-common-content">
    <a-spin :spinning="isLoading" tip="Loading..." size="large">
      <a-breadcrumb separator=">" class="app-common-header">
        <a-breadcrumb-item>devops</a-breadcrumb-item>
        <a-breadcrumb-item>toolbox</a-breadcrumb-item>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="home-select">
        <a-tree-select
            v-model:value="value"
            :treeData="treeData"
            show-search
            multiple
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择服务器"
            allow-clear
            tree-default-expand-all>
        </a-tree-select>
        <div class="btns">
          <a-select
              v-model:value="valueParams"
              mode="tags"
              style="width: 400px"
              placeholder="请输入参数">
          </a-select>
          <a-button type="primary" :disabled="scriptId === 0" @click="execScript">执行脚本</a-button>
          <a-button type="primary" :disabled="scriptId !== 0" @click="execCommand">执行命令</a-button>
        </div>
      </div>
      <div class="home-command">
        <a-textarea v-model:value="command" placeholder="脚本输入框" :rows="6" />
        <a-textarea v-model:value="comment" placeholder="备注" :rows="6" />
      </div>
      <div class="home-command-out">
        <Description v-if="isShowChild" :outData="outData"/>
<!--        <a-descriptions :title="index === 0 ? '执行命令的输出' : ''" bordered v-for="(out, index) in outData">-->
<!--          <a-descriptions-item label="id">{{ out.id }}</a-descriptions-item>-->
<!--          <a-descriptions-item label="Ip" :span="2">{{ out.ip }}</a-descriptions-item>-->
<!--          <a-descriptions-item label="pid">{{ out.pid }}</a-descriptions-item>-->
<!--          <a-descriptions-item label="stderr" :span="2">{{ out.stderr }}</a-descriptions-item>-->
<!--          <a-descriptions-item label="retcode">{{ out.retcode }}</a-descriptions-item>-->
<!--          <a-descriptions-item label="stdout">{{ out.stdout }}</a-descriptions-item>-->
<!--        </a-descriptions>-->
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts">
import {onMounted, reactive, ref, watch, toRefs, getCurrentInstance, provide} from 'vue';
import systemInfo from "../api/systemInfo";
import {useRoute} from "vue-router";
import Description from '../components/Description.vue';


interface TreeDataItem {
  value: string;
  key: string;
  title?: string;
  disabled?: boolean;
  children?: TreeDataItem[];
}
interface OutItem {
  id: number;
  ip: string;
  pid: number;
  stderr: string;
  retcode: number;
  stdout: number;
}

export default {
  name: "Home",
  components: { Description },
  setup() {
    const value = ref<string[]>([]);
    const treeData = ref<TreeDataItem[]>([]);
    const valueParams = ref<string[]>([]);
    const state = reactive({
      ids: [] as number[],
      args: [] as string[],
      scriptId: 0 as number,
      command: '' as string,
      comment: '',
    });
    const stateOut = reactive({
      isLoading: false,
      isShowChild: false,
      outData: [] as OutItem[],
    });
    // provide('outData', stateOut.outData);

    // const proxy = getCurrentInstance()?.proxy
    // console.log(proxy?.$root?.$route)
    const route = useRoute()
    if (route.query && route.query.scriptId) {
      state.scriptId = parseInt(route.query.scriptId, 10);
    }

    const getServers = async () => {
      const data = await systemInfo.queryPageAll('getServers', value);
      if (data && data.Biz) {
        data.Biz.map((biz: any, index: number) => {
          // console.log(treeData, biz);
          treeData.value.push({
            value: biz.Name,
            title: biz.Name,
            key: biz.Name,
            disabled: true,
            children: [],
          });
          if ((biz.Apps && biz.Apps.length > 0) || (biz.Hosts && biz.Hosts.length > 0)) {
            (treeData.value[index].children as TreeDataItem[]).push({
              value: '主机-' + index + '-' + biz.Name,
              title: '主机',
              key: '主机-' + index + '-' + biz.Name,
              disabled: true,
              children: (biz.Hosts.map((h: any) => ({
                value: h.Name + '-' + h.Id,
                title: h.Ip,
                key: h.Name + '-' + h.Id,
                disabled: false,
              }))),
            })
            if (biz.Apps[0].Hosts && biz.Apps[0].Hosts.length > 0) {
              (treeData.value[index].children as TreeDataItem[]).push({
                value: '应用-' + index + '-' + biz.Name,
                title: '应用',
                key: '应用-' + index + '-' + biz.Name,
                disabled: true,
                children: (biz.Apps.map((a: any) => ({
                  value: a.Name,
                  title: a.Name,
                  key: a.Name,
                  disabled: true,
                  children: (a.Hosts.map((h: any) => ({
                    value: a.Name + '-' + h.HostName + '-' + h.Id,
                    title: (Object.keys(h).filter(id => id !== 'Id').map(key => `${key}:${h[key]}`).join(',')),
                    key: a.Name + '-' + h.HostName + '-' + h.Id,
                    disabled: false,
                  })))
                }))),
              })
            } else {
              (treeData.value[index].children as TreeDataItem[]).push({
                value: '应用-' + index + '-' + biz.Name,
                title: '应用',
                key: '应用-' + index + '-' + biz.Name,
                disabled: true,
                children: (biz.Apps.map((a: any) => ({
                  value: a.Name,
                  title: a.Name,
                  key: a.Name,
                  disabled: true,
                }))),
              });
            }
          }
        });
      }
    }

    const execScript = async () => {
      stateOut.isLoading = true;
      const res = await systemInfo.execCommandScript('execScript', state);
      if (res && res.id) {
        await getCurrentOutById(res.id)
      } else {
        stateOut.isLoading = false;
      }
    }
    const execCommand = async () => {
      stateOut.isLoading = true;
      const res = await systemInfo.execCommandScript('execCommand', state);
      if (res && res.id) {
        await getCurrentOutById(res.id);
      } else {
        stateOut.isLoading = false;
      }
    }

    const queryContent = async () => {
      const data = await systemInfo.queryEditById(state.scriptId);
      if (data && data.command) {
        state.command = data.command;
        state.comment = data.comment;
      }
    }

    const getCurrentOutById = async (outId: number) => {
      const data = await systemInfo.queryPageAll('getCurrentOut', { outId });
      if (data.out.length === 0) {
        await setTimeout( () => getCurrentOutById(outId), 2000);
      } else {
        stateOut.isLoading = false;
        stateOut.outData = data.out;
        stateOut.isShowChild = true;
      }
    }

    onMounted(() => {
      getServers();
      queryContent();
    })

    watch(value, () => {
      if (value.value.length > 0) {
        state.ids = value.value.map(v => {
          const arr = v.split('-');
          return parseInt(arr[arr.length - 1], 10);
        });
      } else {
        state.ids = [];
      }
    });
    watch(valueParams, () => {
      state.args = valueParams.value;
    });

    return {
      value,
      getServers,
      treeData,
      valueParams,
      ...toRefs(state),
      ...toRefs(stateOut),
      execCommand,
      execScript,
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
}
.home-command-out {
  margin-top: 20px;
  .ant-descriptions {
    margin-bottom: 10px;
  }
}
</style>
