import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import routers from '@/router'

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(routers)
app.mount('#app')
