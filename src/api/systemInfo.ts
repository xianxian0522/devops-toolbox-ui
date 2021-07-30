import request from "../utils/request";
import {
  BarItem, CommandDetail,
  CurrentOut,
  Exec,
  HistoryResponse,
  HomeTooltip,
  LoginResponse, OutResponse, ScriptManager, ScriptResponse, ServerInfo,
  Servers,
  ServersUser, TaskResponse, Tasks
} from "@/utils/response";

const APILogin = '/api/v1/sso/login';
const APIAdmin = '/devops-toolbox/api/v1/auth/check';
const API = '/devops-toolbox/api/v1';
const APICommands = `${API}/commands`;

const APIBase = '/job-actuator/api/v1';
const APIJob = `${APIBase}/jobs`;
const APITask = `${APIBase}/task`;

const APIBar = `${API}/commands/getBar`
let ApiMenu = '/api/my/bar'
if (window.location.hostname.endsWith('dev.ops.sumscope.com')) {
    ApiMenu = 'http://menu.dev.ops.sumscope.com:3000' + ApiMenu;
} else if (window.location.hostname.endsWith('ops.sumscope.com')) {
    ApiMenu = 'http://menu.ops.sumscope.com' + ApiMenu;
}

export default {
  getMenuBar: () => request.get<BarItem[]>(ApiMenu),
  login: () => request.get<LoginResponse>(APILogin),
  adminLogin: (params?: any) => request.post<string>(APIAdmin, params),
  getBar: () => request.get<BarItem[]>(APIBar),

  queryCurrentOutById: (outId: number) => request.get<CurrentOut>(`${APICommands}/getCurrentOut`, {outId: outId}),
  queryCommandServers: () => request.get<Servers>(`${APICommands}/getServers`),
  queryServersUser: () => request.get<ServersUser>(`${APICommands}/getServerUser`),
  queryHomeEditById: (id: number) => request.get<HomeTooltip>(`${APICommands}/${id}`),
  queryCommandHistory: (params: any) => request.get<HistoryResponse>(`${APICommands}/getCommandHistories`, params),
  queryCommandDetail: (cId: number) => request.get<CommandDetail>(`${APICommands}/getDetail`, {queryId: cId}),
  queryScriptManager: (params: any) => request.get<ScriptManager>(`${APICommands}/getManagerList`, params),
  queryScriptDetail: (sId: number) => request.get<ScriptResponse>(`${APICommands}/getScriptDetail`, {id: sId}),
  queryScriptList: () => request.get<ScriptManager>(`${APICommands}/getScriptList`),
  execCommand: (params: any) => request.post<Exec>(`${APICommands}/execCommand`, params),
  execScript: (params: any) => request.post<Exec>(`${APICommands}/execScript`, params),
  updateScript: (params: any) => request.post(`${APICommands}/updateScript`, params),
  addScript: (params: any) => request.post(`${APICommands}/saveScript`, params),

  queryPageTasks: (params: any) => request.get<Tasks>(`${APITask}/getTasksPage`, params),
  queryServers: () => request.get<ServerInfo[]>(`${APITask}/getServers`),
  queryTaskById: (id: number) => request.get<TaskResponse>(`${APITask}/${id}`),
  queryAllTasks: () => request.get(`${APITask}/getTasks`),
  updateTask: (params?: any) => request.post(`${APITask}/updateTask`, params),
  addTask: (params?: any) => request.post(`${APITask}/setTask`, params),

  doCustomComplete: (params?: any) => request.post<OutResponse[]>(`${APIJob}/DoCustomComplete`, params),
  getAllMasters: () => request.get(`${APIJob}/getAllMasters`),
  getSaltMaster: (masterId?: number) => request.get(`${APIJob}/${masterId}`),
  getMasterMinion: (masterId?: number) => request.get(`${APIJob}/minion/${masterId}`),
  getSelectMinion: (params?: any) => request.get(`${APIJob}/minion`, params),
  getSelectJobs: (params?: any) => request.get(`${APIJob}/jobs`, params),

}







