<template>
  <div class="login_container">
    <!--头像-->
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>

      <!--登录表单-->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-position="left"
        label-width="70px"
        class="login_form"
      >

        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-search"></el-input>
        </el-form-item>

        <el-form-item
          label="密 码"
          prop="password"
        >
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-monitor"
            type="password"
          ></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button
            type="primary"
            @click="login"
          >登录</el-button>
          <el-button
            type="info"
            @click="resetLoginForm"
          >重置</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      return {
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        loginFormRules: { //rule的名字应与数据名字一致
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields();
      },
      login() {
        this.$refs.loginFormRef.validate(async valid => {
          if(!valid) return;
          const { data: res } = await this.$http.post('login', this.loginForm);
          console.log(res);
          if(res.meta.status != 200) return this.$message.error('登陆失败');
          this.$message.success('登陆成功');
          window.sessionStorage.setItem("token", res.data.token);
          this.$router.push("/home");
        })
      }
    }
  };
</script>

<style lang="less" scoped>
  .login_container {
    background-color: aquamarine;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: aliceblue;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar_box{
    height: 130px;
    width: 130px;
    border: 1px solid white;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    img{
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: antiquewhite;
    }
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }
</style>
