import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
    admin: JSON.parse(localStorage.getItem('admin')),
    menuList: JSON.parse(localStorage.getItem('menuList')),
    menuList1: [
      { title: 'Dashboard', icon: 'mdi-view-dashboard', url: '/dashboard', subMenus: [] },
      {
        title: '音乐管理',
        icon: 'mdi-music',
        url: '',
        subMenus: [
          {
            title: '歌单管理',
            icon: 'mdi-domain',
            url: '/music-list',
            permissions: []
          },
          {
            title: '歌曲管理',
            icon: 'mdi-text',
            url: '/music',
            permissions: ['music:add', 'music:edit']
          }
        ]
      },
      {
        title: '权限管理',
        icon: 'mdi-music',
        url: '',
        subMenus: [
          {
            title: '角色管理',
            icon: 'mdi-domain',
            url: '/role',
            permissions: ['role:add', 'role:delete']
          },
          {
            title: '菜单管理',
            icon: 'mdi-text',
            url: '/menu',
            permissions: ['menu:add', 'menu:edit', 'menu:delete']
          }
        ]
      },
      { title: 'About', icon: 'mdi-help-box', url: '/about', subMenus: [] }
    ]
  },
  mutations: {
    setToken(state, data) {
      state.token = data
    },
    setAdmin(state, data) {
      state.admin = data
    },
    setMenuList(state, menuList) {
      state.menuList = menuList
    }
  },
  actions: {}
})
export default store
