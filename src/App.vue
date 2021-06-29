<template>
<!--  <img alt="Vue logo" src="./assets/logo.png" />-->
<!--  <HelloWorld msg="Hello Vue 3.0 + Vite" />-->
<!--  <div class="nav-btn">-->
<!--    <router-link to='/'> Home</router-link>-->
<!--    <router-link to='/contact'>Contact </router-link>-->
<!--  </div>-->
  <a-config-provider :locale="zhCN">
    <router-view></router-view>
  </a-config-provider>
</template>

<script lang="ts">
import HelloWorld from './views/Login.vue'
import Layout from './components/Layout.vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

export default {
  name: 'App',
  components: {
    Layout
  },
  setup() {
    return {
      zhCN,
    }
  }
}
</script>
