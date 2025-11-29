import { createRouter, createWebHistory } from 'vue-router';

import DashBoardLayout from '@/layouts/DashboardLayout.vue';
import Login from '@/pages/Login.vue';
import Users from '@/pages/Users.vue';
import Home from '@/pages/Home.vue';


const routes = [
    { 
        path: '/dash',
        component: DashBoardLayout,
        children: [
            { path: '', component: Home},
            { path: 'users', component: Users},
           
        ]
    },

    { 
        path: '/',
        component: Login,
    },
];

export const router = createRouter ({
    history: createWebHistory(),
    routes
});