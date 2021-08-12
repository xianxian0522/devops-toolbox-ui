<template>
<div></div>
</template>

<script lang="ts">
import router from "../router";
import systemInfo from "../api/systemInfo";
import tokenRepositories from "@/composable/tokenRepositories";

export default {
  name: "Middle",
  setup() {
    const token = localStorage.getItem('token');

    const login = async () => {
      try {
        const data = await systemInfo.login();
        if (data && data?.token) {
          tokenRepositories(data.token)
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
