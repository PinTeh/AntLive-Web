<script setup>
import { reactive, ref } from "vue"

const loginForm = reactive({})
const submitForm = () => {}
const rules = ref([])
const handleToHome = () => {}
</script>

<template>
  <div class="login_page">
    <section class="form_contianer">
      <div class="titleArea" @click="handleToHome">
        <div id="login_title">
          <span class="title"> Ant<i>Live</i> </span>
        </div>
      </div>
      <a-form :model="loginForm" :rules="rules" ref="loginForm" class="loginForm">
        <a-form-item name="username" class="login-item">
          <a-input @keyup.enter.native="submitForm('loginForm')" class="area" type="text" placeholder="用户名" v-model="loginForm.username"></a-input>
        </a-form-item>
        <a-form-item name="password" class="login-item">
          <a-input
            @keyup.enter.native="submitForm('loginForm')"
            class="area"
            type="password"
            placeholder="密码"
            v-model="loginForm.password"></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登录</a-button>
        </a-form-item>
        <div class="register">
          <router-link :to="{ path: '/register' }">注册用户</router-link>
        </div>
        <div class="tiparea">
          <p class="wxtip">温馨提示：</p>
          <p class="tip">
            用户名为：admin/editor
            <span>(可用于切换权限)</span>
          </p>
          <p class="tip">密码为：123456</p>
        </div>
      </a-form>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.login_page {
  position: absolute;
  width: 100%;
  height: calc(100vh - 100px);
  background: url(@/assets/img/login.svg) no-repeat center center;
  background-size: 100% 100%;
}
.register {
  text-decoration: none;
  text-align: right;
  a {
    text-decoration: none;
    padding: 5px;
    color: #666666;
  }
  a:visited {
    color: #666666;
  }
}
.register:hover {
  a {
    color: #d75d00;
  }
}

.form_contianer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  //   background: #fff;
  width: 370px;
  border-radius: 5px;
  padding: 25px;
  text-align: center;
  .titleArea {
    justify-content: center;
    align-items: center;
    // text-transform: uppercase;
    font-size: 22px;
    width: 100%;
    padding-bottom: 20px;
    .logo {
      width: 40px;
      margin-right: 10px;
    }
    .title {
      i {
        color: #ff6c60;
        font-style: normal;
      }
    }
  }

  .loginForm {
    .submit_btn {
      width: 100%;
      // padding: 13px 0;
      // font-size: 16px;
    }
    .loginTips {
      position: absolute;
      left: 10px;
      z-index: 20;
      // color: #FF7C1A;
      font-size: 18px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
.manage_tip {
  margin-bottom: 20px;
  .title {
    font-family: cursive;
    font-weight: bold;
    font-size: 26px;
    color: #fff;
  }
  .logo {
    width: 60px;
    height: 60px;
  }
}
#login_title {
  cursor: pointer;
}
.tiparea {
  display: none;
  text-align: left;
  font-size: 12px;
  color: #0a0a0a;
  padding: 10px 0;
  .tip {
    margin-left: 54px;
  }
}

.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
.loginForm {
  .el-button--primary {
    background-color: #ff7c1a;
    border: 1px solid #ff7c1a;
  }
}
</style>
