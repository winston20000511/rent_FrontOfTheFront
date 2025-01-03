<script setup>
import { RouterView } from 'vue-router';
import { useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import HomeNavbar from '@/components/Home/HomeNavbar.vue'; // 引入 HomeNavbar
import ChatPopup from './components/ChatRoom/ChatRoom.vue';
import LoginPage from './components/User/LoginPage.vue';
import CollectHouseList from './components/houses/CollectHouseList.vue';
import HouseCreate from './components/houses/HouseCreate.vue';
import HouseUpdate from './components/houses/HouseUpdate.vue';
import { useHouseCard } from './stores/CardHouseStore';

const router = useRouter();
const showChatPopup = ref(false);
const toggleChatPopup = () => {
  showChatPopup.value = !showChatPopup.value;
};

const showChatApp = ref(true);
const route = useRoute();
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/order-confirm' || newPath === '/order-complete') {
      showChatApp.value = false;
    } else {
      showChatApp.value = true;
    }
  },
  { immediate: true }
);

const showLoginPage = ref(false); // 控制 LoginPage 的顯示
const toggleLoginPage = () => {
  showLoginPage.value = !showLoginPage.value;
};

const store = useHouseCard();
const markers = ref({});

const addMarker = (locations) => {
  markers.value = locations;
  store.updateData(markers.value.searchList);
  router.push({
    name: 'Home',
    params: { markers: markers.value}
  });
};

</script>

<template>
  <div class="app-container">

    <!-- 全局導航欄 -->
    <header class="app-header">
      <HomeNavbar @signInClicked="toggleLoginPage" @add-marker="addMarker" />
    </header>

    <!-- 主內容 -->
    <main class="app-main">
      <RouterView :markers="markers" @add-marker="addMarker"></RouterView>
    </main>

    <!-- 聊天彈窗和按鈕 -->
    <div>
      <ChatPopup v-if="showChatPopup" class="chat-popup" @close="toggleChatPopup" />
      <button v-if="showChatApp" class="chat-button" @click="toggleChatPopup">
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
  height: 100%;
}

.app-header {
  width: 100%;
  height: 15vh;
  border-bottom: 1px solid lightgray;
  display: flex;
  justify-content: space-between;
}

.app-main {
  width: 100%;
  height: 85vh;
  /* flex: 1; */
  /* 填滿剩餘空間 */
  /* display: flex;
  flex-direction: column; */
}

.chat-button {
  position: fixed;
  bottom: 90px;
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

.chat-popup {
  position: fixed;
  bottom: 140px; /* 根據需要設置，這樣讓它與按鈕有相同的間距 */
  right: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 10000; /* 確保 ChatPopup 顯示在按鈕之上 */
}
</style>
