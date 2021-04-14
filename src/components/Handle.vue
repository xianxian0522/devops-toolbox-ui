<template>
  <div class="x-handle" @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp"></div>
</template>

<script setup>
import {defineEmit, ref} from "vue";

const emit = defineEmit(['widthChange'])
const lastX = ref(0)

const mouseDown = (e) => {
  lastX.value = e.screenX
}
const mouseMove = (e) => {
  // 触发父组件
  emit('widthChange', lastX.value - e.screenX)
  lastX.value = e.screenX
}
const mouseUp = () => {
  lastX.value = 0
}

</script>

<style scoped lang="less">
.x-handle {
  width: 20px;
  height: 2px;
  cursor: w-resize;
  z-index: 10;
  background: #ccc;
}
</style>
