import request from '@/utils/request'

export default {
    list(params) {
        return request({
            url: '/api/v1/category/query',
            method: 'get',
            params
        })
    }
} 