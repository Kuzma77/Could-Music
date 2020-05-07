<template>
  <v-app>
    <!-- <v-app-bar color="cyan" dense dark height="80" app>
      <v-app-bar-nav-icon @click="$router.push('/')"></v-app-bar-nav-icon>
      <v-toolbar-title>Page title</v-toolbar-title>

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

        <v-list>
          <v-list-item link>
            <v-list-item-title>设置</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-title @click="logout">退出</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-content>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="6">
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="red">mdi-heart</v-icon>
                </v-list-item-icon>
                <v-list-item-title> html_url:{{ user.html_url }} </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="orange">mdi-bell</v-icon>
                </v-list-item-icon>
                <v-list-item-title> id:{{ user.id }} </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="cyan">mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-title> name:{{ user.name }} </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="cyan">mdi-heart</v-icon>
                </v-list-item-icon>
                <v-list-item-title> followers:{{ user.followers }} </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="cyan">mdi-heart</v-icon>
                </v-list-item-icon>
                <v-list-item-title> following:{{ user.following }} </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="cyan">mdi-heart</v-icon>
                </v-list-item-icon>
                <v-list-item-title> public_repos:{{ user.public_repos }} </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="cyan">mdi-heart</v-icon>
                </v-list-item-icon>
                <v-list-item-title> public_repos:{{ user.public_repos }} </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>
                <v-img :src="user.avatar_url"></v-img>
              </v-card-title>
              <v-card-text>
                <p>{{ user.name }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content> -->
    <mu-dialog title="请选择您的身份进入系统" width="360" :open.sync="openSimple">
      <mu-flex class="select-control-row" :key="'radio ' + index + 1" v-for="(role, index) in roles">
        <mu-radio :value="index + 1" v-model="radio" :label="role.roleName"></mu-radio>
      </mu-flex>
      <mu-button slot="actions" flat color="primary" @click="gotoIndex(radio)">Sure</mu-button>
    </mu-dialog>
  </v-app>
</template>

<script>
export default {
  name: 'Auth',
  data() {
    return {
      //  user: null
      roles: [],
      radio: 0
    }
  },
  components: {},
  created() {
    console.log('回调')
    let uId = this.$route.query.uId
    this.axios.get(this.GLOBAL.baseUrl + '/sysAdmin/github/login?uId=' + uId).then((res) => {
      if (res.data.code === 1) {
        localStorage.setItem('token', res.data.data.token)
        this.$store.commit('setToken', res.data.data.token)
        let admin = {
          id: res.data.data.admin.id,
          account: res.data.data.admin.account,
          name: res.data.data.admin.name,
          role: res.data.data.admin.roles,
          avatar: res.data.data.admin.avatar
        }
        localStorage.setItem('admin', JSON.stringify(admin))
        this.$store.commit('setAdmin', JSON.stringify(admin))
        this.roles = res.data.data.admin.roles
        // const roleId = res.data.data.admin.roles[0].roleId
        // localStorage.setItem('roleId', roleId)
        // this.$router.push('/')
        if (this.roles.length > 1) {
          this.openSimple = true
        } else {
          //只有一个角色
          const roleId = res.data.data.admin.roles[0].roleId
          //将roleId存入全局
          localStorage.setItem('roleId', roleId)
          this.$store.commit('setRoleId', roleId)
          this.$router.push('/')
          // this.$router.push({
          //   path: '/',
          //   query: {
          //     roleId: roleId
          //   }
          // })
        }
      }
    })
    // let user = this.$route.query.user
    // if (user) {
    //   console.log(user)
    //   this.user = JSON.parse(user)
    // }
    // window.location.href = 'http://localhost:8081/#/dashboard'
  },
  mounted() {},
  methods: {
    gotoIndex(roleId) {
      //带着用户选择的roleId跳到首页
      // this.$router.push({
      //   path: '/',
      //   query: {
      //     roleId: roleId
      //   }
      // })
      //将roleId存入全局
      localStorage.setItem('roleId', roleId)
      this.$router.push('/')
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss"></style>
