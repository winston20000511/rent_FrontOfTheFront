<template>
  <div class="login-container">
    <h2>登入</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label for="loginEmail" class="form-label">電子信箱</label>
        <input
          type="email"
          class="form-control"
          id="loginEmail"
          v-model="email"
          placeholder="請輸入電子信箱"
          required
        />
      </div>
      <div class="mb-3">
        <label for="loginPassword" class="form-label">密碼</label>
        <input
          type="password"
          class="form-control"
          id="loginPassword"
          v-model="password"
          placeholder="請輸入密碼"
          required
        />
      </div>
      <p v-if="errorMessage" class="error text-danger">{{ errorMessage }}</p>
      <button type="submit" class="btn btn-primary w-100">登入</button>
      
      <!-- 忘記密碼按鈕 -->
      <button
        type="button"
        class="d-block mt-2 text-center forgot-password btn btn-link"
        @click="showForgotPassword = true"
      >
        忘記密碼？
      </button>
    </form>

    <!-- ForgotPassword.vue 組件，依據 showForgotPassword 控制顯示 -->
    <ForgotPassword v-if="showForgotPassword" @close="closeForgotPassword" />
  </div>
</template>

<script>
// 引入自訂的 Axios API 模組
import api from "../../api/api"; // Authorization 自動添加的功能見 api.js
import ForgotPassword from "../../components/User/ForgotPassword.vue"; // 引入 ForgotPassword 組件

export default {
  components: {
    ForgotPassword,
  },
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      showForgotPassword: false, // 控制 ForgotPassword 組件顯示/隱藏
    };
  },
  methods: {
    async handleLogin() {
      try {
        // 發送登入請求到後端
        const response = await api.post("http://localhost:8080/api/user/login", {
          email: this.email,
          password: this.password,
        });

        // 後端回傳 JWT token
        const token = response.data.token;

        // 儲存 token 到 localStorage
        localStorage.setItem("jwt", token);

        // 登入成功提示並跳轉至會員中心
        alert("登入成功！");
        this.$router.push("/member-Center");
      } catch (error) {
        // 錯誤處理
        this.errorMessage =
          error.response?.data?.message || "登入失敗，請檢查帳號或密碼。";
      }
    },
    closeForgotPassword() {
      // 關閉 ForgotPassword 組件
      this.showForgotPassword = false;
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}
.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}
.forgot-password {
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  background: none;
  border: none;
}
.forgot-password:hover {
  color: #0056b3;
}
</style>
