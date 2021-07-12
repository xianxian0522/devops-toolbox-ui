<template>
  <div class="tree-slider">
    <a-input-search v-model:value="searchValue" style="margin-bottom: 8px" placeholder="Search" />
    <a-tree
        v-model:expandedKeys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :tree-data="gData"
    >
      <template #title="{ title }">
        <span v-if="title.indexOf(searchValue) > -1">
          {{ title.substr(0, title.indexOf(searchValue)) }} sss
          <span style="color: #f50">{{ searchValue }} xxx</span>
          {{ title.substr(title.indexOf(searchValue) + searchValue.length) }} yyy
        </span>
        <span v-else>{{ title }} ss</span>
      </template>
    </a-tree>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { TreeDataItem } from 'ant-design-vue/es/tree/Tree';
// import {store} from "../store";


const x = 3;
const y = 2;
const z = 2;
const genData: TreeDataItem[] = [];

const generateData = (_level: number, _preKey?: string, _tns?: TreeDataItem[]) => {
  const preKey = _preKey || '0';
  const tns = _tns || genData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

const dataList: TreeDataItem[] = [];
const generateList = (data: TreeDataItem[]) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    dataList.push({ key, title: key as string });
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(genData);

const getParentKey = (key: string, tree: TreeDataItem[]): string | number | undefined => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

export default defineComponent({
  name: 'Contact',
  data() {
    return {
      msg: 'vite 联系我们!',
      // count: store.state.count,
    }
  },
  setup() {
    const expandedKeys = ref<string[]>([]);
    const searchValue = ref<string>('');
    const autoExpandParent = ref<boolean>(true);
    const gData = ref<TreeDataItem[]>(genData);

    watch(expandedKeys, () => {
      autoExpandParent.value = false;
    });
    watch(searchValue, value => {
      const expanded = dataList
          .map((item: TreeDataItem) => {
            if ((item.title as string).indexOf(value) > -1) {
              return getParentKey(item.key as string, gData.value);
            }
            return null;
          })
          .filter((item, i, self) => item && self.indexOf(item) === i);
      expandedKeys.value = expanded as string[];
      searchValue.value = value;
      autoExpandParent.value = true;
    });
    return {
      expandedKeys,
      searchValue,
      autoExpandParent,
      gData,
    };
  }
})
</script>

<style scoped lang="less">
.tree-slider {
  width: 200px;
  border-right: 1px solid #DCDEE5;
  height: 100%;
  overflow-y: auto;
}
.ant-tree {
  text-align: left;
}
</style>
