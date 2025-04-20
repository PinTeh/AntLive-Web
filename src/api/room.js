import request from '@/utils/request'

export default {
    /**
     * 获取房间信息
     * @param {*} params 
     * @returns 
     */
    getRoomInfo(params) {
        return request({
            url: '/api/v1/room/detail',
            method: 'get',
            params,
        })
    },
}