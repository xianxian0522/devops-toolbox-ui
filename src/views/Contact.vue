<template>
  <img
      alt="Vue logo"
      src="../assets/logo.png"
  />
  <h1>{{ msg }}</h1>
  <h1>{{ count }}</h1>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue'
import {useStore} from "vuex";
import {key, store} from "../store";

export default defineComponent({
  name: 'Contact',
  data() {
    return {
      msg: 'vite 联系我们!',
      count: store.state.count,
    }
  },
  setup() {
    // const count = computed(() => useStore(key).state.count);
    // return count;
  }
})
</script>
