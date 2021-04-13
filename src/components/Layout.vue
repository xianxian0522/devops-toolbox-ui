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
          v-model:selectedKeys="selectedKey"
          :style="{ lineHeight: '58px' }"
      >
        <a-menu-item>
          <a href="http://127.0.0.1:4200">业务拓扑</a>
        </a-menu-item>
        <a-menu-item key="/">
          <router-link to="/">运维工具箱</router-link>
        </a-menu-item>
        <a-menu-item key="3">CI</a-menu-item>
        <a-menu-item key="4">CD</a-menu-item>
        <a-menu-item key="5">监控中心</a-menu-item>
        <a-menu-item key="6">日志中心</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu
            class="menu-sider"
            mode="inline"
            @click="menuItem"
            v-model:selectedKeys="selectedKeysMenu"
            :style="{ height: '100%', borderRight: 0 }"
        >
          <a-menu-item :key="'/home'">
            <span>
              <user-outlined/>
              <router-link to="home">首页</router-link>
            </span>
          </a-menu-item>
          <a-menu-item :key="'/history'">
            <span>
              <history-outlined/>
              <router-link to="history">历史记录</router-link>
            </span>
          </a-menu-item>
          <a-menu-item :key="'/script'">
            <span>
              <profile-outlined/>
              <router-link to="script">脚本管理</router-link>
            </span>
          </a-menu-item>
<!--          <a-sub-menu key="sub1">-->
<!--            <template #title>-->
<!--              <span>-->
<!--                <user-outlined />-->
<!--                subnav 1-->
<!--              </span>-->
<!--            </template>-->
<!--            <a-menu-item key="1">option1</a-menu-item>-->
<!--            <a-menu-item key="2">option2</a-menu-item>-->
<!--            <a-menu-item key="3">option3</a-menu-item>-->
<!--            <a-menu-item key="4">option4</a-menu-item>-->
<!--          </a-sub-menu>-->
        </a-menu>
      </a-layout-sider>
      <a-layout-content class="common-content">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import {defineComponent, ref, reactive, toRefs, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import {UserOutlined, NotificationOutlined, HistoryOutlined, ProfileOutlined} from '@ant-design/icons-vue';

export default defineComponent({
  name: 'Layout',
  components: {
    UserOutlined,
    NotificationOutlined,
    HistoryOutlined,
    ProfileOutlined
  },
  setup() {
    const url = useRoute().path.split('/');
    console.log(url, url.length - 1)

    const state = reactive({
      selectedKey: ref(['/']),
      selectedKeysMenu: ref([url[url.length - 1]]),
    })

    const menuItem = ({item, key, keyPath}: any) => {
      state.selectedKeysMenu = keyPath;
    }

    onMounted(async () => {
      state.selectedKeysMenu = ['/' + url[url.length-1]];
    })
    return {
      ...toRefs(state),
      menuItem
    }
  }
})
</script>

<style scoped lang="less">
.layout {
  width: 100vw;
  height: inherit;
  //height: 100vh;
  //overflow: hidden;
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
  text-align: left;
  font-weight: 500;
}
.common-content {
  background: #fff;
  border-left: 1px solid #DCDEE5;
}
.layout /deep/ .ant-layout-header {
  height: 58px;
  display: flex;
}
.menu-sider {
  li {
    text-align: left;
  }
  a::before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: transparent;
    content: '';
  }
  a {
    color: rgba(0, 0, 0, 0.85);
  }
  .ant-menu-item-selected a, a:hover {
    color: #1890ff;
  }
}
</style>
