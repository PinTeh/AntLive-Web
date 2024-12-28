import axios from 'axios'
// import useStore from '@/store'
import { Modal, message } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';


// 创建axios实例
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    // 请求超时时间：10s
    timeout: 10 * 1000,
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

service.interceptors.request.use((config) => {
    if (!config.headers) {
        throw new Error(
            `Expected 'config' and 'config.headers' not to be undefined`
        );
    }
    // const { user } = useStore();
    // if (user.token) {
    //     // 授权认证
    //     config.headers.Authorization = user.token;
    // }
    return config;
}, (error) => {
    return Promise.reject(error);
}
);

// 响应拦截器
service.interceptors.response.use((response) => {
    const res = response.data;
    const { code, msg } = res;
    if (code === 0) {
        return res;
    } else {
        // token过期
        if (code === 999) {
            Modal.confirm({
                title: '登录提示',
                icon: createVNode(ExclamationCircleOutlined),
                content: '您登录的账号已过期，请重新登录',
                cancelText: '取消',
                okText: '重新登录',
                onOk() {
                    localStorage.clear();
                    window.location.href = '/#/login';
                    location.reload();
                },
                onCancel() { },
            });


        } else {
            // 系统异常
            message.error(msg || 'This is an error message', 5);
        }
        return Promise.reject(new Error(msg || 'Error'));
    }
}, (error) => {
    const { msg } = error.response.data;
    // 未认证
    if (error.response.status === 401) {
        Modal.confirm({
            title: '登录提示',
            icon: createVNode(ExclamationCircleOutlined),
            content: '您登录的账号已过期，请重新登录',
            cancelText: '取消',
            okText: '重新登录',
            onOk() {
                localStorage.clear();
                window.location.href = '/#/login';
                location.reload();
            },
            onCancel() { },
        });
    } else {
        message.error(msg || '网络异常，请稍后再重新尝试。', 5);
        return Promise.reject(new Error(msg || 'Network Error'));
    }
});

// 导出实例
export default service;