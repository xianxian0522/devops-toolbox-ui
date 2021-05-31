<template>
  <a-form :model="formState" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
    <a-form-item label="执行用户">
      <a-select
          v-model:value="formState.userid"
          show-search
          placeholder="Select a user"
          style="width: 100%">
        <a-select-option v-for="option in usersList" :key="option" :value="option">{{ option }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="脚本">
      <a-select
          v-model:value="formState.scriptId"
          show-search
          placeholder="Select a script"
          style="width: 100%">
        <a-select-option v-for="option in scriptList" :key="option.id" :value="option.id">{{ option.filename }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="执行时间">
      <a-date-picker
          v-model:value="formState.execTime"
          show-time
          type="date"
          placeholder="Pick a date"
          style="width: 100%"
      />
    </a-form-item>
    <a-form-item label="服务器">
      <CommonTree @treeChange="selectServers"/>
<!--      <a-select-->
<!--          mode="multiple"-->
<!--          v-model:value="formState.servers"-->
<!--          style="width: 100%"-->
<!--          placeholder="Please select server">-->
<!--        <a-select-option value="jack">Jack</a-select-option>-->
<!--        <a-select-option value="lucy">Lucy</a-select-option>-->
<!--        <a-select-option value="tom">Tom</a-select-option>-->
<!--      </a-select>-->
    </a-form-item>
    <a-form-item label="crontab">
      <a-input v-model:value="formState.scheduleTime" placeholder="input crontab" />
    </a-form-item>
    <a-form-item label="备注">
      <a-input v-model:value="formState.comment" placeholder="input comment" />
    </a-form-item>
  </a-form>
  <div class="btns" style="text-align: right">
    <a-button @click="onCancel">取消</a-button>
    <a-button @click="onSubmit">确定</a-button>
  </div>
</template>

<script lang="ts">
import {onMounted, reactive, toRefs} from "vue";
import systemInfo from "../api/systemInfo";
import CommonTree from '../components/CommonTree.vue'

export default {
  name: "TaskEdit",
  props: ['data'],
  components: {CommonTree, },
  emits: ['changeShowTask'],
  setup(props: any, {emit}: any) {
    console.log(props.data)
    const formState = reactive({
      scriptId: props.data?.scriptId,
      userid: props.data?.userid,
      execTime: props.data?.execTime,
      scheduleTime: props.data?.scheduleTime,
      servers: props.data?.servers,
      comment: props.data?.comment,
    })
    const state = reactive({
      usersList: [],
      serversList: [],
      scriptList: [],
    })

    const onSubmit = async () => {

    }
    const onCancel = () => {
      emit('changeShowTask')
    }

    const getUser = async () => {
      const data = await systemInfo.queryPageAll('getServerUser')
      state.usersList = data.content
    }
    // const getServer = async () => {
    //   const data = await systemInfo.queryPageAll('getServers')
    // }
    const getScript = async () => {
      const data = await systemInfo.queryPageAll('getScriptList')
      state.scriptList = data.list
    }
    const selectServers = (value) => {
      formState.servers = value
    }

    onMounted(() => {
      getScript()
      getUser()
    })

    return {
      formState,
      ...toRefs(state),
      onSubmit,
      onCancel,
      selectServers,
    }
  }
}
</script>

<style scoped lang="less">

</style>
