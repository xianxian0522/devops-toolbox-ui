import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';
import NotFound from '../components/NotFound.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/index/home'
    },
    {
        path: '/helloword',
        component: () => import('../components/HelloWorld.vue'),
    },
    {
        path: '/index',
        component: () => import('../components/Layout.vue'),
        children: [
            {
                path: 'home',
                component: () => import('../views/Home.vue'),
                meta: { requiresAuth: true }
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
    //     component: () => import('../views/Home.vue'),
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
