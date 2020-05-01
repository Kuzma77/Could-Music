<template>
  <div class="bg">
    <mu-alert color="error" @delete="alert = false" delete v-if="alert" transition="mu-scale-transition" class="alert">
      <mu-icon left value="error!"></mu-icon> {{ message }}
    </mu-alert>
    <mu-container>
      <mu-form ref="form" :model="validateForm" class="login-form">
        <mu-form-item label="用户名" prop="username" :rules="usernameRules">
          <mu-text-field v-model="validateForm.username" prop="username"></mu-text-field>
        </mu-form-item>
        <mu-form-item label="密码" prop="password" :rules="passwordRules">
          <mu-text-field type="password" v-model="validateForm.password" prop="password"></mu-text-field>
        </mu-form-item>
        <mu-row v-show="validateForm.username !== ''">
          <mu-col span="9"
            ><div class="grid-cell">
              <mu-form-item label="验证码" prop="verifyCode" :rules="verifyCodeRules">
                <mu-text-field v-model="verifyCode" prop="verifyCode"></mu-text-field
              ></mu-form-item></div
          ></mu-col>
          <mu-col span="3"
            ><div class="grid-cell" @click="getCodeImg">
              <mu-button color="primary" v-show="!codeShow">获取验证码</mu-button>
              <img ref="codeImg" v-show="codeShow" style="cursor: pointer; width: 120px;height: 50px;" /></div
          ></mu-col>
        </mu-row>
        <mu-form-item prop="isAgree" :rules="argeeRules">
          <mu-checkbox label="同意用户协议" v-model="validateForm.isAgree"></mu-checkbox>
        </mu-form-item>
        <mu-form-item>
          <mu-button color="primary" @click="submit">提交</mu-button>
          <mu-button @click="clear">重置</mu-button>
          <mu-button @click="login()">github第三方登录</mu-button>
        </mu-form-item>
      </mu-form>
      <mu-dialog title="请选择您的身份进入系统" width="360" :open.sync="openSimple">
        <mu-flex class="select-control-row" :key="'radio ' + index + 1" v-for="(role, index) in roles">
          <mu-radio :value="index + 1" v-model="radio" :label="role.roleName"></mu-radio>
        </mu-flex>
        <mu-button slot="actions" flat color="primary" @click="gotoIndex(radio)">Sure</mu-button>
      </mu-dialog>
    </mu-container>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      usernameRules: [
        { validate: (val) => !!val, message: '必须填写用户名' },
        { validate: (val) => val.length >= 3, message: '用户名长度大于3' }
      ],
      passwordRules: [
        { validate: (val) => !!val, message: '必须填写密码' },
        { validate: (val) => val.length >= 3 && val.length <= 10, message: '密码长度大于3小于10' }
      ],
      verifyCodeRules: [
        { validate: (val) => !!val, message: '必须填写验证码' },
        { validate: (val) => val.length >= 6, message: '6位数验证码' }
      ],
      argeeRules: [{ validate: (val) => !!val, message: '必须同意用户协议' }],
      validateForm: {
        username: '18805167526',
        password: '1234567',
        isAgree: false
      },
      admin: null,
      radio: 0,
      verifyCode: '',
      codeShow: false,
      message: '',
      roles: [],
      openSimple: false,
      alert: false
    }
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    getCodeImg() {
      this.codeShow = true
      this.axios({
        method: 'get',
        url: this.GLOBAL.baseUrl + '/captcha',
        params: {
          name: this.validateForm.username
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'blob'
      }).then((res) => {
        var img = this.$refs.codeImg
        let url = window.webkitURL.createObjectURL(res.data)
        console.log(res.data)
        img.src = url
      })
    },
    submit() {
      this.$refs.form.validate().then((result) => {
        console.log('form valid: ', result)
        this.axios({
          method: 'post',
          url: this.GLOBAL.baseUrl + '/sysAdmin/login',
          data: {
            account: this.validateForm.username,
            password: this.validateForm.password,
            verifyCode: this.verifyCode
          }
        }).then((res) => {
          if (res.data.msg === '成功') {
            localStorage.setItem('token', res.data.data.token)
            this.$store.commit('setToken', res.data.data.token)
            let admin = {
              id: res.data.data.admin.id,
              account: res.data.data.admin.account,
              name: res.data.data.admin.name,
              role: res.data.data.admin.roles, //有两个角色，暂时先用第一个
              avatar: res.data.data.admin.avatar
            }
            //存admin信息
            localStorage.setItem('admin', JSON.stringify(admin))
            this.$store.commit('setAdmin', JSON.stringify(admin))
            this.roles = res.data.data.admin.roles
            //角色数量超过1个
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
          } else {
            this.alert = true
            this.message = res.data.msg
            this.validateForm.code = ''
          }
        })
      })
    },
    clear() {
      this.$refs.form.clear()
      ;(this.validateForm = {
        username: '',
        password: '',
        isAgree: false
      }),
        (this.verifyCode = '')
    },
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
    },
    login() {
      alert('click')
      const authorize_uri = 'https://github.com/login/oauth/authorize'
      const client_id = '029605ac4b8d64a69874'
      const redirect_url = 'http://localhost:8080/login/oauth2/code/github'
      window.location.href = `${authorize_uri}?client_id=${client_id}&redirect_url=${redirect_url}`
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss">
.bg {
  background-image: url('https://demos.creative-tim.com/vuetify-material-dashboard-pro/img/login.d6d3bb09.jpg');
  opacity: 0.8;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.login-form {
  max-width: 500px;
  margin-left: 300px;
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
}
.select-control-row {
  padding: 8px 0;
}
.alert {
  position: absolute;
  top: 20px;
  left: 40%;
  height: 50px;
  width: 300px;
}
.mu-scale-transition-enter-active,
.mu-scale-transition-leave-active {
  transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.45s cubic-bezier(0.23, 1, 0.32, 1);
  backface-visibility: hidden;
}

.mu-scale-transition-enter,
.mu-scale-transition-leave-active {
  transform: scale(0);
  opacity: 0;
}
</style>
