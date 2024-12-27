import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useWebStore = defineStore('web', () => {
    const user = reactive({
        nickName: 'x222x'
    })
    return {
        user
    }
})

export default useWebStore