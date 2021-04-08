import axios from 'axios';
import {message} from "ant-design-vue";
import router from "../router";

const service = axios.create({
    baseURL: '/',
    timeout: 1000000, // 请求超时时间
})
service.defaults.headers.post['Content-Type'] = 'application/json';

service.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    // console.log(token, 'token', config);
    if (token) {
        config.headers.Authorization = 'Bearer ' + token; //如果token 存在，就带上token
    } else {
        config.headers['token'] = ''; //return
    }
    return config;
}, error => {
    return Promise.reject(error);
})

service.interceptors.response.use(response => {
    const { status, statusText} = response;
    // if (status === 200) {
    //     return response;
    // } else if (status === 401) {
    //     localStorage.removeItem('token');
    //     // window.location.href = '/login';
    //     router.push('/login').then();
    // } else {
    //     message.error(statusText);
    //     return Promise.reject(response);
    // }

    return response;
}, error => {
    if(error.response.status=='401'){    //如果token 过期 则跳转到登录页面
        localStorage.removeItem('token');
        router.push('/login').then();
    }
    message.error(error.message);
    return Promise.reject(error);
})

export default {
    get(url: string, params = {}) {
        return new Promise((resolve, reject) => {
            service.get(url, {params})
                .then(res => resolve(res.data))
                .catch(err => reject(err))
        })
    },
    post: function (url: string, params = {}) {
        return new Promise((resolve, reject) => {
            service.post(url, params)
                .then(res => resolve(res.data))
                .catch(err => reject(err))
        })
    }
}
