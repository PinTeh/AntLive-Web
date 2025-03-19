import { createWebHashHistory, createRouter } from "vue-router"

import Layout from "@/layout/index.vue"

const routes = [
    {
        path: "/login",
        component: () => import("@/views/login.vue"),
        meta: { title: "登录", icon: "login", hidden: false }
    },
    {
        path: "/",
        component: Layout,
        meta: { title: "首页", icon: "dashboard", hidden: false },
        redirect: "/home",
        children: [
            {
                path: "/home",
                component: () => import("@/views/home.vue"),
                meta: { title: "首页", icon: "dashboard", hidden: false }
            },
            {
                path: "/center",
                component: () => import("@/views/center/index.vue"),
                meta: { title: "个人中心", icon: "dashboard", hidden: false },
                redirect: "/center/profile",
                children: [
                    {
                        path: "security",
                        component: () => import("@/views/center/security/index.vue"),
                    },
                    {
                        path: "profile",
                        component: () => import("@/views/center/profile/index.vue"),
                    },
                    {
                        path: "wallet",
                        component: () => import("@/views/center/wallet/index.vue"),
                    },
                    {
                        path: "punishment",
                        component: () => import("@/views/center/punishment/index.vue"),
                    },
                    {
                        path: "overview",
                        component: () => import("@/views/center/overview/index.vue"),
                    },
                    {
                        path: "live-settings",
                        component: () => import("@/views/center/live-settings/index.vue"),
                    },
                    {
                        path: "live-info",
                        component: () => import("@/views/center/live-info/index.vue"),
                    },
                    {
                        path: "live-boss",
                        component: () => import("@/views/center/live-boss/index.vue"),
                    },
                    {
                        path: "identify",
                        component: () => import("@/views/center/identify/index.vue"),
                    },
                    {
                        path: "history",
                        component: () => import("@/views/center/view-history/index.vue"),
                    },
                    {
                        path: "gift-list",
                        component: () => import("@/views/center/gift-list/index.vue"),
                    },
                    {
                        path: "follow",
                        component: () => import("@/views/center/follow/index.vue"),
                    },
                    {
                        path: "comment",
                        component: () => import("@/views/center/comment/index.vue"),
                    },
                ],
            },
        ],
    },
]

// 默认固定路由
const constantRoutes = [
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/default/403.vue'),
        meta: { hidden: true },
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: [...routes, ...constantRoutes],
})

export default router
