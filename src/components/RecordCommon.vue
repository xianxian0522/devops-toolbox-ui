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
        <a-date-picker show-time v-model:value="formState.starttime" placeholder="开始时间" size="small" />
      </a-form-item>
      <a-form-item label="结束时间">
        <a-date-picker show-time v-model:value="formState.endtime" placeholder="结束时间" size="small" />
      </a-form-item>
      <a-form-item label="执行用户">
        <a-select
            v-model:value="formState.serverUser"
            show-search
            placeholder="Select a person"
            size="small"
            style="width: 200px; margin-left: 10px;"
        >
          <a-select-option v-for="option in userData" :key="option" :value="option">{{option}}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">

import systemInfo from "../api/systemInfo";
import {onMounted, reactive, ref} from "vue";

export default {
  name: "RecordCommon",
  props: {
    form: Object,
  },
  setup(props: any) {
    const formState = reactive({
      done: props.form?.done,
      fileName: props.form?.fileName,
      starttime: props.form?.starttime,
      endtime: props.form?.endtime,
      serverUser: props.form?.serverUser,
    })
    const userData = ref<string[]>([])
    const getServerUser = async () => {
      const data = await systemInfo.queryServersUser()
      userData.value = data.content
    }

    onMounted(() => {
      getServerUser()
    })

    return {
      formState,
      userData,
    }
  },
}
</script>

<style scoped>

</style>
