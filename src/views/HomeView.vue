<script setup>
import { ref, onMounted } from 'vue';
import HomeCardList from '@/components/Home/HomeCardList.vue';
import HomeFilter from '@/components/Home/HomeFilter.vue';
import HomeMap from '@/components/Home/HomeMap.vue';
import HomeNavbar from '@/components/Home/HomeNavbar.vue';
import LoginPage from '@/components/User/LoginPage.vue'; // 新增 LoginPage 引入

// 控制 LoginPage 的顯示狀態
const showLoginPage = ref(false);

// 控制使用者登入狀態
const isLoggedIn = ref(false);

// 儲存使用者頭像 URL
const userAvatar = ref(''); // 預設為空字串

// 切換 LoginPage 的顯示狀態
const toggleLoginPage = () => {
  showLoginPage.value = !showLoginPage.value;
};

// 確認 JWT Token 是否存在
const checkLoginStatus = () => {
  const token = localStorage.getItem('jwt');
  if (token) {
    isLoggedIn.value = true;

    // 假設後端回傳的 API 提供使用者的頭像資訊
    fetch('/api/user/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          userAvatar.value = data.avatar || '/default-avatar.png'; // 預設頭像路徑
        } else {
          isLoggedIn.value = false; // 若 API 回傳失敗，重設登入狀態
        }
      })
      .catch(() => {
        isLoggedIn.value = false; // 發生錯誤也設為未登入
      });
  } else {
    isLoggedIn.value = false;
  }
};

// 登出並清除 JWT Token
const signOut = () => {
  localStorage.removeItem('jwt'); // 清除 JWT Token
  isLoggedIn.value = false; // 重設登入狀態
  userAvatar.value = ''; // 清除頭像
};

onMounted(() => {
  checkLoginStatus(); // 元件載入時確認登入狀態
});
</script>

<template>
  <header>
    <HomeNavbar @signInClicked="toggleLoginPage">
      <template v-if="isLoggedIn">
        <div class="user-info">
          <img :src="userAvatar" alt="Avatar" class="avatar" />
          <button @click="signOut">Sign out</button>
        </div>
      </template>
      <template v-else>
        <button @click="toggleLoginPage">Sign in</button>
      </template>
    </HomeNavbar>
  </header>

  <div class="filter">
    <HomeFilter></HomeFilter>
  </div>

  <main>
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
/* header 樣式應只負責 HomeNavbar 的容器樣式 */
header {
  width: 100%;
  background-color: #f9f9f9;
  z-index: 10;
}

.filter {
  display: flex;
  width: 100%;
  height: 10vh;
  border-bottom: 1px solid lightgray;
}

main {
  width: 100%;
  height: 76vh;
  display: flex;
  background-color: rgb(235, 235, 235);
}

.main-left {
  width: 45%;
  z-index: 1;
}

.main-right {
  width: 55%;
  overflow: auto;
  z-index: 2;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
</style>
