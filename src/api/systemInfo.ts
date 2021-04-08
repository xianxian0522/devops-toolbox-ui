import request from "../utils/request";

const APILogin = '/api/v1/sso/login';
const API = '/devops-toolbox/api/v1';

const systemInfo: any = {};
systemInfo.login = () => request.get(APILogin)

systemInfo.queryPageAll = (urlString: string, params?: any) => request.get(`${API}/commands/${urlString}`, params).catch(err => console.error(err))

systemInfo.execCommandScript = (urlString: string, params?: any) => request.post(`${API}/commands/${urlString}`, params).catch(err => console.error(err))

systemInfo.queryEditById = (id: number) => request.get(`${API}/commands/${id}`).catch(err => console.error(err))

export default systemInfo
