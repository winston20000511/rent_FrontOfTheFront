<script setup>
import { RouterView } from 'vue-router';
import { ref } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import ChatPopup from './components/ChatRoom/ChatRoom.vue';

const showChatPopup = ref(false);
const toggleChatPopup = () => {
  showChatPopup.value = !showChatPopup.value;
};
</script>

<template>
  <div class="app-container">
    <!-- RouterView 區域 -->
    <div class="router-view-wrapper">
      <RouterView />
    </div>

    <!-- 聊天按鈕和聊天彈窗 -->
    <ChatPopup v-if="showChatPopup" @close="toggleChatPopup" />
    <button class="chat-button" @click="toggleChatPopup">
      <i class="bi bi-chat-dots-fill"></i>
    </button>
  </div>
</template>

<style>
/* 主容器樣式 */
.app-container {
  display: flex;
  justify-content: center; /* 水平置中 */
  align-items: flex-start; /* 靠上對齊 */
  height: 100vh; /* 佔滿視窗高度 */
  position: relative; /* 為浮動按鈕提供定位基準 */
  padding: 20px; /* 添加內距 */
  box-sizing: border-box;
}

/* RouterView 包裹層 */
.router-view-wrapper {
  max-width: 1200px; /* 最大寬度 */
  width: 100%; /* 撐滿父容器 */
  padding: 20px; /* 內距 */
  box-sizing: border-box;
  background-color: #ffffff; /* 白色背景 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 添加陰影 */
  border-radius: 10px; /* 圓角 */
  z-index: 1; /* 保證在聊天按鈕下方 */
}

/* 聊天按鈕樣式 */
.chat-button {
  position: fixed; /* 固定定位 */
  bottom: 20px; /* 距離視窗底部 20px */
  right: 20px; /* 距離視窗右側 20px */
  width: 50px;
  height: 50px;
  border-radius: 50%; /* 圓形按鈕 */
  background-color: #007bff; /* 藍色背景 */
  color: white;
  border: none;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 9999; /* 保證按鈕在最上層 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 陰影 */
}

.chat-button:hover {
  background-color: #0056b3; /* 深藍色背景 */
}
@media (max-width: 768px) {
  .router-view-wrapper {
    max-width: 90%; /* 縮小內容寬度 */
    padding: 10px; /* 減小內距 */
  }

  .chat-button {
    width: 40px;
    height: 40px;
    font-size: 16px; /* 調整按鈕大小 */
  }
}

</style>
