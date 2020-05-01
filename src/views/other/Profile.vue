<template>
  <div>
    <mu-row class="my-theme">
      <mu-col span="6"
        ><div class="grid-cell">
          <v-list two-line>
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="indigo">mdi-account-box</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title><input type="text" name="" id="" v-model="account"/></v-list-item-title>
                <v-list-item-subtitle>account</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider inset></v-divider>
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="indigo">mdi-account-circle</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>
                  <input type="text" name="" id="" v-model="name" />
                </v-list-item-title>
                <v-list-item-subtitle>nicheng</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="indigo">mdi-map-marker</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>soft 1851</v-list-item-title>
                <v-list-item-subtitle>Nanjing,Jiangsu</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider inset></v-divider>
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="indigo">mdi-map-marker</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>soft 1851</v-list-item-title>
                <v-list-item-subtitle>Nanjing,Jiangsu</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider inset></v-divider>
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="indigo">mdi-map-marker</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>soft 1851</v-list-item-title>
                <v-list-item-subtitle>Nanjing,Jiangsu</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider inset></v-divider>
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="indigo">mdi-map-marker</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>soft 1851</v-list-item-title>
                <v-list-item-subtitle>Nanjing,Jiangsu</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider inset></v-divider>
            <mu-row>
              <mu-col span="6"
                ><div class="grid-cell">
                  <div class="my-2">
                    <v-btn small style="margin-left: 16px" @click="open = !open">update</v-btn>
                  </div>
                </div></mu-col
              >
              <mu-col span="6"
                ><div class="grid-cell">
                  <div class="my-2">
                    <v-btn small style="margin-left: 16px" @click="openSimple = true">修改密码</v-btn>
                  </div>
                </div></mu-col
              >
            </mu-row>
          </v-list>
        </div></mu-col
      >
      <mu-col span="6"
        ><div class="grid-cell">
          <v-img :src="admin.avatar" aspect-ratio="1.7" class="my-img"></v-img></div
      ></mu-col>
    </mu-row>
    <template>
      <v-footer dark padless>
        <v-card class="flex" flat tile>
          <v-card-title class="teal">
            <strong class="subheading">Get connected with us on social networks!</strong>

            <v-spacer></v-spacer>

            <v-btn v-for="icon in icons" :key="icon" class="mx-4" dark icon>
              <v-icon size="24px">{{ icon }}</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text class="py-2 white--text text-center"> {{ new Date().getFullYear() }} — <strong>Vuetify</strong> </v-card-text>
        </v-card>
      </v-footer>
    </template>
    <mu-dialog title="Password:" width="360" :open.sync="openSimple">
      <mu-text-field type="password" v-model="password" v-show="show"></mu-text-field>
      <mu-text-field type="text" v-model="password" v-show="!show"></mu-text-field>
      <v-list-item-icon>
        <v-icon color="indigo" @click="show = !show">mdi-account-circle</v-icon>
      </v-list-item-icon>
      <br />
      <mu-button slot="actions" flat color="primary" @click="confirm()">Sure</mu-button>
    </mu-dialog>
    <mu-drawer :open.sync="open" :docked="docked" :right="position === 'right'" class="my-drawer">
      <v-form ref="form" v-model="valid" :lazy-validation="lazy">
        <v-text-field v-model="account" :rules="accountRules" label="Account" required></v-text-field>
        <v-text-field v-model="name" :counter="10" :rules="nameRules" label="Name" required></v-text-field>

        <mu-button :disabled="!valid" color="success" class="mr-4" @click="validate" style="margin-right:10px">
          Validate
        </mu-button>

        <mu-button color="error" class="mr-4" @click="reset" style="margin-right:10px">
          Reset Form
        </mu-button>

        <mu-button color="warning" @click="resetValidation">
          Reset Validation
        </mu-button>
      </v-form>
    </mu-drawer>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      admin: this.$store.state.admin,
      icons: ['mdi-facebook', 'mdi-twitter', 'mdi-linkedin', 'mdi-instagram'],
      docked: false,
      open: false,
      openSimple: false,
      position: 'right',
      valid: true,
      name: '',
      password: '',
      nameRules: [(v) => !!v || 'Name is required', (v) => (v && v.length <= 10) || 'Name must be less than 10 characters'],
      account: '',
      acountRules: [(v) => !!v || 'acount is required', (v) => /^1[3|4|5|8][0-9]\d{4,8}$/.test(v) || 'acount must be valid'],
      lazy: false,
      show: true
    }
  },
  components: {},
  created() {
    this.name = this.admin.name
    this.account = this.admin.account
  },
  mounted() {},
  methods: {
    validate() {
      this.$refs.form.validate()
      this.axios({
        method: 'post',
        url: this.GLOBAL.baseUrl + '/sysAdmin/update',
        data: {
          id: this.admin.id,
          account: this.account,
          name: this.name,
          avatar: this.admin.avatar
        }
      }).then((res) => {
        if (res.data.msg === '成功') {
          let admin1 = {
            id: this.admin.id,
            account: this.account,
            name: this.name,
            role: this.admin.roles,
            avatar: this.admin.avatar
          }
          localStorage.setItem('admin', JSON.stringify(admin1))
          this.$store.commit('setAdmin', JSON.stringify(admin1))
          this.open = false
        }
      })
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
    confirm() {
      this.$confirm('确定修改密码？', '提示', {
        type: 'error'
      }).then(({ result }) => {
        if (result) {
          this.axios({
            method: 'post',
            url: this.GLOBAL.baseUrl + '/sysAdmin/updatePassword',
            params: {
              password: this.password,
              id: this.admin.id
            }
          }).then((res) => {
            if (res.data.msg === '成功') {
              this.openSimple = false
            } else {
              alert('修改失败')
            }
          })
        }
      })
    }
  },
  computed: {}
}
</script>
<style scoped lang="scss">
.my-theme {
  // background-color: gray;
  height: 80%;
  margin-top: 5px;
  padding: 10px;
}
.my-img {
  margin: 10px;
  width: 300px;
  height: 400px;
  border: 2px solid black;
}
.my-drawer {
  width: 450px;
  padding: 8px;
}
</style>
