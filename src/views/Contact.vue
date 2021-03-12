<template>
  <img
      alt="Vue logo"
      src="../assets/logo.png"
  />
  <h1>{{ msg }}</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Contact',
  data() {
    return {
      msg: 'vite 联系我们!'
    }
  },
  setup() {}
})
</script>
