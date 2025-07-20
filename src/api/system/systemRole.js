import request from '@/utils/request'

export default {
    listMenusByRole(params) {
        return request({
            url: '/api/v1/system/role/listMenusByRole',
            method: 'get',
            params,
        })
    },
    listMenus(params) {
        return request({
            url: '/api/v1/system/role/listMenus',
            method: 'get',
            params,
        })
    },
}