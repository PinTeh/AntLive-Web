import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWebStore = defineStore('web', () => {
    const menuCollapse = ref(false)
    const category = ref({
        currentSelect: ''
    })
    function selectCategory(item) {
        category.value.currentSelect = item
    }
    function setMenuCollapse(val) {
        menuCollapse.value = val
    }
    return {
        menuCollapse,
        category,
        selectCategory,
        setMenuCollapse
    }
}, {
    persist: true,
},)

export default useWebStore