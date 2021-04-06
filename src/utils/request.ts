import axios from 'axios';
import {message} from "ant-design-vue";
import router from "@/router";
import qs from 'qs';

const service = axios.create({
    baseURL: '/',
    timeout: 1000000, // 请求超时时间
})

service.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = 'Bearer' + token; //如果token 存在，就带上token
    } else {
        config.headers['token'] = ''; //return
    }
    return config;
}, error => {
    return Promise.reject(error);
})

service.interceptors.response.use(response => {
    const { code, msg} = response.data;
    if (code === 401) {
        window.location.href = '/login';
        // router.go();
    } else {
        message.error(msg);
    }

    return  response;
}, error => {
    message.error(error);
    return Promise.reject(error);
})

export default {
    get(url: string, params = {}) {
        return new Promise((resolve, reject) => {
            axios.get(url, {params})
                .then(res => resolve(res.data))
                .catch(err => reject(err))
        })
    },
    post: function (url: string, params = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify(params))
                .then(res => resolve(res.data))
                .catch(err => reject(err))
        })
    }
}
