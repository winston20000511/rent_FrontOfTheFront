



<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { ref } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';

// chat room
import ChatPopup from './components/ChatRoom/ChatRoom.vue';
const showChatPopup = ref(false);
const toggleChatPopup = () => {
  showChatPopup.value = !showChatPopup.value;
};
// chat room end



</script>

<template>
  <RouterView></RouterView>

  
  <!-- chat popup start -->
  <ChatPopup v-if="showChatPopup" @close="toggleChatPopup" />
  <button class="chat-button" @click="toggleChatPopup">
    聊天
  </button>
  <!-- chat popup end-->


</template>
<style>
/* 這裡可以添加你自定義的樣式 */

* {
  border: 1px solid red; 
}

/* chat room start */
#app {
  background-color: #f4f4f4;
  height: 100vh;
}

body {
  margin: 0;
  padding: 0;
  /* background-color: #f4f4f4; */
}

.chat-button {
  position: fixed;
  bottom: 0%;
  right: 1%;
  background-color: #ff226c;
  color: white;
  border: none;
  border-radius: 20%;
  width: 50px;
  height: 50px;
  cursor: pointer;

  font-weight: bold;
  z-index: 9999;
}

/* chat room end*/
</style>
<style scoped></style>