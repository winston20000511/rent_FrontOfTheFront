<template>
  <div class="register-container">
    <h2>註冊</h2>
    <form @submit.prevent="submitRegister">
      <div class="mb-3">
        <label for="registerName" class="form-label">姓名</label>
        <input
          type="text"
          class="form-control"
          id="registerName"
          v-model="name"
          placeholder="請輸入姓名"
          required
        />
      </div>
      <div class="mb-3">
        <label for="registerEmail" class="form-label">電子信箱</label>
        <input
          type="email"
          class="form-control"
          id="registerEmail"
          v-model="email"
          placeholder="請輸入電子信箱"
          required
        />
      </div>
      <div class="mb-3">
        <label for="registerPassword" class="form-label">密碼</label>
        <input
          type="password"
          class="form-control"
          id="registerPassword"
          v-model="password"
          placeholder="請輸入密碼"
          required
        />
        <small class="form-text text-muted">密碼至少8個字母</small>
      </div>
      <div class="mb-3">
        <label for="registerPhone" class="form-label">手機號碼</label>
        <input
          type="tel"
          class="form-control"
          id="registerPhone"
          v-model="phone"
          placeholder="請輸入手機號碼"
          required
        />
      </div>
      <div class="mb-3">
        <label class="form-label">性別</label><br />
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            id="genderMale"
            name="gender"
            value="0"
            v-model="gender"
            required
          />
          <label class="form-check-label" for="genderMale">男性</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            id="genderFemale"
            name="gender"
            value="1"
            v-model="gender"
            required
          />
          <label class="form-check-label" for="genderFemale">女性</label>
        </div>
      </div>
      <p v-if="errorMessage" class="error text-danger">{{ errorMessage }}</p>
      <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
        {{ isLoading ? "註冊中..." : "註冊" }}
      </button>
    </form>
    <div class="terms mt-3 text-center">
      <p>
        提交註冊即表示您同意 Rent189 的
        <br />
        <a href="/terms" class="terms-link" target="_blank">使用條款</a>
      </p>
    </div>
  </div>
</template>

<script>
import api from "../../api/api"; // 引入 API 模組

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      phone: "",
      gender: null,
      isLoading: false, // 加入載入狀態
      errorMessage: "", // 錯誤訊息
    };
  },
  methods: {
    async submitRegister() {
      this.isLoading = true; // 開始載入
      this.errorMessage = ""; // 清空錯誤訊息
      try {
        // 發送註冊請求到後端
        await api.post("http://localhost:8080/api/user/register", {
          name: this.name,
          email: this.email,
          password: this.password,
          phone: this.phone,
          gender: this.gender,
        });

        // 註冊成功提示
        alert("註冊成功！");
        this.$router.push("/login"); // 跳轉到登入頁面
      } catch (error) {
        // 錯誤處理
        this.errorMessage =
          error.response?.data?.message || "註冊失敗，請確認輸入資料是否正確。";
      } finally {
        this.isLoading = false; // 結束載入
      }
    },
  },
};
</script>

<style scoped>
.register-container {
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
