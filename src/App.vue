<script setup>
import { RouterView } from 'vue-router';
import { ref } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import HomeNavbar from '@/components/Home/HomeNavbar.vue'; // 引入 HomeNavbar
import ChatPopup from './components/ChatRoom/ChatRoom.vue';
import LoginPage from './components/User/LoginPage.vue';
import CollectHouseList from './components/houses/CollectHouseList.vue';
import HouseCreate from './components/houses/HouseCreate.vue';
import HouseUpdate from './components/houses/HouseUpdate.vue';

const showChatPopup = ref(false);
const toggleChatPopup = () => {
  showChatPopup.value = !showChatPopup.value;
};

const showLoginPage = ref(false); // 控制 LoginPage 的顯示
const toggleLoginPage = () => {
  showLoginPage.value = !showLoginPage.value;
};
</script>

<template>
  <div class="app-container">
    <!-- 全局導航欄 -->
    <header class="app-header">
      <HomeNavbar @signInClicked="toggleLoginPage" />
    </header>

    <!-- 主內容 -->
    <main class="app-main">
      <RouterView />
    </main>

    <!-- 聊天彈窗和按鈕 -->
    <div>
      <ChatPopup v-if="showChatPopup" @close="toggleChatPopup" />
      <button class="chat-button" @click="toggleChatPopup">
        <i class="bi bi-chat-dots-fill"></i>
      </button>
    </div>

    <!-- 登錄頁面 -->
    <LoginPage v-if="showLoginPage" @closeLoginPage="toggleLoginPage" />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-header {
  width: 100%;
  height: 14vh;
  border-bottom: 1px solid lightgray;
  display: flex;
  justify-content: space-between;
}

.app-main {
  flex: 1; /* 填滿剩餘空間 */
  display: flex;
  flex-direction: column;
}

.chat-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  border: none;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 9999;
}

.chat-button:hover {
  background-color: #0056b3;
}
</style>
