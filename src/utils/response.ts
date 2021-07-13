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
export interface HistoryResponse {
  commands: Command[];
  page: string;
  size: string;
  total: number;
}
export interface Command {
  command: string;
  comment: string;
  cwd: string;
  description: string;
  done: boolean;
  executor: string;
  fileName: string;
  id: number;
  serverUser: string;
  startTime: string;
  updateTime: string;
}
export interface ScriptManager {
  list: ScriptResponse[];
  total: number;
}
export interface ScriptResponse {
  comment: string;
  filename: string;
  id: number;
  updateTime: string;
  script: string;
}
export interface CommandDetail {
  command: string;
  out: OutResponse[];
  serverInfo: ServerInfo[];
}
export interface ServerInfo {
  Id: number;
  Name: string;
  Ip: string;
}
export interface SearchForm {
  done: boolean
  endtime: string | number;
  fileName: string;
  serverUser: string;
  starttime: string | number;
}
