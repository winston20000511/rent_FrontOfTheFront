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
      <a href="/forgot-password" class="d-block mt-2 text-center forgot-password">忘記密碼？</a>
    </form>
  </div>
</template>

<script>
import api from "../api/api"; // api.js 位置在 src/api.js 記得確保你的 `api.js` 已正確設定 Axios

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        // 發送登入請求到後端
        const response = await api.post("/login", {
          email: this.email,
          password: this.password,
        });

        // 後端回傳 JWT token
        const token = response.data.token;

        // 儲存 token 到 localStorage
        localStorage.setItem("jwt", token);

        // 跳轉到會員中心
        alert("登入成功！");
        this.$router.push("/member-center");
      } catch (error) {
        // 錯誤處理
        this.errorMessage =
          error.response?.data?.message || "登入失敗，請檢查帳號或密碼。";
      }
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
</style>
