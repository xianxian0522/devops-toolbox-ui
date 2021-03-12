<template>
<!--  <img alt="Vue logo" src="./assets/logo.png" />-->
<!--  <HelloWorld msg="Hello Vue 3.0 + Vite" />-->
<!--  <div class="nav-btn">-->
<!--    <router-link to='/'> Home</router-link>-->
<!--    <router-link to='/contact'>Contact </router-link>-->
<!--  </div>-->
  <router-view></router-view>
<!--  <Layout/>-->
</template>

<script lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import Layout from './components/Layout.vue';

export default {
  name: 'App',
  components: {
    Layout
  },
}
</script>
