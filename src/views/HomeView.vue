<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // 引入 Pinia 的 auth Store
import HomeCardList from '@/components/Home/HomeCardList.vue';
import HomeFilter from '@/components/Home/HomeFilter.vue';
import HomeMap from '@/components/Home/HomeMap.vue';
import HomeNavbar from '@/components/Home/HomeNavbar.vue';
import LoginPage from '@/components/User/LoginPage.vue'; // 引入 LoginPage 組件

// 從 auth Store 中提取狀態和方法
const authStore = useAuthStore();
const router = useRouter();

// 在組件掛載時檢查登入狀態
onMounted(() => {
  authStore.checkLoginStatus(); // 使用 Store 中的檢查登入狀態方法
});

// 計算屬性：從 Store 獲取狀態
const isLoggedIn = computed(() => authStore.isLoggedIn);
const userProfile = computed(() => authStore.userProfile);

// 控制 LoginPage 顯示狀態
const showLoginPage = ref(false);

// 接收來自 HomeNavbar 的 signInClicked 事件
const handleSignInClicked = () => {
  showLoginPage.value = true; // 顯示 LoginPage
};

// 關閉 LoginPage 的方法
const closeLoginPage = () => {
  showLoginPage.value = false; // 隱藏 LoginPage
};

// 登出功能：清除狀態並重定向
const signOut = () => {
  authStore.signOut();
  router.push('/'); // 登出後重定向至首頁
};
</script>

<template>
  <header>
    <HomeNavbar @signInClicked="handleSignInClicked"></HomeNavbar>
    <!-- 根據登入狀態顯示內容 -->
    <div v-if="isLoggedIn" class="user-info">
      <img v-if="userProfile" :src="userProfile" alt="User Profile" class="user-avatar" />
      <button @click="signOut">Sign Out</button>
    </div>
  </header>

  <!-- 如果 showLoginPage 為 true，顯示 LoginPage -->
  <LoginPage 
    v-if="showLoginPage" 
    @closeLoginPage="closeLoginPage" 
  />

  <div class="filter">
    <HomeFilter></HomeFilter>
  </div>

  <main class="main-container">
    <div class="main-left">
      <HomeMap></HomeMap>
    </div>
    <div class="main-right">
      <HomeCardList></HomeCardList>
    </div>
  </main>

  <!-- 子路由內容 -->
  <router-view></router-view>
</template>

<style scoped>
/* 篩選區域樣式 */
.filter {
  display: flex;
  width: 100%;
  height: 10vh;
  border-bottom: 1px solid lightgray;
}

/* 主容器樣式 */
.main-container {
  display: flex;
  width: 100%;
  height: 76vh;
  background-color: rgb(235, 235, 235);
}

.main-left {
  width: 45%;
  padding: 20px;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-right {
  width: 55%;
  overflow: auto;
  padding: 20px;
  z-index: 2;
}

/* 使用者資訊樣式 */
.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

button {
  padding: 5px 10px;
  cursor: pointer;
}
</style>
