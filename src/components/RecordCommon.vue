<template>
  <div class="toolbox-search">
    <a-form :model="formState" layout="inline">
<!--      <a-button @click="refresh">搜索</a-button>-->
      <slot name="button"></slot>
      <a-form-item label="是否完成">
        <a-checkbox v-model:checked="formState.done"></a-checkbox>
      </a-form-item>
      <a-form-item label="文件名">
        <a-input v-model:value="formState.fileName" placeholder="文件名" size="small"></a-input>
      </a-form-item>
      <a-form-item label="开始时间">
        <a-space direction="vertical">
          <a-date-picker show-time v-model:value="formState.starttime" placeholder="开始时间" size="small" />
        </a-space>
      </a-form-item>
      <a-form-item label="结束时间">
        <a-space direction="vertical">
          <a-date-picker show-time v-model:value="formState.endtime" placeholder="结束时间" size="small" />
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">

export default {
  name: "RecordCommon",
  props: ['formState'],
  setup() {

  },
}
</script>

<style scoped>

</style>
