import { defineStore } from 'pinia'
import { ref } from 'vue'
import userApi from '@/api/user'

export const useUserStore = defineStore('user', () => {
    let isLogin = ref(false)
    let userInfo = ref({})
    let userToken = ref("")

    // 登录
    const login = async (loginParam) => {
        if (isLogin.value) {
            return;
        }
        const res = await userApi.login({
            username: loginParam.username.trim(),
            password: loginParam.password.trim()
        })
        const { code, data } = res
        if (code === 0) {
            userInfo.value = data.user
            userToken.value = data.token
            isLogin.value = true
        }
    }
    // 登出
    function logout() {
        this.$reset();
        window.localStorage.clear();
        window.sessionStorage.clear();
        location.reload();
    }
    return {
        userInfo,
        userToken,
        isLogin,
        login,
        logout
    }
}, {
    persist: true,
},)

export default useUserStore