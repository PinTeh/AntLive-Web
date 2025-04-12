import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWebStore = defineStore('web', () => {
    const category = ref({
        currentSelect: ''
    })
    function selectCategory(item) {
        console.log(item, 'web store');
        category.value.currentSelect = item
    }
    return {
        category,
        selectCategory
    }
}, {
    persist: true,
},)

export default useWebStore