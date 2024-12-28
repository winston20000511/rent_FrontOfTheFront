<template>
  <div class="register-container">
    <h2 class="register-title">註冊</h2>
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
        <label for="registerPassword" class="form-label">密碼</label><div></div>
        <small class="form-text">密碼需至少8個字母，並包含英數字</small>
        <input
          type="password"
          class="form-control"
          id="registerPassword"
          v-model="password"
          placeholder="請輸入密碼"
          required
        />
      </div>
      <div class="mb-3">
        <label for="registerPhone" class="form-label">手機號碼</label><div></div>
        <small class="form-text">手機格式須為0912345678</small>
        <input
          type="tel"
          class="form-control"
          id="registerPhone"
          v-model="phone"
          placeholder="請輸入手機號碼"
          pattern="^09\d{8}$"
          required
           @input="validatePhone"
        />
        <small v-if="!isPhoneValid" class="text-danger">
          手機號碼格式不正確，請重新輸入！
        </small>
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
import { useRouter } from "vue-router";
import api from "../../api/api"; // 引入包含請求攔截器的 Axios API 模組


export default {
  setup() {
    const router = useRouter();
    return { router };},
  data() {
    return {
      name: "",
      email: "",
      password: "",
      phone: "",
      gender: null,
      isLoading: false, // 加入載入狀態
      errorMessage: "", // 錯誤訊息
      isPhoneValid: true, // 手機號碼格式是否正確
    };
  },
  methods: {
    // 手機號碼格式驗證方法
    validatePhone() {
      const phonePattern = /^09\d{8}$/; // 手機格式正規表達式
      this.isPhoneValid = phonePattern.test(this.phone); // 驗證結果
    },

    async submitRegister() {
      this.isLoading = true; // 開始載入
      this.errorMessage = ""; // 清空錯誤訊息

      // 檢查手機號碼格式
      this.validatePhone();
      if (!this.isPhoneValid) {
        this.errorMessage = "手機號碼格式不正確，請重新輸入！";
        this.isLoading = false;
        return;
      }

      try {
        // 發送註冊請求到後端，攔截器會自動加上 Authorization
        await api.post("http://localhost:8080/api/user/register", {
          name: this.name,
          email: this.email,
          password: this.password,
          phone: this.phone,
          gender: this.gender,
        });

        // 註冊成功後，發送驗證信
        await this.sendVerificationEmail();

        // 註冊成功提示
        alert("註冊成功！請檢查您的電子郵件（包括垃圾郵件夾）以驗證帳號。驗證信有效期為6小時。");
        this.$router.push("/login"); // 跳轉到登入頁面
      } catch (error) {
        // 錯誤處理
        this.errorMessage =
          error.response?.data?.message || "註冊失敗，請稍後再試。";
      } finally {
        this.isLoading = false; // 結束載入
      }
    },
    async sendVerificationEmail() {
      try {
        await api.post("http://localhost:8080/api/user/verifyEmail", {
          email: this.email,
        });

        console.log("驗證信已發送至您的電子信箱！");
      } catch (error) {
  console.error("完整的錯誤對象：", error);
  if (error.response) {
    // 處理後端返回的錯誤
    console.error("後端響應：", error.response.data);
    this.errorMessage = error.response.data.message || "發生未知錯誤，請稍後再試。";
  } else {
    // 處理其他錯誤（如網路問題）
    this.errorMessage = "無法連接到伺服器，請稍後再試。";
  }
}

    },
  },
};
</script>


<style scoped>
.form-text {
  color: red;          /* 設定文字顏色為紅色 */
}
.form-label {
  margin-bottom: 2px; /* 減少標籤和下一行之間的間距 */
}

.form-text {
  margin-top: 2px; /* 減少提示文字和標籤之間的間距 */

}
.terms-link {
  color: blue; /* 設定文字顏色為藍色 */
  text-decoration: underline; /* 添加底線 */
}
.register-title {
  font-size: 3rem; /* 設定字體大小為3rem，約等於斗大的字 */
  font-weight: bold; /* 使字體加粗 */
  margin-bottom: 20px; /* 設定底部邊距 */
}
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
