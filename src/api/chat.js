import request from '@/utils/request'

export default {
    sendChatMsg(data) {
        return request({
            url: '/api/v1/chat/sendMsg',
            method: 'post',
            data,
        })
    },
}