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
        <a-button type="primary" :disabled="!scriptId" @click="execScript">执行脚本</a-button>
        <a-button type="primary" @click="execCommand">执行命令</a-button>
      </div>
    </div>
    <div class="home-command">
      <a-textarea v-model:value="command" placeholder="脚本输入框" :rows="6" />
      <a-textarea v-model:value="comment" placeholder="备注" :rows="6" />
    </div>
    </a-spin>
    <div>
      neirong
    </div>
  </div>
</template>

<script lang="ts">
import {onMounted, reactive, ref, watch, toRefs} from 'vue';
import systemInfo from "../api/systemInfo";


interface TreeDataItem {
  value: string;
  key: string;
  title?: string;
  disabled?: boolean;
  children?: TreeDataItem[];
}

export default {
  name: "Home",
  setup() {
    const value = ref<string[]>([]);
    const treeData = ref<TreeDataItem[]>([]);
    const valueParams = ref<string[]>([]);
    const isLoading = ref(false);
    const state = reactive({
      ids: [],
      args: [],
      scriptId: '',
      command: '',
      comment: '',
    });

    const getServers = async () => {
      const data = await systemInfo.queryPageAll('getServers', value);
      data.Biz.map((biz, index: number) => {
        // console.log(treeData, biz);
        treeData.value.push({
          value: biz.Name,
          title: biz.Name,
          key: biz.Name,
          disabled: true,
          children: [],
        });
        if ((biz.Apps && biz.Apps.length > 0) || (biz.Hosts && biz.Hosts.length > 0)) {
          treeData.value[index].children.push({
            value: '主机-' + index + '-' + biz.Name,
            title: '主机',
            key: '主机-' + index + '-' + biz.Name,
            disabled: true,
            children: (biz.Hosts.map(h => ({
              value: h.Name + '-' + h.Id,
              title: h.Ip,
              key: h.Name + '-' + h.Id,
              disabled: false,
            }))),
          })
          if (biz.Apps[0].Hosts && biz.Apps[0].Hosts.length > 0) {
            treeData.value[index].children.push({
              value: '应用-' + index + '-' + biz.Name,
              title: '应用',
              key: '应用-' + index + '-' + biz.Name,
              disabled: true,
              children: (biz.Apps.map((a) => ({
                value: a.Name,
                title: a.Name,
                key: a.Name,
                disabled: true,
                children: (a.Hosts.map(h => ({
                  value: a.Name + '-' + h.HostName + '-' + h.Id,
                  title: (Object.keys(h).filter(id => id !== 'Id').map(key => `${key}:${h[key]}`).join(',')),
                  key: a.Name + '-' + h.HostName + '-' + h.Id,
                  disabled: false,
                })))
              }))),
            })
          } else {
            treeData.value[index].children.push({
              value: '应用-' + index + '-' + biz.Name,
              title: '应用',
              key: '应用-' + index + '-' + biz.Name,
              disabled: true,
              children: (biz.Apps.map(a => ({
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

    const execScript = async () => {
      const value = state;
      delete value.comment;
      delete value.command;
      const res = await systemInfo.execCommandScript('execScript', value);
      console.log(res, 'res');
    }
    const execCommand = async () => {
      const value = state;
      delete value.scriptId;
      const res = await systemInfo.execCommandScript('execCommand', value);
      isLoading.value = true;
      if (res && res.id) {
        await getCurrentOutById(res.id);
      } else {
        isLoading.value = false;
      }
    }

    const queryContent = async () => {
      const data = await systemInfo.queryEditById(state.scriptId);
      state.command = data.command;
      state.comment = data.comment;
    }

    const getCurrentOutById = async (outId) => {
      const data = await systemInfo.queryPageAll('getCurrentOut', { outId });
      if (data.out.length === 0) {
        setTimeout( await getCurrentOutById(outId), 20000);
      } else {
        isLoading.value = false;
        console.log(data, 'outId');
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
      execCommand,
      execScript,
      isLoading,
    };
  },
  created() {
    if (this.$route.query && this.$route.query.scriptId) {
      this.scriptId = this.$route.query.scriptId;
    }
    console.log(this.scriptId, 'di');
  }
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
</style>
