<template>
  <img
      alt="Vue logo"
      src="../assets/logo.png"
  />
  <h1>{{ msg }}</h1>
  <h1>{{count}}</h1>
  <button @click="inCrement">加</button>
</template>

<script lang="ts">
import {computed, defineComponent } from 'vue'
import {key} from '../store';
import {useStore} from 'vuex';

export default defineComponent({
  name: 'Home',
  data() {
    return {
      msg: 'Hello Vue 3.0 + Vite!',
    }
  },
  computed: {
  },
  methods: {
  },
  setup(prop, content) {
    console.log(prop, content, 'prop content');
    const store = useStore(key)
    const count = computed(() => store.state.count);
    return {
      count,
      inCrement: () => store.commit('increment')
    }
  }
})
</script>
