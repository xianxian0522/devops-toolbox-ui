<template>
  <a-layout class="layout">
    <a-layout-header>
      <div class="logo" />
      <a-menu
          theme="dark"
          mode="horizontal"
          v-model:selectedKeys="selectedKeys"
          :style="{ lineHeight: '58px' }">
        <a-menu-item key="home">
          <router-link to="home">home</router-link>
        </a-menu-item>
        <a-menu-item key="contact">
          <router-link to="contact">contact</router-link>
        </a-menu-item>
        <a-menu-item key="3">nav 3</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content class="common-content">
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {useRoute} from "vue-router";

export default defineComponent({
  name: 'Layout',
  setup() {
    const url = useRoute().path.split('/');
    return {
      selectedKeys: ref([url[url.length - 1]])
    }
  }
})
</script>

<style scoped lang="less">
.layout {
  width: 100vw;
  height: 100vh;
}
.common-content {
  background: #fff;
}
:global(.ant-layout-header) {
  height: 58px;
}
</style>
