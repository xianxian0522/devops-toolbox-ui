<template>
  <a-tree-select
      v-model:value="value"
      :treeData="treeData"
      show-search
      multiple
      style="width: 100%"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      placeholder="请选择服务器"
      allow-clear
      dropdownMatchSelectWidth
      tree-default-expand-all>
  </a-tree-select>
</template>

<script lang="ts">
import {onMounted, ref, watch} from "vue";
import {TreeDataItem} from "../views/Home.vue";
import systemInfo from "../api/systemInfo";

export default {
  name: "commonTree",
  emits: ['treeChange'],
  setup(props: any, {emit}: any) {
    const value = ref<string[]>([]);
    const treeData = ref<TreeDataItem[]>([]);

    const getServers = async () => {
      try {
        const data = await systemInfo.queryPageAll('getServers');
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
      } catch (e) {
        console.error(e)
      }
    }

    onMounted(() => {
      getServers()
    })
    watch(value, () => {
      let ids: any = []
      if (value.value.length > 0) {
        ids = value.value.map(v => {
          const arr = v.split('-');
          return parseInt(arr[arr.length - 1], 10);
        });
      }
      emit('treeChange', ids)
    });

    return {
      value,
      treeData,
    }
  }
}
</script>

<style scoped lang="less">
@import "./index.less";
</style>
