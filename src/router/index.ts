import { createRouter, createWebHistory } from 'vue-router';

import DashBoardLayout from '@/ui/layouts/DashboardLayout.vue';
import Login from '@/ui/pages/Login.vue';
import Users from '@/ui/pages/Users.vue';
import Forbidden from '@/ui/pages/Forbidden.vue';

import Home from '@/ui/pages/Home.vue';

import { userAuthStore } from '@/stores';
import { EnumRole } from '@/models';
import Logout from '@/ui/pages/Logout.vue';




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

    { 
        path: '/forbidden',
        component: Forbidden,
    },

    { 
        path: '/logout',
        component: Logout,
    },
];

export const router = createRouter ({
    history: createWebHistory(),
    routes
});

const allowedRolesForDashSystem: EnumRole[] = [
  EnumRole.root,
  EnumRole.admin,
  EnumRole.tesouraria,
];

router.beforeEach((to,from,next)=>{
    const authStore = userAuthStore();

    if(to.path.startsWith("/dash")){

        if(!authStore.credentials){
            return next({path:'/'});
        }

        if(!allowedRolesForDashSystem.includes(authStore.credentials.status as EnumRole))
        {
            return next({ path: '/forbidden' });
        }
    }
    next();
});