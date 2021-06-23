import request from "../utils/request";

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

const systemInfo: any = {};
systemInfo.getMenuBar = () => request.get(ApiMenu)

systemInfo.login = () => request.get(APILogin).catch(err => console.error(err))
systemInfo.adminLogin = (params?: any) => request.post(APIAdmin, params)

systemInfo.getBar = () => request.get(APIBar).catch(err => console.error(err))

systemInfo.queryPageAll = (urlString: string, params?: any) => request.get(`${APICommands}/${urlString}`, params).catch(err => console.error(err))

systemInfo.execCommandScript = (urlString: string, params?: any) => request.post(`${APICommands}/${urlString}`, params).catch(err => console.error(err))

systemInfo.queryEditById = (id: number) => request.get(`${APICommands}/${id}`).catch(err => console.error(err))

systemInfo.queryAllTasks = () => request.get(`${APITask}/getTasks`)
systemInfo.queryPageTasks = (params: any) => request.get(`${APITask}/getTasksPage`, params)
systemInfo.updateTask = (params?: any) => request.post(`${APITask}/updateTask`, params)
systemInfo.addTask = (params?: any) => request.post(`${APITask}/setTask`, params)
systemInfo.queryServers = () => request.get(`${APITask}/getServers`)

systemInfo.doCustomComplete = (params?: any) => request.post(`${APIJob}/DoCustomComplete`, params)
systemInfo.getAllMasters = () => request.get(`${APIJob}/getAllMasters`)
systemInfo.getSaltMaster = (masterId?: number) => request.get(`${APIJob}/${masterId}`)
systemInfo.getMasterMinion = (masterId?: number) => request.get(`${APIJob}/minion/${masterId}`)
systemInfo.getSelectMinion = (params?: any) => request.get(`${APIJob}/minion`, params)
systemInfo.getSelectJobs = (params?: any) => request.get(`${APIJob}/jobs`, params)

export default systemInfo
