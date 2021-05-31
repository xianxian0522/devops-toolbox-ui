import request from "../utils/request";

const APILogin = '/api/v1/sso/login';
const APIAdmin = '/devops-toolbox/api/v1/auth/check';
const API = '/devops-toolbox/api/v1';
const APICommands = `${API}/commands`;

const APIBase = '/job-actuator/api/v1';
const APIJob = `${APIBase}/jobs`;
const APITask = `${APIBase}/task`;

const APIBar = `${API}/commands/getBar`

const systemInfo: any = {};
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

export default systemInfo
