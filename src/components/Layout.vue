<template>
  <a-layout class="layout">
    <a-layout-header class="header">
      <div class="logo" >logo</div>
      <div class="layout-header-menu">
        <a-menu
            theme="dark"
            mode="horizontal"
            v-model:selectedKeys="selectedKey"
            :style="{ lineHeight: '58px' }"
        >
          <a-menu-item v-for="bar in menuBar" :key="bar.route">
            <a :href="bar.path">{{ bar.name }}</a>
          </a-menu-item>
<!--          <a-menu-item key="/">-->
<!--            <router-link to="/">运维工具箱</router-link>-->
<!--          </a-menu-item>-->
<!--          <a-menu-item key="3">CI</a-menu-item>-->
<!--          <a-menu-item key="4">CD</a-menu-item>-->
<!--          <a-menu-item key="5">监控中心</a-menu-item>-->
<!--          <a-menu-item key="6">日志中心</a-menu-item>-->
        </a-menu>
        <section>
          <a-avatar class="user-avatar">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
               {{ username }}
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="logout()">退出</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </section>
      </div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu
            class="menu-sider"
            mode="inline"
            v-model:selectedKeys="selectedKeysMenu"
            :style="{ height: '100%', borderRight: 0 }"
        >
<!--          <a-menu-item :key="'home'">-->
<!--            <span>-->
<!--              <user-outlined/>-->
<!--              <router-link to="/toolbox/home">首页</router-link>-->
<!--            </span>-->
<!--          </a-menu-item>-->
<!--          <a-menu-item :key="'history'">-->
<!--            <span>-->
<!--              <history-outlined/>-->
<!--              <router-link to="/toolbox/history">历史记录</router-link>-->
<!--            </span>-->
<!--          </a-menu-item>-->
<!--          <a-menu-item :key="'script'">-->
<!--            <span>-->
<!--              <profile-outlined/>-->
<!--              <router-link to="/toolbox/script">脚本管理</router-link>-->
<!--            </span>-->
<!--          </a-menu-item>-->
<!--          <a-menu-item :key="'task-record'">-->
<!--            <span>-->
<!--              <profile-outlined/>-->
<!--              <router-link to="/toolbox/task-record">日程任务记录</router-link>-->
<!--            </span>-->
<!--          </a-menu-item>-->
<!--          <a-menu-item :key="'task-management'">-->
<!--            <span>-->
<!--              <profile-outlined/>-->
<!--              <router-link to="/toolbox/task-management">日程任务管理</router-link>-->
<!--            </span>-->
<!--          </a-menu-item>-->
          <a-menu-item v-for="item in bar" :key="item.path">
            <span>
              <icon-font :type="item.icon" />
              <router-link :to="'/toolbox/' + item.path">{{ item.name }}</router-link>
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
import {defineComponent, ref, reactive, toRefs, onMounted, watch} from 'vue';
import {onBeforeRouteUpdate, useRoute, useRouter} from 'vue-router';
import {
  UserOutlined,
  NotificationOutlined,
  HistoryOutlined,
  ProfileOutlined,
  DownOutlined,
  createFromIconfontCN,
} from '@ant-design/icons-vue';
import systemInfo from "../api/systemInfo";
import jwt from 'jwt-decode'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2585874_owb5u2js69j.js',
});
export interface BarItem {
  id: number;
  icon?: string;
  path: string;
  name: string;
  route?: string;
}

export default defineComponent({
  name: 'Layout',
  components: {
    UserOutlined,
    NotificationOutlined,
    HistoryOutlined,
    ProfileOutlined,
    DownOutlined,
    IconFont,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const url = route.path.split('/');

    const state = reactive({
      selectedKey: ref(['/toolbox/home']),
      // selectedKeysMenu: ref([url[url.length - 1]]),
      selectedKeysMenu: ref([url[2]]),
      username: '用户名',
    })
    const bar = ref<BarItem[]>([
      // {id: 1, icon: 'icon-home', path: 'home', name: '首页'},
      // {id: 2, icon: 'icon-history', path: 'history', name: '历史记录' },
      // {id: 3, icon: 'icon-script', path: 'script', name: '脚本管理' },
      // {id: 4, icon: 'icon-task-record', path: 'task-record', name: '日程任务记录' },
      // {id: 5, icon: 'icon-task-management', path: 'task-management', name: '日程任务管理' },
      // {id: 6, icon: 'icon-salt-function', path: 'salt-function', name: 'saltFunction'},
      // {id: 7, icon: 'icon-salt-api', path: 'salt-api', name: 'saltApi'},
    ])
    const menuBar = ref<BarItem[]>([])

    // const menuItem = ({item, key, keyPath}: any) => {
    //   state.selectedKeysMenu = keyPath;
    // }

    const getBar = async () => {
      bar.value = await systemInfo.getBar()
    }
    const getMenuBar = async () => {
      menuBar.value = await systemInfo.getMenuBar()
    }
    const logout = () => {
      localStorage.removeItem('token')
      router.push('/login')
    }

    watch(() => route.path, () => {
      const url = route.path.split('/');
      state.selectedKeysMenu = [url[2]];
    })

    onMounted(() => {
      getBar()
      getMenuBar()
      // state.selectedKeysMenu = ['/' + url[url.length-1]];
      // state.selectedKeysMenu = [url[2]];
      const token = localStorage.getItem('token')
      if (token) {
        const userInfo = jwt(token)
        state.username = userInfo?.name || userInfo?.username
      }
    })
    return {
      ...toRefs(state),
      bar,
      menuBar,
      logout,
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
.layout-header-menu {
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  ul, section {
    white-space: nowrap;
  }
  .user-avatar {
    margin-right: 4px;
  }
}
.layout-header-menu /deep/ .ant-menu-dark .ant-menu-item:hover {
  background-color: #1890ff;
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
