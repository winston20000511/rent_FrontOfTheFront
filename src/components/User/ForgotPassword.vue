<template>
  <div class="forgot-password-container">
    <div class="forgot-password-form">
      <!-- 忘記密碼標題區域 -->
      <div class="heading">
        <i class="bi bi-lock"></i> <!-- 鎖頭圖示 -->
        忘記密碼
      </div>
      <p class="text-center">(寄發重新設定密碼連結至電子信箱)</p>

      <!-- 虛線分隔 -->
      <div class="separator"></div>

      <!-- 忘記密碼表單 -->
      <form id="forgotPasswordForm" @submit.prevent="submitForm">
        <!-- 電子信箱欄位 -->
        <div class="mb-3">
          <label for="email" class="form-label">電子信箱</label>
          <input
            type="email"
            class="form-control"
            id="email"
            name="email"
            placeholder="請輸入電子信箱"
            required
            v-model="email"
          />
        </div>

        <!-- 驗證碼欄位 -->
        <div class="mb-3">
          <label for="verificationCode" class="form-label">驗證碼</label>
          <input
            type="text"
            class="form-control"
            id="verificationCode"
            name="verificationCode"
            placeholder="請輸入下方「數字驗證碼」"
            required
            v-model="verificationCode"
          />
        </div>

        <!-- 按鈕區域 -->
        <div class="btn-container">
          <button type="submit" class="btn btn-red">送出</button>
          <!-- 返回登入頁面按鈕，觸發 close 事件 -->
          <button type="button" class="back-link" @click="$emit('close')">
            返回登入頁面
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 定義可觸發的事件
defineEmits(["close"]);

// 綁定輸入欄位的資料
const email = ref("");
const verificationCode = ref("");

async function submitForm() {
  const token = localStorage.getItem("jwt");

  if (!token) {
    alert("尚未登入，請先登入！");
    return;
  }

  try {
    const response = await fetch("/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify({
        email: email.value,
        verificationCode: verificationCode.value,
      }),
    });

    if (response.ok) {
      alert("系統已發送重設密碼信件至您的電子信箱，請至信箱收信。");
    } else {
      const error = await response.json();
      alert(`錯誤: ${error.message}`);
    }
  } catch (error) {
    console.error("請求失敗：", error);
    alert("發生錯誤，請稍後再試！");
  }
}
</script>

<style scoped>
/* CSS樣式與原始碼相同 */
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
  padding: 50px 20px;
  background-color: #f9f9f9;
}

.forgot-password-form {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.heading {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #dc3545;
}

.heading i {
  margin-right: 10px;
  font-size: 2.5rem;
  color: #dc3545;
}

.separator {
  border-top: 1px dashed #ccc;
  margin: 20px 0;
}

.mb-3 {
  margin-bottom: 1rem;
}

.form-label {
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn-red {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 1rem;
  width: 48%;
  cursor: pointer;
}

.btn-red:hover {
  background-color: #c82333;
}

.back-link {
  display: inline-block;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  background-color: #007bff;
  color: white;
  border: 1px solid #007bff;
  border-radius: 8px;
  width: 48%;
  cursor: pointer;
}

.back-link:hover {
  background-color: #0056b3;
}
</style>
