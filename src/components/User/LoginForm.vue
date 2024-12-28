<template>
  <div class="login-container">
    <h2 class="register-title">登入</h2>
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
      <!-- Google 登入按鈕 -->
      <div class="google-login-btn-container">
        <button
          type="button"
          class="btn btn-dark w-100 mt-3"
          @click="googleLogin"
        >
          使用 Google 帳號登入
        </button>
      </div>
      
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
import api from "../../api/api"; // 引入自訂的 Axios API 模組
import ForgotPassword from "../../components/User/ForgotPassword.vue"; // 引入 ForgotPassword 組件
import { useAuthStore } from "@/stores/auth"; // 引入 Pinia 的 authStore

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
        const recaptchaToken = await this.executeRecaptcha();

        const response = await api.post(
          `http://localhost:8080/api/user/login`,
          {
            email: this.email,
            password: this.password,
            recaptchaToken,
          }
        );

        // 後端回傳 JWT token
        const token = response.data.token;

        // 儲存 token 到 localStorage
        localStorage.setItem("jwt", token);

        // 更新 authStore 的登入狀態
        const authStore = useAuthStore();
        authStore.isLoggedIn = true;

        // 登入成功提示並跳轉回首頁
        alert("登入成功！");
        this.$router.push("/");

        // 在登入成功後觸發 'login-success' 事件
        this.$emit('login-success');
      } catch (error) {
        // 錯誤處理
        this.errorMessage =
          error.response?.data?.message ||
          `登入失敗，請檢查帳號或密碼。（錯誤：${error.message}）`;
        console.error("登入錯誤詳情：", error.response || error);
      }
    },
    executeRecaptcha() {
      return new Promise((resolve, reject) => {
        if (!window.grecaptcha) {
          reject(new Error("reCAPTCHA 尚未載入，請稍後再試"));
          return;
        }
        
        window.grecaptcha
          .execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, { action: "login" })
          .then(resolve)
          .catch((error) => {
            reject(new Error("reCAPTCHA 執行失敗：" + error.message));
          });
      });
    },

    closeForgotPassword() {
      // 關閉 ForgotPassword 組件
      this.showForgotPassword = false;
    },
  },
  mounted() {
    // 載入 Google reCAPTCHA v3
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${
      import.meta.env.VITE_RECAPTCHA_SITE_KEY
    }`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  },
};
</script>

<style scoped>
.register-title {
  font-size: 3rem; /* 設定字體大小為3rem，約等於斗大的字 */
  font-weight: bold; /* 使字體加粗 */
  margin-bottom: 20px; /* 設定底部邊距 */
}
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
