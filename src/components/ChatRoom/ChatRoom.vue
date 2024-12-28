<template>
  <div :class="['chat-app', { fullscreen }]">
    <!-- sidebar -->
    <div class="sidebar">

      <div class="chat-list">
        <a href="/suggest" class="user-item fake-button">提交您的建議
        </a>
        <div v-for="user in chatUsers" :key="user.userId" class="user-item"
          :class="{ 'selected-user': user.userName === selectedUserName }" @click="selectChat(user)">

          <div class="chatpic">
            <img src="./a.jpg" style="width: auto;">
          </div>
          <div class="user-info">
            <p>{{ user.name }}</p>
            <span v-if="user.userId === 3" class="official-badge">官方</span>
          </div>
        </div>
      </div>
    </div>

    <!-- chat-window -->
    <div class="chat-window">

      <!-- show select user -->
      <div class="current-use">
        {{ selectedUserName || "請選擇一個使用者" }}
        <!-- <h3>{{selectedUserName || "請選擇一個使用者" }}</h3> -->
      </div>

      <!-- switch -->
      <button @click="toggleFullscreen" class="toggle-btn">
        <i v-if=fullscreen class="bi bi-arrows-angle-contract"></i>
        <i v-else class="bi bi-arrows-angle-expand"></i>
      </button>

      <!-- Search -->
      <div class="search-container">
        <input v-model="searchtxt" type="text" placeholder="Search messages..." class="search-input">
        <button @click="searchmsg" class="toggle-search"><i class="bi bi-search"></i></button>
        <div v-if="searchBarVisible" class="search-buttons">
          <button @click="prevMatch" class="toggle-prev">⬆</button>
          <button @click="nextMatch" class="toggle-next">⬇</button>
        </div>
      </div>

      <!-- message bar -->
      <div class="messages" ref="messageContainer">
        <div v-for="(message, index) in messages" :key="index" :class="[
          { 'message-right': message.isSender, 'message-left': message.isReceiver },
          { highlight: index === highlightedIndex }
        ]" :data-index="index">

          <div class="message-text" v-html="highlightText(message.text)"></div>
          <div class="message-timestamp">{{ formatTimestamp(message.timestamp) }}</div>
        </div>
      </div>

      <!-- input MSG -->
      <div class="input">
        <textarea v-model="newMessage" placeholder="Type your message..."></textarea>
        <button @click="sendMessage" class="send-button"><i class="bi bi-send"></i></button>
      </div>

      <slot></slot>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from "vue";
import axios from "axios";
import.meta.env.VITE_APIURL;
import { jwtDecode } from 'jwt-decode';

// Reactive variables
const fullscreen = ref(false);
const currentUser = ref({ userId: '', userName: "" });
const selectedUser = ref(null);
const selectedUserId = ref(null);
const selectedUserName = ref("");
const chatUsers = ref([]);
const messages = ref([]);
const newMessage = ref("");
const messageContainer = ref(null);

//  search variables
const searchtxt = ref("");
const searchBarVisible = ref(false);
const highlightedIndex = ref(-1);
const searchResults = ref([]);

//  handle search bar
let token = localStorage.getItem('jwt');
console.log("JWT 解碼結果:", token);

function initializeCurrentUser() {
  let token = localStorage.getItem('jwt');
  if (!token) {
    console.error("JWT 不存在，請重新登錄");
    return;
  }
  try {
    const decoded = jwtDecode(token);
    console.log("JWT 解碼結果:", decoded);

    currentUser.value.userId = decoded.userId || decoded.sub || '';
    currentUser.value.userName = decoded.username || decoded.name || '';
    console.log("當前用戶信息:",
      'userId:', currentUser.value.userId,
      'name:', currentUser.value.userName);
  } catch (error) {
    console.error("解析 JWT 時出錯:", error);
  }
}
initializeCurrentUser();

// Toggle fullscreen mode
const toggleFullscreen = () => {
  fullscreen.value = !fullscreen.value;
};

// Load chat users
const loadChatUsers = async () => {
  console.log("[Chat] Loading chat users...");
  try {
    const response = await fetch(`${import.meta.env.VITE_APIURL}/messages/list`,
      { headers: { 'authorization': `${token}` } },
    );
    const rawUsers = await response.json();
    const user = chatUsers.value = rawUsers.map(([userId, userName]) => ({
      userId,
      name: userName,
    }),

    );
    if (user) {
      selectedUserId.value = user.userId;
      selectedUserName.value = user.name;
    }
    console.log("[Chat] Chat users loaded:", chatUsers.value);
  } catch (error) {
    console.error("[Chat] Failed to load chat users:", error.message);
  }
};

// Load messages
const loadMessages = async (userId) => {
  console.log(`[Chat] Loading messages for user ${userId}...`);
  console.log('[chat] loading currentUser userid', currentUser.value.userId);


  selectedUser.value = chatUsers.value.find(user => user.userId === userId);
  console.log('Load MSG path', `${import.meta.env.VITE_APIURL}/messages/${currentUser.value.userId}/${userId}`);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APIURL}/messages/${currentUser.value.userId}/${userId}`,
      { headers: { 'authorization': `${token}` } },
    );
    const rawMessages = await response.json();

    //handle MSG type
    messages.value = rawMessages.map((msg) => ({
      text: msg.message,
      timestamp: msg.timestamp,
      isSender: msg.senderName === currentUser.value.userName,
      isReceiver: msg.receiverName === currentUser.value.userName,
    }));
    nextTick(() => scrollToBottom());
  } catch (error) {
    console.error(`[Chat] Failed to load messages for user ${userId}:`, error.message);
  }
};

//find MSG// Search functionality
const toggleSearchBar = () => {
  searchBarVisible.value = !searchBarVisible.value;
};

const searchmsg = () => {
  searchResults.value = messages.value
    .map((msg, index) => ({ index, text: msg.text }))
    .filter(({ text }) => text.toLowerCase().includes(searchtxt.value.toLowerCase()))
    .map(({ index }) => index);

  highlightedIndex.value = searchResults.value.length > 0 ? searchResults.value[0] : -1;
  scrollToHighlighted();
};

const highlightText = (text) => {
  if (!searchtxt.value) return text;
  const regex = new RegExp(`(${searchtxt.value})`, "gi");
  return text.replace(regex, `<span class="highlight-text">$1</span>`);
};

const scrollToHighlighted = () => {
  if (highlightedIndex.value === -1) return;
  const container = messageContainer.value;
  const highlightedElement = container.querySelector(
    `[data-index="${highlightedIndex.value}"]`
  );
  highlightedElement?.scrollIntoView({ behavior: "smooth", block: "center" });
};

const prevMatch = () => {
  if (searchResults.value.length === 0) return;
  const currentIndex = searchResults.value.indexOf(highlightedIndex.value);
  const prevIndex =
    currentIndex === 0 ? searchResults.value.length - 1 : currentIndex - 1;
  highlightedIndex.value = searchResults.value[prevIndex];
  scrollToHighlighted();
};

const nextMatch = () => {
  if (searchResults.value.length === 0) return;
  const currentIndex = searchResults.value.indexOf(highlightedIndex.value);
  const nextIndex =
    currentIndex === searchResults.value.length - 1 ? 0 : currentIndex + 1;
  highlightedIndex.value = searchResults.value[nextIndex];
  scrollToHighlighted();
};

// Format timestamp for display
const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};


// Send a message via WebSocket
const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedUser.value) return;

  const messagePayload = {
    senderId: currentUser.value.userId,
    receiverId: selectedUser.value.userId,
    message: newMessage.value.trim(),
  };
  console.log('check');
  console.log(messagePayload);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APIURL}/messages/send`,
      messagePayload,
      {
        headers: {
          'authorization': `${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    messages.value.push({
      text: response.data.message,
      timestamp: response.data.timestamp,
      isSender: true,
      isReceiver: false,
    });


    newMessage.value = "";
    console.log(`[Chat] Message sent to user ${selectedUser.value.userId}.`);
  } catch (error) {
    console.error(`[Chat] Failed to send message:`, error.message);
  }
};

const selectChat = (user) => {
  loadMessages(user.userId);
};

// Scroll to bottom
const scrollToBottom = () => {
  const container = messageContainer.value;
  if (container) {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }
};

// Lifecycle hooks
onMounted(async () => {
  // const user = getCurrentUserFromJWT();
  await loadChatUsers();
  if (chatUsers.value.length > 0) {
    const firstUser = chatUsers.value[0];
    selectedUserId.value = firstUser.userId;
    selectedUserName.value = firstUser.name;
    await loadMessages(firstUser.userId);
  }
});

onUnmounted(() => {
  // Additional cleanup logic can be added here if necessary
});
</script>


<style scoped>
@import './chat.css';

/* popup model */
.chat-app {
  display: flex;
  flex-direction: row;
  position: fixed;
  right: 0%;
  bottom: 8%;
  width: 50%;
  height: 60%;
  border: 10px solid transparent;
  border-image: url('https://png.pngtree.com/thumb_back/fw800/background/20210826/pngtree-plant-golden-line-rectangular-leaf-pattern-background-image_770549.jpg') 30 round;
  background-color: #ffffff;
  border-radius: 18px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 9999;
}

.chat-list {
  flex: 0 0 25%;
  overflow-y: auto;
  border-right: 1px solid #ddd;
}

.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.input {
  display: grid;
  grid-template-columns: 90% 10%;
  align-items: center;
  width: 100%;
  height: 10%;
  border-top: 1px solid #ddd;
  box-sizing: border-box;
}


.user-item {
  padding: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  border: 1px solid #cccccc;
  border-radius: 4px;
  text-align: center;
}

.user-item:hover {
  background-color: #e0f0ff;
}

.selected-user {
  /* background-color: #007bff; */
  color: white;
  font-weight: bold;
}

/* fullscreen */
.fullscreen {
  container: 100%;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100%;
  height: 100%;
  z-index: 9999;

  box-shadow: none;
  border-radius: 0;
  background-color: #fff;

  .chat-button {
    display: none;
  }
}

.toggle-search {
  position: absolute;
  top: 0%;
  right: 5%;
  cursor: pointer;
  border: none;
  padding: 5px 10px;
}

.toggle-btn {
  position: absolute;
  top: 0%;
  right: 0%;

  padding: 5px 10px;
  /*background-color: #007bff;*/
  color: #17ad67;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* .toggle-btn:hover {
  background-color: #57a5f8;
} */

/* input end ???? */
.fake-button {
  text-decoration: none;
  color: rgb(238, 30, 30);
  font-size: large;
  background-color: white;
  width: 100%;
  height: 50px;
}


/** test ***********************/
/* 預設的使用者樣式 */
.user-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: background-color 0.3s;
}

/* 選中的使用者樣式 */
.user-item.selected-user {
  background-color: #f0f8ff;
}

/* 官方人員樣式 */
.user-item.official-user {
  background-color: #fff5f5;
  border-left: 4px solid red;
}

/* 官方標籤樣式 */
.official-badge {
  font-size: 12px;
  color: white;
  background-color: red;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
}

/* 滑鼠懸停效果 */
.user-item:hover {
  background-color: #f9f9f9;
}

/* 圖片容器 */
.chatpic img {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  object-fit: cover;
}

.chatpic {
  min-width: 50px;
}

/* 使用者資訊容器 */
.user-info {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
</style>
