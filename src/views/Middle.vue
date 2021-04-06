<template>

</template>

<script lang="ts">
import router from "../router";
import systemInfo from "../api/systemInfo";

export default {
  name: "Middle",
  setup() {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/toolbox/home');
    } else {
      const token = systemInfo.login;
      localStorage.setItem('token', token.token);
      router.push('/toolbox/home');
    }
  }
}
</script>

<style scoped lang="less">

</style>
