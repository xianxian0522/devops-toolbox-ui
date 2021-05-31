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
import { onMounted } from 'vue'
import systemInfo from "../api/systemInfo";
import {useRoute, useRouter} from "vue-router";

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
      const data = await systemInfo.login();
      if (data && data.url) {
        window.location.href = data.url;
      }
    }
    const adminLogin = () => {
      router.push('/admin-login')
    }

    onMounted(async () => {
    })

    return { login, adminLogin }
  },
}
</script>
<style scoped lang="less">
@import "../components/index.less";
</style>
