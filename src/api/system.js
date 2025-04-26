import request from '@/utils/request'

export default {
    // 获取菜单
    getMenus() {
        return request({
            url: '/api/v1/system/getMenus',
            method: 'get'
        })
    },
}