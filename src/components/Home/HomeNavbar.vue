<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const emit = defineEmits(['signInClicked']);
const authStore = useAuthStore(); // 引入 auth Store

const handleSignInClick = () => {
  // 如果未登入，發送事件通知父組件顯示 LoginPage
  if (!authStore.isLoggedIn) {
    emit('signInClicked');
  } else {
    // 如果已登入，則執行登出邏輯
    authStore.logout();
  }
};
</script>

<template>
  <div class="navbar">
    <!-- 左側：Logo 和標題 -->
    <div class="nav-left">
      <img src="../../assets/Logo3.jpg" alt="Logo" class="nav-logo" />
      <div class="nav-title">
        <h1>house</h1>
      </div>
    </div>

    <!-- 右側：MemberCenter 和 Sign In/Logout -->
    <ul class="nav-right">
      <li>
        <RouterLink to="/member-center">MemberCenter</RouterLink>
      </li>
      <li>
        <button @click="handleSignInClick">
          {{ authStore.isLoggedIn ? 'Logout' : 'Sign In' }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Navbar 容器 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px; /* 添加內距 */
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%; /* 填滿整個頁面寬度 */
  box-sizing: border-box;
}

/* 左側：Logo 和標題 */
.nav-left {
  display: flex;
  align-items: center; /* 垂直居中 Logo 和標題 */
  gap: 20px; /* 增加 Logo 與標題的距離 */
}

.nav-logo {
  max-width: 200px; /* 限制 Logo 寬度 */
  max-height: 120px; /* 限制 Logo 高度 */
  object-fit: contain; /* 確保圖片比例縮放 */
  margin: 0; /* 移除外距，避免影響容器布局 */
}

.nav-title h1 {
  font-size: 60px; /* 標題字體大小 */
  color: black;
  font-family: 'Pacifico', cursive;
  font-weight: 500;
  font-style: normal;
  line-height: 1;
  margin: 0; /* 移除多餘外距 */
}

/* 右側：MemberCenter 和按鈕 */
.nav-right {
  display: flex;
  align-items: center;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.nav-right li {
  margin-left: 20px;
}

.nav-right li a,
.nav-right li button {
  font-size: 20px; /* 按鈕字體大小 */
  padding: 10px 20px; /* 增加按鈕內距 */
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px; /* 圓角按鈕 */
  text-decoration: none;
  cursor: pointer;
}

.nav-right li a:hover,
.nav-right li button:hover {
  background-color: #0056b3;
}

/* 響應式樣式 */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column; /* 導航欄內容垂直排列 */
    align-items: flex-start;
    padding: 20px;
  }

  .nav-left {
    flex-direction: column; /* Logo 和標題換行 */
    align-items: flex-start;
    margin-bottom: 20px; /* 與右側按鈕區域分隔 */
  }

  .nav-title h1 {
    font-size: 48px; /* 小螢幕縮小標題字體 */
  }

  .nav-logo {
    max-width: 150px; /* 小螢幕縮小 Logo */
    max-height: 100px;
  }

  .nav-right {
    flex-wrap: wrap; /* 將導航按鈕換行 */
    margin-top: 10px;
  }

  .nav-right li {
    margin-left: 0;
    margin-right: 10px; /* 減小按鈕之間的距離 */
  }

  .nav-right li a,
  .nav-right li button {
    font-size: 18px; /* 小螢幕縮小按鈕字體 */
    padding: 8px 16px;
  }
}
</style>
