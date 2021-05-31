<template>
<div class="login">
  <div class="login-admin">
    <a-form :model="formState" :label-col="{span: 6}" :wrapper-col="{span: 18}">
      <a-form-item label="用户名">
        <a-input v-model:value="formState.username" />
      </a-form-item>
      <a-form-item label="密码">
        <a-input v-model:value="formState.password" />
      </a-form-item>
    </a-form>
    <a-button size="large" type="primary" @click="adminLogin">登录</a-button>
  </div>
</div>
</template>

<script>
import {reactive} from "vue";
import systemInfo from "../api/systemInfo";
import router from "../router";

export default {
  name: "AdminLogin",
  setup() {
    const formState = reactive({
      username: '',
      password: '',
    })
    const adminLogin = async () => {
      const value = {...formState}
      try {
        await systemInfo.adminLogin(value)
        router.push('/toolbox/home').then()
      } catch (e) {
        console.error(e)
      }
    }

    return {
      formState,
      adminLogin,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
.login-admin {
  button {
    width: 80% !important;
    margin-left: 62px;
  }
}
</style>
