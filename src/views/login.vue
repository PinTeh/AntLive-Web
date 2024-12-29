<script setup>
import { reactive, ref } from "vue"
import { useStore } from "@/stores"
import { message } from "ant-design-vue"
import { useRouter } from "vue-router"

const route = useRouter()
const formRef = ref({})
const store = useStore()
const formState = reactive({
  username: "admin",
  password: "123123",
})
const rules = {
  username: [{ required: true, message: "Please input your username!" }],
  password: [{ required: true, message: "Please input your password!" }],
}
// 提交表单
const submitForm = () => {
  formRef.value
    .validateFields()
    .then(() => {
      store
        .user()
        .login(formState)
        .then(() => {
          //
          message.success("登录成功，欢迎回来 ~")
          let fullPath = route.currentRoute.value.fullPath
          if (fullPath.startsWith("/login?redirect=")) {
            let lastPath = fullPath.replace("/login?redirect=", "")
            route.push({ path: lastPath })
          } else {
            route.push({ path: "/" })
          }
        })
    })
    .catch((error) => {
      // ignore
    })
}
// 跳转首页
const handleToHome = () => {
  route.push("/")
}
</script>

<template>
  <div class="login-page">
    <section class="form-contianer">
      <div class="titleArea" @click="handleToHome">
        <div id="login-title">
          <span class="title"> Ant<i>Live</i></span>
        </div>
      </div>
      <a-form :model="formState" class="loginForm" ref="formRef" :rules="rules">
        <a-form-item name="username">
          <a-input class="area" type="text" placeholder="用户名" v-model:value="formState.username"></a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input class="area" type="password" placeholder="密码" v-model:value="formState.password"></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="submitForm()" class="submit-btn">登录</a-button>
        </a-form-item>
        <div class="register">
          <router-link :to="{ path: '/register' }">注册用户</router-link>
        </div>
      </a-form>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(@/assets/img/login.svg) no-repeat center center;
  background-size: 100% 100%;
  .form-contianer {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 370px;
    border-radius: 5px;
    padding: 25px;
    .titleArea {
      text-align: center;
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
          color: $primary-color;
          font-style: normal;
        }
      }
    }

    .loginForm {
      .submit-btn {
        width: 100%;
      }
    }
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
      color: $primary-color;
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
  #login-title {
    cursor: pointer;
  }
}
</style>
