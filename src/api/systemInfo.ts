import request from "../utils/request";

const APILogin = '/api/v1/sso/login';
const API = '/devops-toolbox/api/v1';
const APICommands = `${API}/commands`;

const APIBase = '/job-actuator/api/v1';
const APIJob = `${APIBase}/jobs`;
const APITask = `${APIBase}/task`;

const systemInfo: any = {};
systemInfo.login = () => request.get(APILogin).catch(err => console.error(err))

systemInfo.queryPageAll = (urlString: string, params?: any) => request.get(`${APICommands}/${urlString}`, params).catch(err => console.error(err))

systemInfo.execCommandScript = (urlString: string, params?: any) => request.post(`${APICommands}/${urlString}`, params).catch(err => console.error(err))

systemInfo.queryEditById = (id: number) => request.get(`${APICommands}/${id}`).catch(err => console.error(err))

systemInfo.queryAllTasks = () => request.get(`${APITask}/getTasks`).catch(err => console.error(err))
systemInfo.queryPageTasks = (page: number, size: number) => request.get(`${APITask}/getTasksPage`, {page, size}).catch(err => console.error(err))
systemInfo.updateTask = (params?: any) => request.post(`${APITask}/updateTask`, params).catch(err => console.error(err))
systemInfo.addTask = (params?: any) => request.post(`${APITask}/setTask`, params).catch(err => console.error(err))

export default systemInfo
