import axios from 'axios'
import useStore from '@/store'


// 创建axios实例
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    // 请求超时时间：50s
    timeout: 50000,
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

service.interceptors.request.use((config) => {
    if (!config.headers) {
        throw new Error(
            `Expected 'config' and 'config.headers' not to be undefined`
        );
    }
    const { user } = useStore();
    if (user.token) {
        // 授权认证
        config.headers.Authorization = user.token;
    }
    return config;
},
    (error) => {
        return Promise.reject(error);
    }
);
