import { createWebHashHistory, createRouter } from 'vue-router'

import HomeView from '@/views/home.vue'
import LoginView from '@/views/login.vue'
import CenterView from '@/views/center/index.vue'
import CenterSecurityView from '@/views/center/security/index.vue'
import CenterProfileView from '@/views/center/profile/index.vue'
import CenterWalletView from '@/views/center/wallet/index.vue' // 修改导入路径
import CenterPunishmentView from '@/views/center/punishment/index.vue'
import CenterOverviewView from '@/views/center/overview/index.vue'
import CenterLiveSettingsView from '@/views/center/live-settings/index.vue'
import CenterLiveInfoView from '@/views/center/live-info/index.vue'
import CenterLiveBossView from '@/views/center/live-boss/index.vue'
import CenterIdentifyView from '@/views/center/identify/index.vue'
import CenterHistoryView from '@/views/center/view-history/index.vue'
import CenterGiftListView from '@/views/center/gift-list/index.vue'
import CenterFollowView from '@/views/center/follow/index.vue'
import CenterCommentView from '@/views/center/comment/index.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginView },
    {
        path: '/center', component: CenterView,
        children: [
            {
                path: '',
                component: CenterSecurityView
            },
            {
                path: 'security',
                component: CenterSecurityView
            },
            {
                path: 'profile',
                component: CenterProfileView
            },
            {
                path: 'wallet',
                component: CenterWalletView
            },
            {
                path: 'punishment',
                component: CenterPunishmentView
            },
            {
                path: 'overview',
                component: CenterOverviewView
            },
            {
                path: 'live-settings',
                component: CenterLiveSettingsView
            },
            {
                path: 'live-info',
                component: CenterLiveInfoView
            },
            {
                path: 'live-boss',
                component: CenterLiveBossView
            },
            {
                path: 'identify',
                component: CenterIdentifyView
            },
            {
                path: 'history',
                component: CenterHistoryView
            },
            {
                path: 'gift-list',
                component: CenterGiftListView
            },
            {
                path: 'follow',
                component: CenterFollowView
            },
            {
                path: 'comment',
                component: CenterCommentView
            },
        ]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router