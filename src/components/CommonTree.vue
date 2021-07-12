<template>
  <a-tree-select
      v-model:value="serverValue"
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
import { ref, watch} from "vue";
import serverRepositories from "@/composable/serverRepositories";

export default {
  name: "commonTree",
  emits: ['treeChange'],
  setup(props: any, {emit}: any) {
    const serverValue = ref<string[]>([]);
    const { treeData } = serverRepositories()

    watch(serverValue, () => {
      let ids: any = []
      if (serverValue.value.length > 0) {
        // console.log(serverValue, '[[[[')
        ids = serverValue.value.map(v => {
          const arr = v.split('-');
          return parseInt(arr[arr.length - 1], 10);
        });
      }
      emit('treeChange', ids)
    });

    return {
      serverValue,
      treeData,
    }
  }
}
</script>

<style scoped lang="less">
@import "./index.less";
</style>
