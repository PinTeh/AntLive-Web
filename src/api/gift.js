import request from '@/utils/request'

export default {
    getGiftList() {
        return request({
            url: '/api/v1/present/list',
            method: 'get',
        })
    },
}