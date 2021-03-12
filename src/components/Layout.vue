<template>
<!--  <a-layout class="layout">-->
<!--    <a-layout-header>-->
<!--      <div class="logo">logo</div>-->
<!--      <a-menu-->
<!--          theme="dark"-->
<!--          mode="horizontal"-->
<!--          v-model:selectedKeys="selectedKeys"-->
<!--          :style="{ lineHeight: '58px' }">-->
<!--        <a-menu-item key="home">-->
<!--          <router-link to="home">home</router-link>-->
<!--        </a-menu-item>-->
<!--        <a-menu-item key="contact">-->
<!--          <router-link to="contact">contact</router-link>-->
<!--        </a-menu-item>-->
<!--        <a-menu-item key="3">nav 3</a-menu-item>-->
<!--      </a-menu>-->
<!--    </a-layout-header>-->
<!--    <a-layout-content class="common-content">-->
<!--      <router-view></router-view>-->
<!--    </a-layout-content>-->
<!--  </a-layout>-->
  <a-layout class="layout">
    <a-layout-header class="header">
      <div class="logo" >logo</div>
      <a-menu
          theme="dark"
          mode="horizontal"
          v-model:selectedKeys="selectedKeys"
          :style="{ lineHeight: '58px' }"
      >
        <a-menu-item key="home">
          <router-link to="home">home</router-link>
        </a-menu-item>
        <a-menu-item key="contact">
          <router-link to="contact">contact</router-link>
        </a-menu-item>
        <a-menu-item key="3">nav 3</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu
            mode="inline"
            v-model:selectedKeys="selectedKeys2"
            v-model:openKeys="openKeys"
            :style="{ height: '100%', borderRight: 0 }"
        >
          <a-menu-item key="sub0">
            <span>
              <user-outlined/>
              subnav 0
            </span>
          </a-menu-item>
          <a-sub-menu key="sub1">
            <template #title>
              <span>
                <user-outlined />
                subnav 1
              </span>
            </template>
            <a-menu-item key="1">option1</a-menu-item>
            <a-menu-item key="2">option2</a-menu-item>
            <a-menu-item key="3">option3</a-menu-item>
            <a-menu-item key="4">option4</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <template #title>
              <span>
                <laptop-outlined />
                subnav 2
              </span>
            </template>
            <a-menu-item key="5">option5</a-menu-item>
            <a-menu-item key="6">option6</a-menu-item>
            <a-menu-item key="7">option7</a-menu-item>
            <a-menu-item key="8">option8</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub3">
            <template #title>
              <span>
                <notification-outlined />
                subnav 3
              </span>
            </template>
            <a-menu-item key="9">option9</a-menu-item>
            <a-menu-item key="10">option10</a-menu-item>
            <a-menu-item key="11">option11</a-menu-item>
            <a-menu-item key="12">option12</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout-content class="common-content">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {useRoute} from "vue-router";
import {UserOutlined, LaptopOutlined, NotificationOutlined} from '@ant-design/icons-vue';

export default defineComponent({
  name: 'Layout',
  components: {
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
  },
  setup() {
    const url = useRoute().path.split('/');
    return {
      selectedKeys: ref([url[url.length - 1]]),
      selectedKeys2: ref(['1']),
      openKeys: ref<string[]>(['sub1']),
    }
  }
})
</script>

<style scoped lang="less">
.layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
// 侧边栏滚动
.ant-layout-sider {
  overflow: auto;
}

.logo {
  width: 120px;
  height: 58px;
  float: left;
  color: #fff;
  margin-right: 30px;
}
.common-content {
  background: #fff;
  border-left: 1px solid #DCDEE5;
}
.layout ::v-deep .ant-layout-header {
  height: 58px;
  display: flex;
}
</style>
