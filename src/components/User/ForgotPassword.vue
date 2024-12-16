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
            />
          </div>
  
          <!-- 按鈕區域 -->
          <div class="btn-container">
            <button type="submit" class="btn btn-red">送出</button>
            <RouterLink to="/login" class="back-link">返回登入頁面</RouterLink>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { RouterLink } from 'vue-router';
  
  function submitForm() {
    alert("系統已發送重設密碼信件至您的電子信箱，請至信箱收信。");
  }
  </script>
  
  <style scoped>
  /* 外層容器，讓表單置中且靠上 */
  .forgot-password-container {
    display: flex;
    justify-content: center; /* 水平置中 */
    align-items: flex-start; /* 靠上對齊 */
    height: 100vh; /* 使用整個視窗高度 */
    width: calc(100% - 200px); /* 避免左側留白問題 */
    margin-left: 200px; /* 左側留白寬度 */
    padding-top: 50px; /* 與頂部距離 */
    background-color: #f9f9f9; /* 背景顏色 */
  }
  
  /* 表單內容的外觀樣式 */
  .forgot-password-form {
    width: 100%;
    max-width: 400px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff; /* 表單背景顏色 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 陰影讓表單更突出 */
  }
  
  /* 標題區域 */
  .heading {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 10px;
    color: #dc3545; /* 紅色文字 */
  }
  
  .heading i {
    margin-right: 10px;
    font-size: 2.5rem; /* 放大圖示 */
    color: #dc3545; /* 紅色圖示 */
  }
  
  /* 虛線分隔 */
  .separator {
    border-top: 1px dashed #ccc;
    margin: 20px 0;
  }
  
  /* 按鈕樣式 */
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
    width: 48%; /* 讓按鈕寬度一致 */
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
    width: 48%; /* 讓按鈕寬度一致 */
  }
  
  .back-link:hover {
    background-color: #0056b3;
  }
  </style>
  