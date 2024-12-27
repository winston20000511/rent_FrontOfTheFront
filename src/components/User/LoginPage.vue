<template>
  <!-- 包裹內容的外層容器 -->
  <div class="login-page-container">
    <div class="row">
      <!-- 左側背景區域 -->
      <div class="col-md-6 left-side"></div>

      <!-- 右側登入/註冊區域 -->
      <div class="col-md-6 form-container">
        <h1 class="text-center mb-4 rent189-title">Welcome to Rent189</h1>

        <!-- 模式切換按鈕 -->
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
              aria-selected="true">
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
              aria-selected="false">
              註冊
            </button>
          </li>
        </ul>

        <!-- 登入/註冊表單內容 -->
        <div class="tab-content" id="formTabContent">
          <div 
            class="tab-pane fade show active" 
            id="login" 
            role="tabpanel" 
            aria-labelledby="login-tab">
            <LoginForm @login-success="handleLoginSuccess" />
          </div>
          <div 
            class="tab-pane fade" 
            id="register" 
            role="tabpanel" 
            aria-labelledby="register-tab">
            <RegisterForm />
          </div>
        </div>
        
        <!-- 關閉按鈕 -->
        <button 
          @click="closeLoginPage" 
          class="btn btn-secondary close-btn">
          關閉
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';
import LoginForm from './LoginForm.vue';
import RegisterForm from './RegisterForm.vue';

// 向父元件發送關閉事件
const emit = defineEmits(['closeLoginPage']);

// 關閉登入頁面的方法
const closeLoginPage = () => {
  emit('closeLoginPage'); // 傳遞事件給父元件
};

// 處理登入成功的方法
const handleLoginSuccess = () => {
  closeLoginPage(); // 關閉登入頁面
};
</script>

<style scoped>
/* 標題Welcome to Rent189 */
.rent189-title {
  font-size: 2.0rem; /* 調整標題大小 */
  font-weight: bold; /* 設置粗體 */
  color: #333; /* 字體顏色，可以根據需求修改 */
}
/* 外層容器樣式 */
.login-page-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  overflow: auto; /* 避免內容溢出時遮蓋 */
}

/* 左側背景區域 */
.left-side {
  background: url('/images/login-background.jpg') no-repeat center center;
  background-size: cover;
  height: 100%;
}

/* 右側表單區域 */
.form-container {
  background-color: white;
  padding: 1rem; /* 減少內邊距 */
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 50%; /* 變寬 */
  max-width: 700px;
  min-width: 500px;
  height: 90vh; /* 高度在這裡改！！目前是占滿視窗高度的 85% */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: auto; /* 當內容超出時顯示滾動條 */
}

/* 關閉按鈕樣式 */
.close-btn {
  width: 100%;
  margin-top: 1rem;
  align-self: flex-end;
}
</style>
