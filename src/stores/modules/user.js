import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useUserStore = defineStore('user', () => {
    const user = reactive({
        token: 'xxxxx'
    })
    return {
        user
    }
})

export default useUserStore