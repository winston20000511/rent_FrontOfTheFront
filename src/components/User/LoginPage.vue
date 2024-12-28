<template>
  <div>
    <div class="row">
      <!-- Left side for future ads -->
      <div class="col-md-6 left-side"></div>

      <!-- Right side with login/register form -->
      <div class="col-md-6">
        <h3 class="text-center mb-4">Welcome to Rent189</h3>

        <!-- Mode selection buttons -->
        <ul class="nav nav-tabs mb-3" id="formTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="login-tab"
              data-bs-toggle="tab"
              data-bs-target="#login"
              type="button"
              role="tab"
              aria-controls="login"
              aria-selected="true"
            >
              登入
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="register-tab"
              data-bs-toggle="tab"
              data-bs-target="#register"
              type="button"
              role="tab"
              aria-controls="register"
              aria-selected="false"
            >
              註冊
            </button>
          </li>
        </ul>

        <!-- Tab contents -->
        <div class="tab-content" id="formTabContent">
          <div
            class="tab-pane fade show active"
            id="login"
            role="tabpanel"
            aria-labelledby="login-tab"
          >
            <LoginForm />
          </div>
          <div
            class="tab-pane fade"
            id="register"
            role="tabpanel"
            aria-labelledby="register-tab"
          >
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "./LoginForm.vue";
import RegisterForm from "./RegisterForm.vue";

export default {
  components: {
    LoginForm,
    RegisterForm,
  },
  methods: {
    async validateJWT() {
      try {
        // 從 localStorage 取得 JWT
        const token = localStorage.getItem("jwt");

        if (!token) {
          throw new Error("Token 不存在，請重新登入。");
        }

        // 使用 fetch 驗證 JWT
        const response = await fetch("http://localhost:8080/api/user/validate", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Token 驗證失敗，請重新登入。");
        }

        // 驗證成功，顯示成功訊息或其他操作
        const data = await response.json();
        console.log("Token 驗證成功：", data);
      } catch (error) {
        console.error(error.message);
        alert(error.message);
        localStorage.removeItem("jwt");
        this.$router.push("/login"); // 若驗證失敗，重新導向登入頁
      }
    },
  },
  mounted() {
    this.validateJWT(); // 頁面載入時驗證 JWT
  },
};
</script>