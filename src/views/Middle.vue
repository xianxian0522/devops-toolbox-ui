<template>
<div></div>
</template>

<script lang="ts">
import router from "../router";
import systemInfo from "../api/systemInfo";

export default {
  name: "Middle",
  setup() {
    const token = localStorage.getItem('token');

    const login = async () => {
      try {
        const data = await systemInfo.login();
        if (data && data?.token) {
          await localStorage.setItem('token', data.token);
          await router.push('/toolbox/home');
        } else {
          router.push('/login').then();
        }
      } catch (e) {
        console.error(e)
      }
    }
    if (token === 'undefined' || !token) {
      login()
    } else {
      router.push('/toolbox/home');
    }

    return {
      login,
    }
  }
}
</script>

<style scoped lang="less">

</style>
