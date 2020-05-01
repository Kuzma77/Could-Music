<template>
  <v-row class="bc">
    <v-col cols="2">
      <v-card height="700" width="256">
        <v-navigation-drawer v-model="drawer" :dark="dark" :src="bg">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title
                class="title cursor"
                @click="
                  dark = !dark
                  background = !background
                "
              >
                <h2>C Music</h2>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-avatar>
              <img :src="admin.avatar" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                ><h3 class="gutter">{{ admin.name }}</h3>
              </v-list-item-title>
              <v-list-item-subtitle class="gutter" v-if="this.$route.query.roleId === 1">admin</v-list-item-subtitle>
              <v-list-item-subtitle class="gutter" v-if="this.$route.query.roleId === 2">editor</v-list-item-subtitle>
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
                  <router-link :to="menu.path" v-if="menu.subMenus.length === 0">
                    <v-list-item-title class="link">{{ menu.title }}</v-list-item-title>
                  </router-link>
                </v-list-item-content>
                <v-list-item-content v-else>
                  <v-list-item-title class="link">{{ menu.title }}</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item v-for="(subMenu, current) in menu.subMenus" :key="current" v-ripple link>
                <v-list-item-icon>
                  <v-icon>{{ subMenu.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <router-link :to="{ name: subMenu.path }">
                    <v-list-item-title class="link">{{ subMenu.title }}</v-list-item-title>
                  </router-link>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list>
        </v-navigation-drawer>
      </v-card>
    </v-col>
    <v-col cols="10">
      <header>
        <mu-appbar style="width: 100%;" color="grey">
          <mu-button icon slot="left">
            <mu-icon value="CM"></mu-icon>
          </mu-button>
          Music
          <mu-menu slot="right">
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
          </mu-menu>
        </mu-appbar>
      </header>

      <router-view />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      parent: 0,
      current: 0,
      admin: this.$store.state.admin,
      menuList: [],
      drawer: true,
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
    // alert(localStorage.getItem('roleId'))
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
    }
  },
  computed: {
    bg() {
      return this.background ? 'https://demos.creative-tim.com/material-dashboard-pro/assets/img/sidebar-1.jpg' : undefined
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
