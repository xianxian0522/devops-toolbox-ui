import request from "@/utils/request";

const systemInfo: any = {};
systemInfo.login = function (data: any) {
    return request({
        url: '/api/v1/login',
        data,
        method: 'post'
    })
}

export default systemInfo
