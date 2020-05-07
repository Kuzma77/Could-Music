<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped color="secondary" :mini-variant.sync="mini">
      <v-list dense>
        <v-app-bar-nav-icon @click.stop="mini = !mini"></v-app-bar-nav-icon>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img :src="admin.avatar" @click="handleClick()" />
            <input type="file" @change="uploadImage($event)" style="display: none;" id="fileBox1" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ admin.name }}</v-list-item-title>
            <v-list-item-subtitle class="gutter" v-if="roleId == 1">身份：admin</v-list-item-subtitle>
            <v-list-item-subtitle class="gutter" v-if="roleId == 2">身份：editor</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list>
          <v-list-group v-for="(menu, parent) in menuList" :key="parent" v-model="menu.active" no-action>
            <template v-slot:activator v-ripple>
              <v-list-item-icon>
                <v-icon>{{ menu.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content v-if="menu.subMenus.length === 0">
                <v-list-item-title @click="$router.push(menu.path)">{{ menu.title }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-content v-else>
                <v-list-item-title>{{ menu.title }}</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item v-for="(subMenu, current) in menu.subMenus" :key="current" v-ripple link>
              <v-list-item-icon>
                <v-icon>{{ subMenu.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <router-link :to="{ name: subMenu.path }">
                  <v-list-item-title class="link" :to="{ name: subMenu.path }">{{ subMenu.title }}</v-list-item-title>
                </router-link>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app clipped-left color="secondary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>My Music</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-menu left bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list color="secondary">
          <v-list-item color="secondary" @click="$router.push('/profile')">
            <v-list-item-title>MyProfile</v-list-item-title>
          </v-list-item>
          <v-list-item color="secondary" @click="logout()">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
        <!-- <mu-menu slot="right">
          <mu-button flat>My</mu-button>
          <mu-list slot="content">
            <router-link to="/profile">
              <mu-list-item button>
                <mu-list-item-content>
                  <mu-list-item-title>MyProfile</mu-list-item-title>
                </mu-list-item-content>
              </mu-list-item>
            </router-link>
            <mu-list-item button>
              <mu-list-item-content>
                <mu-list-item-title>Settings</mu-list-item-title>
              </mu-list-item-content>
            </mu-list-item>
            <mu-list-item @click="logout()" button>
              <mu-list-item-content>
                <mu-list-item-title>Logout</mu-list-item-title>
              </mu-list-item-content>
            </mu-list-item>
          </mu-list>
        </mu-menu> -->
      </v-menu>
    </v-app-bar>
    <v-content class="anchor">
      <v-container class="fill-height">
        <router-view />
      </v-container>
    </v-content>
    <v-footer app color="secondary">
      <v-col class="text-center" cols="12"> {{ new Date().getFullYear() }} — <strong>Vuetify</strong> </v-col>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      roleId: 0,
      parent: 0,
      current: 0,
      //admin: this.$store.state.admin,
      menuList: [],
      drawer: true,
      mini: true,
      show: false,
      background: true,
      dark: false,
      value: true
    }
  },
  components: {},
  created() {
    //取得前一个页面传过来的roleId
    // let roleId = this.$route.query.roleId
    //console.log(roleId)
    this.roleId = localStorage.getItem('roleId')
    this.axios.get(this.GLOBAL.baseUrl + '/sysRole?roleId=' + localStorage.getItem('roleId')).then((res) => {
      console.log(res)
      this.menuList = res.data.data.menus
      localStorage.setItem('menuList', JSON.stringify(res.data.data.menus))
      this.$store.commit('setMenuList', JSON.stringify(res.data.data.menus))
    })
  },
  mounted() {},
  methods: {
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('admin')
      localStorage.removeItem('roleId')
      localStorage.removeItem('menuList')
      this.$router.push('/login')
      // this.$store.commit('setUser', null)
    },
    handleClick: function() {
      document.getElementById('fileBox1').click()
    },
    uploadImage() {
      let formData = new FormData()
      formData.append('file', event.target.files[0])
      this.axios({
        method: 'post',
        url: this.GLOBAL.baseUrl + '/api/uploadFile',
        headers: {
          'Content-Type': 'multipart/formdata'
        },
        data: formData
      }).then((res) => {
        console.log(res.data.data)
        this.admin.avatar = res.data.data
        this.changeAvatar()
      })
      // this.Oss.uploadFile(event.target.files[0]).then((res) => {
      //   console.log(res)
      // })
    },
    changeAvatar() {
      this.axios({
        method: 'post',
        url: this.GLOBAL.baseUrl + '/sysAdmin/update',
        data: {
          id: this.admin.id,
          account: this.admin.account,
          name: this.admin.name,
          avatar: this.admin.avatar
        }
      }).then((res) => {
        if (res.data.msg === '成功') {
          let admin1 = {
            id: this.admin.id,
            account: this.admin.account,
            name: this.admin.name,
            role: this.admin.roles,
            avatar: this.admin.avatar
          }
          localStorage.setItem('admin', JSON.stringify(admin1))
          this.$store.commit('setAdmin', JSON.stringify(admin1))
          this.$store.commit('refreshAdmin', JSON.parse(window.localStorage.getItem('admin')))
          this.admin = admin1
        }
      })
    }
  },
  computed: {
    bg() {
      return this.background ? 'https://demos.creative-tim.com/material-dashboard-pro/assets/img/sidebar-1.jpg' : undefined
    },
    admin() {
      return this.$store.state.admin
    }
  }
}
</script>

<style scoped lang="scss">
.bc {
  background-color: rgb(238, 238, 238);
}
.cursor {
  cursor: pointer;
}
</style>
