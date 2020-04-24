import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/index/Layout.vue'
import Dashboard from '../views/index/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('../views/other/About.vue')
      },
      // {
      //   path: '/profile',
      //   name: 'Profile',
      //   component: () => import('../views/other/Profile.vue')
      // },
      {
        path: '/music-type',
        name: 'MusicType',
        component: () => import('../views/music/MusicType.vue')
      },
      {
        path: '/music-list',
        name: 'MusicList',
        component: () => import('../views/music/MusicList.vue')
      },
      {
        path: '/music',
        name: 'Music',
        component: () => import('../views/music/Music.vue')
      },
      {
        path: '/role',
        name: 'Role',
        component: () => import('../views/permission/Role.vue')
      },
      {
        path: '/menu',
        name: 'Menu',
        component: () => import('../views/permission/Menu.vue')
      },
      {
        path: '/permission',
        name: 'Permission',
        component: () => import('../views/permission/Permission.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/Login.vue')
  },
  {
    path: '/404',
    name: 'Page404',
    component: () => import('../views/other/404.vue')
  }
]
const router = new VueRouter({
  routes
})

export default router
