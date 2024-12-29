import { defineStore } from 'pinia'
import { reactive, ref, resolveDirective } from 'vue'
import userApi from '@/api/user'

export const useUserStore = defineStore('user', () => {
    const user = reactive({
        token: 'xxxxx'
    })

    let isLogin = ref(false)
    let userInfo = ref({})
    let userToken = ref("")

    // 登录
    const login = async (loginParam) => {
        console.log(loginParam)
        if (isLogin.value) {
            return;
        }
        const res = await userApi.login({
            username: loginParam.username.trim(),
            password: loginParam.password.trim()
        })

        const { code, data } = res
        console.log(res.data, 'res.data');
        console.log(res, 'res');
        console.log(data, 'data');


        if (code === 0) {
            userInfo.value = data.user
            userToken.value = data.token
        }

    }

    // 登出
    const logout = () => {

    }
    return {
        user,
        userInfo,
        userToken,
        login,
        logout
    }
})

export default useUserStore