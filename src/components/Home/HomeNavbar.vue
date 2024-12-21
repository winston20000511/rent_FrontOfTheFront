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
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 左側：Logo 和標題 */
.nav-left {
  display: flex;
  align-items: center;
}

.nav-logo {
  max-width: 150px;
  max-height: 80px;
  object-fit: contain;
  margin-right: 10px;
}

.nav-title h1 {
  font-size: 60px;
  color: black;
  font-family: 'Pacifico', cursive;
  font-weight: 500;
  font-style: normal;
  line-height: 1;
  margin: 0;
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
  margin-left: 15px;
}

.nav-right li a,
.nav-right li button {
  font-size: 16px;
  padding: 8px 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;
}

.nav-right li a:hover,
.nav-right li button:hover {
  background-color: #0056b3;
}
</style>
