import { createWebHashHistory, createRouter } from 'vue-router'

import HomeView from '@/pages/home.vue'
import LoginView from '@/pages/login.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginView },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router