import Vue from "vue";
import VueRouter from "vue-router";

import Auth from "../views/auth/Index"
import PageNotFound from "../views/errors/PageNotFound.vue";
import Login from "../views/auth/Login.vue";
import LoginPTSI from "../views/auth/LoginPTSI.vue";
import LoginNaccu from "../views/auth/LoginNaccu.vue";
import ChangePassword from "../views/auth/ChangePassword.vue";

// import Register from "../views/auth/Register.vue";
import ForgotPassword from "../views/auth/ForgotPassword.vue";
import ForgotPasswordPTSI from "../views/auth/ForgotPasswordPTSI.vue";
import ForgotPasswordNaccu from "../views/auth/ForgotPasswordNaccu.vue";
import store from '../store/index';

import AdminRoutes from "./admin";
import axios from "axios";

Vue.use(VueRouter);

const baseRoutes = [

  {
    path: '',
    component: Auth,
    children: [
       // Login
      {
        path: "/login",
        name: "login",
        component: Login,
        meta: {requiresAuth: false},
      },
      {
        path: "/login/id",
        name: "loginPTSI",
        component: LoginPTSI,
        meta: {requiresAuth: false},
      },
      {
        path: "/login/ke",
        name: "loginNaccu",
        component: LoginNaccu,
        meta: {requiresAuth: false},
      },
      {
        path: "/forgot-password",
        name: "ForgotPassword",
        component: ForgotPassword,
        meta: {requiresAuth: false},
      },
      {
        path: "/forgot-password/id",
        name: "ForgotPasswordPTSI",
        component: ForgotPasswordPTSI,
        meta: {requiresAuth: false},
      },
      {
        path: "/forgot-password/ke",
        name: "ForgotPasswordNaccu",
        component: ForgotPasswordNaccu,
        meta: {requiresAuth: false},
      },
      {
        path: "/change-password",
        name: "ChangePassword",
        component: ChangePassword,
        meta: {requiresAuth: false},
      },

      // EUDR Invitation signup
      {
        path: "eudr-invitation-signup/:inviterId?/:inviteeId?",
        name: "EUDRInvitationPage",
        component: () => import("../views/deforestation/dds/auth/eudr-signup.vue"),
        meta: {requiresAuth: false},
      },

      // Diligence Welcome Screen
      {
        path: "/diligence-welcome",
        name: "diligenceWelcome",
        component: () =>
          import("../views/deforestation/dds/auth/WelcomeScreen.vue"),
        meta: {requiresAuth: true},
      }
    
    ]
  },
  {
    path: "/public-dds/:reportEncId",
    name: "diligencePublicReport",
    component: () => import("../views/deforestation/dds/PublicDDSReport.vue"),
    meta: {requiresAuth: false}
  },
  { 
    path: "*", 
    name: "404",
    component: PageNotFound
  },
];

const routes = baseRoutes.concat(AdminRoutes);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach( async (to, from, next) => {
  await store.dispatch('autoLogin');
  await store.dispatch('eudrSettings/loadEudrSetting')
  // if undefined considered requiresAuth as true
  const isAuth = await store.getters.isAuthenticated;
  const currentRouteName = to.name
  const user = localStorage.getItem('user')
  let sideBarMenu
  if (user) {
    sideBarMenu = JSON.parse(localStorage.getItem('user')).sideBarMenu
  } else {
    sideBarMenu = store && store.getters && store.getters.getUser && store.getters.getUser.sideBarMenu
  }
  if (sideBarMenu) {
    // check for sidebar items with no subMenu
    let currentModule = sideBarMenu.filter(item => item.route_path_name === currentRouteName)

    // check for sidebar items with subMenu
    if (!currentModule.length) {
      sideBarMenu.forEach(item => {
        if (item.subMenu && item.subMenu.length > 0) {
          item.subMenu.forEach(subItem => {
            if (subItem.route_path_name === currentRouteName) {
              currentModule = [subItem]
            }
          })
        }
      })
    }

    if (currentModule && currentModule.length > 0) {
      const getPermittedActionsData = await axios.get(`/getPermittedActionsData/${currentModule[0].id.replace('/', '__')}`)
      if (getPermittedActionsData.data.success) { 
        await store.dispatch('setModulePermittedActions', getPermittedActionsData.data.data);
      }
    } else {
      await store.dispatch('setModulePermittedActions', []);
    }
  }

  if(to.meta.requiresAuth === false){
    if(isAuth && (to.name == 'login' || to.name == 'register')){
      next({name: 'AdminDashboard'});
    }
    next();
  }else{
    if(isAuth){
      // Special case for TutorialManagement route - allow super admin users
      if(to.name === 'TutorialManagement'){
        const userData = store.getters.getUser
        const isSuperAdmin = userData?.user_role_assoc?.some(role => role.id === 'super_admin')
        if(isSuperAdmin){
          next()
          return
        } else {
          next({name: 'Home'})
          return
        }
      }
      
      if(to['meta'] !== undefined && to.meta["module"] !== undefined){
        // console.log('mdll',to.meta.module)
        const isAuthrised = await store.getters.isRouteAuthrised(to.meta.module)
        console.log('route auth or not',isAuthrised)
        if(!isAuthrised)
          next({name: 'Home'})
      }
      // Redirect all clients to approval flow dashboard
      if (to.name === 'Dashboard' || to.name === 'IndonesianDashboard') {
        next({ name: 'dashboard' });
        return;
      }

      // Handle /home route redirection to approval flow dashboard
      if (to.name === 'Home') {
        next({ name: 'dashboard' });
        return;
      }

      if(to.fullPath == '/')
        next({name: 'AdminDashboard'})
      else{
        next();
      }
    }else{
      // console.log('sss')
      next({name: 'login'})
    }
  }
});

export default router;
