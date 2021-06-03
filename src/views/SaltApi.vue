<template>
  <div class="app-common-content" >
    <a-spin :spinning="isLoading" tip="Loading..." size="large">
      <a-breadcrumb separator=">" class="app-common-header">
        <a-breadcrumb-item>devops</a-breadcrumb-item>
        <a-breadcrumb-item>toolbox</a-breadcrumb-item>
        <a-breadcrumb-item>Salt Api</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="salt-api">
        <span>所有Salt Master 基础信息</span>
        <a-button type="primary" @click="getAllMasters">查询</a-button>
      </div>
      <div class="salt-api">
        <div class="salt-api-select">
          <span>Salt Master 信息</span>
          <a-form :model="saltMaster" layout="inline">
            <a-form-item label="MasterID">
              <a-input v-model:value="saltMaster.masterId" size="small" style="width: 200px;" placeholder="input MasterID"></a-input>
            </a-form-item>
          </a-form>
        </div>
        <a-button type="primary" @click="getSaltMaster">查询</a-button>
      </div>
      <div class="salt-api">
        <div class="salt-api-select">
          <span>Master的所有Minion 信息</span>
          <a-form :model="masterMinion" layout="inline">
            <a-form-item label="MasterID">
              <a-input v-model:value="masterMinion.masterId" size="small" style="width: 200px;" placeholder="input MasterID"></a-input>
            </a-form-item>
          </a-form>
        </div>
        <a-button type="primary" @click="getMasterMinion">查询</a-button>
      </div>
      <div class="salt-api">
        <div class="salt-api-select">
          <span>选中Salt Minion信息</span>
          <a-form :model="selectMinion" layout="inline">
            <a-form-item label="MasterID">
              <a-input v-model:value="selectMinion.masterId" size="small" style="width: 200px;" placeholder="input MasterID"></a-input>
            </a-form-item>
            <a-form-item label="MinionID">
              <a-input v-model:value="selectMinion.minionId" size="small" style="width: 200px;" placeholder="input MinionID"></a-input>
            </a-form-item>
          </a-form>
        </div>
        <a-button type="primary" @click="getSelectMinion">查询</a-button>
      </div>
      <div class="salt-api">
        <div class="salt-api-select">
          <span>选中Job信息</span>
          <a-form :model="selectJob" layout="inline">
            <a-form-item label="MasterID">
              <a-input v-model:value="selectJob.masterId" size="small" style="width: 200px;" placeholder="input MasterID"></a-input>
            </a-form-item>
            <a-form-item label="jobID">
              <a-input v-model:value="selectJob.jobId" size="small" style="width: 200px;" placeholder="input jobID"></a-input>
            </a-form-item>
          </a-form>
        </div>
        <a-button type="primary" @click="getSelectJobs">查询</a-button>
      </div>
      <div style="margin-top: 10px; text-align: left">
        <pre v-html="JSON.stringify(dataOut, null, 4)"></pre>
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts">
import {reactive, ref, toRefs} from "vue";
import systemInfo from "../api/systemInfo";

export default {
  name: "SaltApi",
  setup() {
    const saltMaster = reactive({
      masterId: '',
    })
    const masterMinion = reactive({
      masterId: '',
    })
    const selectMinion = reactive({
      masterId: '',
      minionId: '',
    })
    const selectJob = reactive({
      masterId: '',
      jobId: '',
    })
    const dataOut = ref()
    const isLoading = ref(false)

    const getAllMasters = async () => {
      isLoading.value = true
      try {
        dataOut.value = await systemInfo.getAllMasters()
        isLoading.value = false
      } catch (e) {
        console.error(e)
        isLoading.value = false
      }
    }
    const getSaltMaster = async () => {
      isLoading.value = true
      const value = {...saltMaster}
      try {
        dataOut.value = await systemInfo.getSaltMaster(value.masterId)
        isLoading.value = false
      } catch (e) {
        console.error(e)
        isLoading.value = false
      }
    }
    const getMasterMinion = async () => {
      isLoading.value = true
      const value = {...masterMinion}
      try {
        dataOut.value = await systemInfo.getMasterMinion(value.masterId)
        isLoading.value = false
      } catch (e) {
        console.error(e)
        isLoading.value = false
      }
    }
    const getSelectMinion = async () => {
      isLoading.value = true
      const value = {...selectMinion}
      try {
        dataOut.value = await systemInfo.getSelectMinion(value)
        isLoading.value = false
      } catch (e) {
        console.error(e)
        isLoading.value = false
      }
    }
    const getSelectJobs = async () => {
      isLoading.value = true
      const value = {...selectJob}
      try {
        dataOut.value = await systemInfo.getSelectJobs(value)
        isLoading.value = false
      } catch (e) {
        console.error(e)
        isLoading.value = false
      }
    }

    return {
      isLoading,
      dataOut,
      selectJob,
      selectMinion,
      masterMinion,
      saltMaster,
      getAllMasters,
      getSaltMaster,
      getMasterMinion,
      getSelectMinion,
      getSelectJobs,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
.salt-api {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  .salt-api-select {
    display: flex;
    align-items: center;
    span {
      display: inline-block;
      width: 180px;
      text-align: left;
    }
    input:not(:last-of-type) {
      margin-right: 10px;
    }
  }
}
</style>
