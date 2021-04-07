import request from "../utils/request";

const APILogin = '/api/v1/sso/login';
const API = '/devops-toolbox/api/v1';

const systemInfo: any = {};
systemInfo.login = () => request.get(APILogin)

systemInfo.queryPageAll = (urlString: string, params?: any) => request.get(`${API}/commands/${urlString}`, params)

export default systemInfo
