import { createWebHashHistory, createRouter } from "vue-router"

import DefaultLayout from "@/layout/DefaultLayout.vue"
import SystemLayout from "@/layout/SystemLayout.vue"

const routes = [
    {
        path: "/login",
        component: () => import("@/views/login.vue"),
        meta: { title: "登录", icon: "login", hidden: false }
    },
    {
        path: "/register",
        component: () => import("@/views/register.vue"),
        meta: { title: "注册", icon: "register", hidden: false }
    },
    {
        path: "/system",
        component: SystemLayout,
        meta: { title: "首页", icon: "dashboard", hidden: false },
        redirect: "/system/dashboard",
        children: [
            {
                path: "/system/dashboard",
                component: () => import("@/views/system/dashboard/index.vue"),
                meta: { title: "首页", icon: "dashboard", hidden: false }
            },
            {
                path: "/system/user-manage",
                component: () => import("@/views/system/user/index.vue"),
                meta: { title: "首页", icon: "dashboard", hidden: false }
            },
            {
                path: "/system/user-auth",
                component: () => import("@/views/system/user/index.vue"),
                meta: { title: "首页", icon: "dashboard", hidden: false }
            },
            {
                path: "/system/present-manage",
                component: () => import("@/views/system/gift/index.vue"),
                meta: { title: "首页", icon: "dashboard", hidden: false }
            },
            {
                path: "/system/system-manage/system-manage-menu",
                component: () => import("@/views/system/menu/index.vue"),
                meta: { title: "菜单管理", icon: "dashboard", hidden: false }
            },
            {
                path: "/system/system-manage/system-manage-role",
                component: () => import("@/views/system/manage/role.vue"),
                meta: { title: "角色管理", icon: "dashboard", hidden: false }
            },
            {
                path: "/system/system-manage",
                component: () => import("@/views/system/manage/menu.vue"),
                meta: { title: "菜单管理", icon: "dashboard", hidden: false }
            },
            {
                path: "/system/category-manage",
                component: () => import("@/views/system/category/index.vue"),
                meta: { title: "分类管理", icon: "dashboard", hidden: false }
            }
        ]
    },
    {
        path: "/",
        component: DefaultLayout,
        meta: { title: "首页", icon: "dashboard", hidden: false },
        redirect: "/home",
        children: [
            {
                path: "/home",
                component: () => import("@/views/home.vue"),
                meta: { title: "首页", icon: "dashboard", hidden: false }
            },
            {
                path: "/room/:id",
                component: () => import("@/views/room/index.vue"),
                meta: { title: "直播间", icon: "dashboard", hidden: false }
            },
            {
                path: "/center",
                component: () => import("@/views/center/index.vue"),
                meta: { title: "个人中心", icon: "dashboard", hidden: false },
                redirect: "/center/personnel/profile",
                children: [
                    {
                        path: "personnel/profile",
                        component: () => import("@/views/center/profile/index.vue"),
                    },
                    {
                        path: "personnel/follow",
                        component: () => import("@/views/center/follow/index.vue"),
                    },
                    {
                        path: "personnel/history",
                        component: () => import("@/views/center/view-history/index.vue"),
                    },
                    {
                        path: "dollar/wallet",
                        component: () => import("@/views/center/wallet/index.vue"),
                    },
                    {
                        path: "statistic/punishment",
                        component: () => import("@/views/center/punishment/index.vue"),
                    },
                    {
                        path: "statistic/overview",
                        component: () => import("@/views/center/overview/index.vue"),
                    },
                    {
                        path: "live/live-settings",
                        component: () => import("@/views/center/live-settings/index.vue"),
                    },
                    {
                        path: "identify",
                        component: () => import("@/views/center/identify/index.vue"),
                    },

                    {
                        path: "statistic/gift-list",
                        component: () => import("@/views/center/gift-list/index.vue"),
                    },
                    {
                        path: "statistic/comment",
                        component: () => import("@/views/center/comment/index.vue"),
                    },
                    {
                        path: "dollar/recharge",
                        component: () => import("@/views/center/recharge/index.vue"),
                    },
                    {
                        path: "dollar/bill",
                        component: () => import("@/views/center/bill/index.vue"),
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
