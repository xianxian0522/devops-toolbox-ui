<template>
  <div class="login">
    <div class="login-admin">
      <h2>通过 SSO 登录 TOOLBOX</h2>
      <a-button size="large" type="primary" @click="login">登录</a-button>
      <a-button size="large" type="primary" @click="adminLogin">管理员登录</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import systemInfo from "../api/systemInfo";
import {useRoute, useRouter} from "vue-router";
import tokenRepositories from "@/composable/tokenRepositories";

export default {
  name: 'Login',
  props: {
    msg: String
  },
  data() {
    return {
      count: 0
    }
  },
  setup() {
    const router = useRouter()
    const login = async () => {
      try {
        const data = await systemInfo.login();
        if (data && data.url) {
          window.location.href = data.url;
        }
        if (data && data.token) {
          tokenRepositories(data.token)
        }
      } catch (e) {
        console.error(e)
      }
    }
    const adminLogin = () => {
      router.push('/admin-login')
    }

    return { login, adminLogin }
  },
}
</script>
<style scoped lang="less">
@import "../components/index.less";
</style>
