<template>
  <div class="login">
    <div class="login-admin">
      <h2>通过 SSO 登录 TOOLBOX</h2>
      <a-button size="large" type="primary" @click="login">登录</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted } from 'vue'
import systemInfo from "../api/systemInfo";

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
    const login = async () => {
      const data = await systemInfo.login();
      window.location.href = data.url;
    }
    onMounted(async () => {
    })

    return { login }
  },
  methods: {
    // login() {
    //   const url = systemInfo.login();
    //   console.log(url);
    // }
  }
}
</script>
<style scoped lang="less">
.login {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-admin {
    width: 370px;
    padding: 20px 40px;
    text-align: center;
    button {
      width: 100%;
      margin-top: 30px;
      border-radius: 4px;
    }
    h2 {
      font-weight: 600;
    }
  }
}

</style>
