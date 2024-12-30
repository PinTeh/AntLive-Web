import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import routers from '@/router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// import '@/styles/index.scss'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
// 组合式api中无法使用$reset
pinia.use(({ store }) => {
    const initialState = JSON.parse(JSON.stringify(store.$state));
    store.$reset = () => {
        store.$patch(initialState);
    };
});

const app = createApp(App)
app.use(pinia)
app.use(routers)
app.mount('#app')
