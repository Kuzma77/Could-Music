<template>
  <v-row class="bc">
    <v-col cols="2">
      <v-container>
        <v-card height="700" width="256">
          <v-navigation-drawer permanen :color="primary" :dark="dark" :src="bg">
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
                <img src="../assets/image/短发1.jpg" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title><h3 class="gutter">Kely Kuzma</h3> </v-list-item-title>
                <v-list-item-subtitle class="gutter">Super Admin</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list dense nav>
              <v-list-item v-for="item in items" :key="item.title" link>
                <template v-if="item.subMenus.length === 0">
                  <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <router-link :to="item.url">
                      <v-list-item-title class="gutter"
                        ><h3>{{ item.title }}</h3></v-list-item-title
                      >
                    </router-link>
                  </v-list-item-content>
                </template>
                <template v-else>
                  <v-list-group value="true" style="margin-left:-10px;">
                    <template v-slot:activator>
                      <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title
                        ><h2>{{ item.title }}</h2></v-list-item-title
                      >
                    </template>
                    <v-list-item-content style="margin-left:20px;">
                      <v-list-item v-for="(menu, i) in item.subMenus" :key="i" link>
                        <v-list-item-icon class="gutter">
                          <v-icon :v-text="menu.icon">{{ menu.icon }}</v-icon>
                        </v-list-item-icon>
                        <router-link :to="menu.url">
                          <v-list-item-title :v-text="menu.title" class="gutter">{{ menu.title }}</v-list-item-title>
                        </router-link>
                      </v-list-item>
                    </v-list-item-content>
                  </v-list-group>
                </template>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-card>
      </v-container>
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
      <v-container>
        <router-view />
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      user: this.$store.state.user,
      items: this.$store.state.menuList1,
      background: true,
      dark: false,
      value: true
    }
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    logout() {
      alert('logout')
      localStorage.removeItem('token')
      this.$store.commit('setUser', null)
      this.$router.push('/login')
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
