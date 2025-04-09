import request from '@/utils/request'

export default {
    getGiftList() {
        return request({
            url: '/api/v1/present/list',
            method: 'get',
        })
    },
    rewardGift(data) {
        return request({
            url: '/api/v1/present/reward',
            method: 'post',
            data
        })
    },
}