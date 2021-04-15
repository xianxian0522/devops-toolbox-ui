<template>
  <div class="x-handle" @mousedown="mouseDown" @mouseout="mouseOut">
    <div></div>
    <div></div>
  </div>
</template>

<script setup>
import {defineEmit, defineProps, onUnmounted, ref} from "vue";

const emit = defineEmit(['widthChange'])
const lastX = ref(0)

const mouseDown = (e) => {
  document.addEventListener("mousemove", mouseMove);
  lastX.value = e.screenX
}
const mouseMove = (e) => {
  // 触发父组件
  emit('widthChange', lastX.value - e.screenX)
  lastX.value = e.screenX
}
const mouseUp = () => {
  lastX.value = 0
  document.removeEventListener("mousemove", mouseMove);
}
mouseUp()

const mouseOut = () => {
  document.removeEventListener("mousemove", mouseMove);
}


</script>

<style scoped lang="less">
.x-handle {
  width: 30px;
  //height: 2px;
  cursor: w-resize;
  z-index: 10;
  display: flex;
  div:nth-child(1) {
    background: #ccc;
    width: 2px;
  }
}
</style>
