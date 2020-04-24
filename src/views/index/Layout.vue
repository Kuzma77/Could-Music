<template>
  <v-row class="bc">
    <v-col cols="2">
      <v-card height="700" width="256">
        <v-navigation-drawer v-model="drawer" :dark="dark" :src="bg">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title
                class="title"
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
              <v-list-item-subtitle class="gutter">身份:{{ admin.role[0].roleName }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list>
            <v-list-group v-for="(item, index) in items" :key="index">
              <template v-slot:activator v-if="item.type == 1">
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content v-if="item.subMenus.length > 0">
                  <v-list-item-title class="link">{{ item.title }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-content v-else>
                  <router-link :to="item.path">
                    <v-list-item-title class="link">{{ item.title }}</v-list-item-title>
                  </router-link>
                </v-list-item-content>
              </template>

              <v-list-item v-for="(subItem, index1) in item.subMenus" :key="index1">
                <v-list-item-icon style="margin-left:20px;">
                  <v-icon>{{ subItem.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="link" @click="gotoSubPage(subItem.path, index, index1)">{{ subItem.title }}</v-list-item-title>
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
              <mu-list-item button>
                <mu-list-item-content>
                  <mu-list-item-title>MyProfile</mu-list-item-title>
                </mu-list-item-content>
              </mu-list-item>
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
      admin: JSON.parse(localStorage.getItem('admin')),
      items: [],
      drawer: true,
      background: true,
      dark: false,
      value: true
    }
  },
  components: {},
  created() {
    //取得前一个页面传过来的roleId
    let roleId = this.$route.query.roleId
    console.log(roleId)
    //携带roleId和token（全局拦截器已经设置）向后端请求菜单
    this.axios.get(this.GLOBAL.baseUrl + '/sysRole?roleId=' + roleId).then((res) => {
      this.$store.commit('setMenuList', JSON.stringify(res.data.data.menus))
      localStorage.setItem('menuList', JSON.stringify(res.data.data.menus))
      this.items = res.data.data.menus
    })
  },
  mounted() {},
  methods: {
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('admin')
      localStorage.removeItem('menuList')
      this.$router.push('/login')
      // this.$store.commit('setUser', null)
    },
    gotoSubPage(path, index, index1) {
      console.log(path, index, index1)
      this.$router.push({
        path: path,
        query: {
          index: index,
          index1: index1
        }
      })
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
</style>
