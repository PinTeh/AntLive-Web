import request from '@/utils/request'

export default {
    // 分页获取用户列表
    getPageUsers(params) {
        return request({
            url: '/api/v1/system/user/page',
            method: 'get',
            params
        })
    },
}