import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';
import NotFound from '../views/NotFound.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/middle'
    },
    {
        path: '/login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/middle',
        component: () => import('../views/Middle.vue'),
    },
    {
        path: '/toolbox',
        component: () => import('../components/Layout.vue'),
        children: [
            {
                path: 'home',
                component: () => import('../views/Home.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'history',
                component: () => import('../views/History.vue'),
            },
            {
                path: 'history/command',
                component: () => import('../views/CommandDetail.vue')
            },
            {
                path: 'script',
                component: () => import('../views/ScriptManagement.vue'),
            },
            {
                path: 'contact',
                component: () =>
                    import(/* webpackChunkName: "About" */ '../views/Contact.vue')
            }
        ],
    },
    // {
    //     path: '/home',
    //     component: () => import('../views/Hellworld.vue'),
    // },
    // {
    //     path: '/contact',
    //     component: () =>
    //         import(/* webpackChunkName: "About" */ '../views/Contact.vue')
    // }
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
