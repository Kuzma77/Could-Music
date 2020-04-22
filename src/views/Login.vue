<template>
  <div class="bg">
    <mu-container>
      <mu-form ref="form" :model="validateForm" class="login-form">
        <mu-form-item label="用户名" prop="username" :rules="usernameRules">
          <mu-text-field v-model="validateForm.username" prop="username"></mu-text-field>
        </mu-form-item>
        <mu-form-item label="密码" prop="password" :rules="passwordRules">
          <mu-text-field type="password" v-model="validateForm.password" prop="password"></mu-text-field>
        </mu-form-item>
        <mu-row v-show="validateForm.username !== ''">
          <mu-col span="4"
            ><div class="grid-cell">
              <mu-form-item label="验证码" prop="verifyCode" :rules="verifyCodeRules">
                <mu-text-field v-model="verifyCode" prop="verifyCode"></mu-text-field
              ></mu-form-item></div
          ></mu-col>
          <mu-col span="4"
            ><div class="grid-cell">
              <mu-button color="primary" @click="getCodeImg">{{ message }}</mu-button>
            </div></mu-col
          >
          <mu-col span="4"
            ><div class="grid-cell"><img ref="codeImg" v-show="codeShow" style="cursor: pointer; width: 120px;height: 50px;" /></div
          ></mu-col>
        </mu-row>
        <mu-form-item prop="isAgree" :rules="argeeRules">
          <mu-checkbox label="同意用户协议" v-model="validateForm.isAgree"></mu-checkbox>
        </mu-form-item>
        <mu-form-item>
          <mu-button color="primary" @click="submit">提交</mu-button>
          <mu-button @click="clear">重置</mu-button>
        </mu-form-item>
      </mu-form>
      <mu-dialog title="Dialog" width="360" :open.sync="openSimple">
        登录成功
        <mu-button slot="actions" flat color="primary" @click="closeSimpleDialog">Close</mu-button>
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
        username: '',
        password: '',
        isAgree: false
      },
      verifyCode: '',
      codeShow: false,
      message: '获取验证码',
      roles: {},
      openSimple: false
    }
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    openSimpleDialog() {
      this.openSimple = true
    },
    closeSimpleDialog() {
      this.openSimple = false
    },
    getCodeImg() {
      this.codeShow = true
      this.message = '重新获取'
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/captcha',
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
          url: 'http://localhost:8080/sysAdmin/login',
          data: {
            name: this.validateForm.username,
            password: this.validateForm.password,
            verifyCode: this.verifyCode
          }
        }).then((res) => {
          if (res.data.msg === '成功') {
            alert('登录成功')
            localStorage.setItem('token', res.data.data)
            this.$store.commit('setToken', res.data.data)
            // this.getRole(res.data.data)
            this.$router.push('/')
            this.openSimpleDialog()
          } else {
            alert(res.data.msg)
            this.validateForm.code = ''
          }
        })
        this.axios({
          method: 'get',
          url: 'http://localhost:8080/sysRole/' + 1
        }).then((res) => {
          localStorage.setItem('menuList', JSON.stringify(res.data.data.menus))
          this.$store.commit('setMenuList', JSON.stringify(res.data.data.menus))
          console.log(typeof localStorage.getItem('menuList'))
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
}
.login-form {
  max-width: 500px;
  margin-left: 300px;
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
}
</style>
