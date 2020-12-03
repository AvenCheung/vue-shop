<template>
  <div class="login-container">
    <!-- 登录盒子 -->
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avater-box">
        <img src="../assets/logo.png" alt="avaterlogo">
      </div>
      <!-- 表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_from">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <!-- 登录重置按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      // 这是表单数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置表单
    // ref引用对象，通过引用对象来获取到我们组件的实例。
    // resetFields()是element提供的重置方法
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败!')
        this.$message.success('登录成功!')
        // console.log(result) 打印出promise
        // 当某个方法的访问值是promise，可以使用await async来简化promise的操作
        // await只能用在被async修饰的方法中。
        /**
         * console.log(result)
         * 使用了await async简化后打印出
         * Login.vue?7463:66{data:{…},status:200,statusText:"OK",headers:{…},config:{…},…}
         * 这个相应具体对象是axios帮我们封装好的，只有里面的data数据才是我们真正需要的
         */
        /**
         * 1.将登录之后的token保存到客户端的sessionStorage中
         * 1.1项目中除了登录接口的其他api接口，都必须登录之后才能访问
         * 1.2token只应在当前网页打开期间生效，所以讲token保存在sessionStorage中
         */
        window.sessionStorage.setItem('token', res.data.token)
        // 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container{
  background-color: #2b4b6b;
  height: 100%;
}

.login-box{
  height: 300px;
  width: 450px;
  background-color: #fff;
  border-radius: 4px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);

  .avater-box{
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
      height: 100%;
      width: 100%;
      background-color: #ddd;
      border-radius: 50%;
    }
  }
}

.login_from{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  // 在element表单中box-sizing默认是content-box
  box-sizing: border-box;
}

.btns{
  display: flex;
  justify-content: flex-end;
}
</style>
