import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'
import vuetify from './plugins/vuetify'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import Message from 'muse-ui-message'
Vue.use(Message)
Vue.use(MuseUI)

Vue.use(VueAxios, axios)
Vue.config.productionTip = false
import global_ from '@/utils/Global'
Vue.prototype.GLOBAL = global_
// 路由导航守卫，当路由发生变化的时候，我们想要做的事情，这就是导航守卫的重点
router.beforeEach((to, from, next) => {
  if (window.localStorage.getItem('admin')) {
    store.commit('refreshAdmin', JSON.parse(window.localStorage.getItem('admin')))
  }

  if (window.localStorage.getItem('menuList')) {
    store.commit('refreshMenuList', JSON.parse(window.localStorage.getItem('menuList')))
  }
  let token = localStorage.getItem('token')
  let isLogin
  if (!token) {
    isLogin = false
  } else {
    isLogin = true
  }
  if (!isLogin) {
    if (to.path !== '/login') {
      return next({ path: '/login' })
    } else {
      next()
    }
  } else {
    if (to.path === '/login') {
      return next({ path: '/' })
    }
    next()
  }
})

//全局请求拦截
axios.interceptors.request.use((config) => {
  //请求的接口不是登录和验证码接口
  if (['/sysAdmin/login', '/captcha'].indexOf(config.url) === -1) {
    const token = localStorage.getItem('token')
    // const id = JSON.parse(localStorage.getItem('admin')).id
    if (token) {
      config.headers.Authorization = token
      config.headers.id = localStorage.getItem('roleId')
    }
  }
  // 默认参数与其他传来的参数进行合并
  // config.data = Object.assign(defaultParams, config.data)
  //判断如果请求类型为formdata
  // if (config.headers['Content-Type'] != 'multipart/form-data') {
  //   config.data = Object.assign(defaultParams, config.data)
  // }
  return config
})

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app')
