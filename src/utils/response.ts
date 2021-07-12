export interface LoginResponse {
  url?: string;
  token?: string;
}
export interface BarItem {
  id: number;
  icon?: string;
  path: string;
  name: string;
  route?: string;
  children?: BarItem[];
}
export interface TreeDataItem {
  value: string;
  key: string;
  title?: string;
  disabled?: boolean;
  children?: TreeDataItem[];
}
export interface Exec {
  id: number;
}
export interface HomeTooltip {
  command: string;
  comment: string;
}
export interface ServersUser {
  content: string[];
}
export interface Servers {
  Biz?: Biz[];
}
export interface Biz {
  Apps?: AppResponse[];
  Hosts?: Host[];
  Name?: string;
}
export interface AppResponse {
  Hosts?: Host[];
  Name?: string;
}
export interface Host {
  ClusterName?: string;
  Env?: string;
  HostName?: string;
  Id?: number;
  IdcName?: string;
  InstanceName?: string;
  InstanceState?: string;
  Ip?: string;
  LogicName?: string;
  Name?: string;
}
export interface CurrentOut {
  out?: OutResponse[];
}
export interface OutResponse {
  id?: number;
  ip?: string;
  pid?: number;
  retcode?: number
  stderr?: string;
  stdout?: string;
}
