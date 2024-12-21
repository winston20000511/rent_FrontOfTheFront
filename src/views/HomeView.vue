<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // 引入 Pinia 的 auth Store
import HomeCardList from '@/components/Home/HomeCardList.vue';
import HomeFilter from '@/components/Home/HomeFilter.vue';
import HomeMap from '@/components/Home/HomeMap.vue';
import HomeNavbar from '@/components/Home/HomeNavbar.vue';
import LoginPage from '@/components/User/LoginPage.vue';

// 從 auth Store 中提取狀態和方法
const authStore = useAuthStore();
const router = useRouter();

const showLoginPage = ref(false); // 控制 LoginPage 顯示的狀態

// 控制 LoginPage 的顯示狀態
const toggleLoginPage = () => {
  showLoginPage.value = !showLoginPage.value;
};

// 在組件掛載時檢查登入狀態
onMounted(() => {
  authStore.checkLoginStatus(); // 使用 Store 中的檢查登入狀態方法
});

// 計算屬性：從 Store 獲取狀態
const isLoggedIn = computed(() => authStore.isLoggedIn);
const userProfile = computed(() => authStore.userProfile);

// 登出功能：清除狀態並重定向
const signOut = () => {
  authStore.signOut();
  router.push('/'); // 登出後重定向至首頁
};
</script>

<template>
  <header>
    <HomeNavbar @signInClicked="toggleLoginPage"></HomeNavbar>
    <!-- 根據登入狀態顯示內容 -->
    <div v-if="isLoggedIn" class="user-info">
      <img v-if="userProfile" :src="userProfile" alt="User Profile" class="user-avatar" />
      <button @click="signOut">Sign Out</button>
    </div>
    <div v-else>
      <button @click="toggleLoginPage">Sign In</button>
    </div>
  </header>

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

  <!-- 控制 LoginPage 的顯示 -->
  <LoginPage v-if="showLoginPage" @closeLoginPage="toggleLoginPage" />

  <!-- 子路由內容 -->
  <router-view></router-view>
</template>

<style scoped>
.filter {
  display: flex;
  width: 100%;
  height: 10vh;
  border-bottom: 1px solid lightgray;
}

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
