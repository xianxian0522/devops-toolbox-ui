<template>
  <a-modal v-model:visible="visible" title="Basic Modal" @ok="addTask">
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-modal>
</template>

<script>
import {reactive, toRefs} from "vue";

export default {
  name: "TaskEdit",
  props: ['show'],
  setup(props) {
    console.log(typeof props.show)
    const state = reactive({
      visible: props.show,
    })

    const addTask = async () => {

    }

    return {
      ...toRefs(state),
      addTask,
    }
  }
}
</script>

<style scoped lang="less">

</style>
