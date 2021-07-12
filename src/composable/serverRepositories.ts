import {onMounted, ref} from "vue";
import {TreeDataItem} from "@/utils/response";
import systemInfo from "@/api/systemInfo";


export default function serverRepositories() {
  const treeData = ref<TreeDataItem[]>([])

  const getServers = async () => {
    try {
      const data = await systemInfo.queryCommandServers()
      if (data && data.Biz) {
        data.Biz.map((biz: any, index: number) => {
          // console.log(treeData, biz);
          treeData.value.push({
            value: biz.Name,
            title: biz.Name,
            key: biz.Name,
            disabled: true,
            children: [],
          });
          if ((biz.Apps && biz.Apps.length > 0) || (biz.Hosts && biz.Hosts.length > 0)) {
            (treeData.value[index].children as TreeDataItem[]).push({
              value: '主机-' + index + '-' + biz.Name,
              title: '主机',
              key: '主机-' + index + '-' + biz.Name,
              disabled: true,
              children: (biz.Hosts.map((h: any) => ({
                value: h.Name + '-' + h.Id,
                title: h.Ip,
                key: h.Name + '-' + h.Id,
                disabled: false,
              }))),
            })
            if (biz.Apps[0].Hosts && biz.Apps[0].Hosts.length > 0) {
              (treeData.value[index].children as TreeDataItem[]).push({
                value: '应用-' + index + '-' + biz.Name,
                title: '应用',
                key: '应用-' + index + '-' + biz.Name,
                disabled: true,
                children: (biz.Apps.map((a: any) => ({
                  value: a.Name,
                  title: a.Name,
                  key: a.Name,
                  disabled: true,
                  children: (a.Hosts.map((h: any) => ({
                    value: a.Name + '-' + h.HostName + h.InstanceName + '-' + h.Id,
                    title: (Object.keys(h).filter(id => id !== 'Id').map(key => `${key}:${h[key]}`).join(',')),
                    key: a.Name + '-' + h.HostName + h.InstanceName + '-' + h.Id,
                    disabled: false,
                  })))
                }))),
              })
            } else {
              (treeData.value[index].children as TreeDataItem[]).push({
                value: '应用-' + index + '-' + biz.Name,
                title: '应用',
                key: '应用-' + index + '-' + biz.Name,
                disabled: true,
                children: (biz.Apps.map((a: any) => ({
                  value: a.Name,
                  title: a.Name,
                  key: a.Name,
                  disabled: true,
                }))),
              });
            }
          }
        });
      }
    } catch (e) {
      console.error(e)
    }
  }

  onMounted(getServers)

  return {
    treeData,
  }
}
