import request from '@/utils/request'

export default {
    /**
     *  获取直播分类
     * @param {*} params 
     * @returns 
     */
    list(params) {
        return request({
            url: '/api/v1/category/query',
            method: 'get',
            params
        })
    },
    /**
     * 获取历史记录
     * @param {*} params 
     * @returns 
     */
    listHistory(params) {
        return request({
            url: '/api/v1/watch/list',
            method: 'get',
            params
        })
    },
    /**
     * 清除历史记录
     * @returns 
     */
    clearHistory() {
        return request({
            url: '/api/v1/watch/history/clear',
            method: 'post'
        })
    }
} 