import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        component: () => import('../views/Home.vue'),
    },
    {
        path: '/contact',
        component: () =>
            import(/* webpackChunkName: "About" */ '../views/Contact.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            component: () => import('../views/Home.vue'),
        },
        {
            path: '/contact',
            component: () =>
                import(/* webpackChunkName: "About" */ '../views/Contact.vue')
        }
    ]
});

export default router;
