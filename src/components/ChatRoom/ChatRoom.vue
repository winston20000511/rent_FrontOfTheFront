<template>
  <div :class="['chat-app', { fullscreen }]" :style="position" @mousedown="startDrag" ref="chatApp">
    <!-- Chat application container -->

    <!-- sidebar -->
    <div class="sidebar">
      <div class="search-container">
        <input v-model="userSearchText" type="text" placeholder="Search users..." class="search-input">
        <button @click="handleUserSearch" class="toggle-search"><i class="bi bi-search"></i></button>
      </div>

      <!-- User list section -->
      <div class="chat-list">
        <a href="/suggest" class="user-item fake-button">提交建議</a>
        <div v-for="user in filteredUsers" :key="user.userId" class="user-item"
          :class="{ 'selected-user': user.userName === selectedUserName }" @click="selectChat(user)">
          <div class="chatpic">

            <img :src="user.picture
              ? `data:image/jpeg;base64,${transformPicture(user.picture)}`
              : '/src/assets/no-photo.png'" style="width: auto;" @error="handleImageError" class="chatpic"/>
          </div>
          <div class="user-info">
            <p v-html="highlightUserName(user.name)"></p>
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
      </div>

      <!-- switch -->
      <button @click="toggleFullscreen" class="toggle-btn">
        <i v-if=fullscreen class="bi bi-arrows-angle-contract"></i>
        <i v-else class="bi bi-arrows-angle-expand"></i>
      </button>

      <!-- Message Search -->
      <div class="search-container">
        <input v-model="messageSearchText" type="text" placeholder="Search messages..." class="search-input">
        <button @click="handleMessageSearch" class="toggle-search"><i class="bi bi-search"></i></button>
        <div v-if="searchBarVisible" class="search-buttons">
          <button @click="prevMatch" class="toggle-prev">⬆</button>
          <button @click="nextMatch" class="toggle-next">⬇</button>
        </div>
      </div>

      <!-- message bar -->
      <div class="messages" ref="messageContainer">
        <div v-for="(message, index) in messages" :key="index" :class="[
          'message-container',
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
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from "vue";
import axios from "axios";
import.meta.env.VITE_APIURL;
import { jwtDecode } from 'jwt-decode';

// Reactive variables
//test end 

//layout
const fullscreen = ref(false);
const currentUser = ref({ userId: '', userName: "" });
const selectedUser = ref(null);
const selectedUserId = ref(null);
const selectedUserName = ref("");

const chatUsers = ref([]);
const messages = ref([]);
const newMessage = ref("");
const messageContainer = ref(null);

// Search variables for messages
const messageSearchText = ref("");
const searchBarVisible = ref(false);
const highlightedIndex = ref(-1);
const searchResults = ref([]);

// Search variables for users
const userSearchText = ref("");

// set time out
const messageTimer = ref(null);
const userListTimer = ref(null);

// Computed property for filtered users
const filteredUsers = computed(() => {
  if (!userSearchText.value) return chatUsers.value;
  const searchTerm = userSearchText.value.toLowerCase();
  return chatUsers.value.filter(user =>
    user.name.toLowerCase().includes(searchTerm)
  );
});

let token = localStorage.getItem('jwt');

function initializeCurrentUser() {
  let token = localStorage.getItem('jwt');
  if (!token) {
    console.error("JWT 不存在，請重新登錄");
    return;
  }
  try {
    const decoded = jwtDecode(token);
    currentUser.value.userId = decoded.userId || decoded.sub || '';
    currentUser.value.userName = decoded.username || decoded.name || '';
  } catch (error) {
    console.error("解析 JWT 時出錯:", error);
  }
}

const toggleFullscreen = () => {
  fullscreen.value = !fullscreen.value;
};
const loadChatUsers = async () => {
  try {
    const currentSelectedUserId = selectedUserId.value;
    
    const response = await fetch(`${import.meta.env.VITE_APIURL}/messages/list`,
      { headers: { 'authorization': `${token}` } },
    );
    const rawUsers = await response.json();

    const userDetailsPromises = rawUsers.map(async ([userId, userName]) => {
      try {
        const userResponse = await fetch(
          `${import.meta.env.VITE_APIURL}/user/userSimpleInfo`,
          { method: 'POST',headers: {'authorization': `${token}`, }},
        );
        if (!userResponse.ok) {
          throw new Error(`HTTP error! status: ${userResponse.status}`);
        }
        const userDetails = await userResponse.json();
        // console.log('User details received:', userDetails);
        return {
          userId,
          name: userName,
          picture: userDetails.picture
        };
      } catch (error) {
        console.error(`Failed to load user details for ${userName}:`, error);
        return {
          userId,
          name: userName,
          picture: null
        };
      }
    });

    const usersWithDetails = await Promise.all(userDetailsPromises);
    chatUsers.value = usersWithDetails;
    if (!currentSelectedUserId && chatUsers.value.length > 0) {
      const firstUser = chatUsers.value[0];
      selectedUserId.value = firstUser.userId;
      selectedUserName.value = firstUser.name;
    } else if (currentSelectedUserId) {

      const currentUser = chatUsers.value.find(user => user.userId === currentSelectedUserId);
      if (currentUser) {
        selectedUserId.value = currentUser.userId;
        selectedUserName.value = currentUser.name;
      }
    }
  } catch (error) {
    console.error("[Chat] Failed to load chat users:", error.message);
  }
};

const handleImageError = (event) => {
  event.target.src = '/src/assets/no-photo.png';
};

const transformPicture = (picture) => {
  if (!picture) return null;
  try {

    if (picture.startsWith('data:image')) {
      return picture.split(',')[1];
    }

    if (typeof picture === 'string') {
      return picture;
    }

    return btoa(
      String.fromCharCode.apply(null, new Uint8Array(picture))
    );
  } catch (error) {
    console.error('Error transforming picture:', error);
    return null;
  }
};

const startUserListPolling = () => {

  if (userListTimer.value) {
    clearInterval(userListTimer.value);
  }

  userListTimer.value = setInterval(() => {
    loadChatUsers();
  }, 5000);
};

const loadMessages = async (userId) => {
  selectedUser.value = chatUsers.value.find(user => user.userId === userId);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APIURL}/messages/${currentUser.value.userId}/${userId}`,
      { headers: { 'authorization': `${token}` } },
    );
    const rawMessages = await response.json();
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
const startMessagePolling = (userId) => {
  if (messageTimer.value) {
    clearInterval(messageTimer.value);
  }
  messageTimer.value = setInterval(() => {
    if (userId) {
      loadMessages(userId);
    }
  }, 5000); 
};

// Message search functions
const handleMessageSearch = () => {
  searchMessages();
  toggleSearchBar();
};

watch(messageSearchText, (newVal) => {
  if (newVal.trim()) {
    searchMessages();
  } else {
    searchBarVisible.value = false;
    highlightedIndex.value = -1;
    searchResults.value = [];
  }
});
watch(userSearchText, (newVal) => {
  if (newVal.trim()) {
    searchBarVisible.value = true;
  } else {
    searchBarVisible.value = false;
  }
});
const toggleSearchBar = () => {
  searchBarVisible.value = !searchBarVisible.value;
};

const searchMessages = () => {
  if (!messageSearchText.value.trim()) {
    searchBarVisible.value = false;
    highlightedIndex.value = -1;
    searchResults.value = [];
    return;
  }

  const searchTerm = messageSearchText.value.trim().toLowerCase();
  searchResults.value = messages.value
    .map((message, index) => ({
      text: message.text,
      index
    }))
    .filter(({ text }) => text.toLowerCase().includes(searchTerm));

  if (searchResults.value.length > 0) {
    highlightedIndex.value = searchResults.value[0].index;
    scrollToMessage(highlightedIndex.value);
    searchBarVisible.value = true;
  } else {
    highlightedIndex.value = -1;
    searchBarVisible.value = false;
  }
};

// User search function
const handleUserSearch = () => {
  // The filtering is handled by the computed property filteredUsers
  // This function can be used for additional search-related functionality if needed
};
const highlightUserName = (name) => {
  if (!userSearchText.value) return name;
  const searchTerm = userSearchText.value;
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return name.replace(regex, '<span class="highlight-text">$1</span>');
};
const highlightText = (text) => {
  if (!messageSearchText.value.trim()) return text;
  const searchTerm = messageSearchText.value.trim();
  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
  return text.replace(regex, '<span class="highlight-text">$1</span>');
};

const scrollToMessage = (index) => {
  const messageElement = document.querySelectorAll('.message-container')[index];
  if (messageElement) {
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const prevMatch = () => {
  if (searchResults.value.length === 0) return;
  const currentIndex = searchResults.value.findIndex(result => result.index === highlightedIndex.value);
  const prevIndex = (currentIndex - 1 + searchResults.value.length) % searchResults.value.length;
  highlightedIndex.value = searchResults.value[prevIndex].index;
  scrollToMessage(highlightedIndex.value);
};

const nextMatch = () => {
  if (searchResults.value.length === 0) return;
  const currentIndex = searchResults.value.findIndex(result => result.index === highlightedIndex.value);
  const nextIndex = (currentIndex + 1) % searchResults.value.length;
  highlightedIndex.value = searchResults.value[nextIndex].index;
  scrollToMessage(highlightedIndex.value);
};

const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedUser.value) return;

  const messagePayload = {
    senderId: currentUser.value.userId,
    receiverId: selectedUser.value.userId,
    message: newMessage.value.trim(),
  };

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APIURL}/messages/send`,
      messagePayload,
      { headers: {'authorization': `${token}`,'Content-Type': 'application/json' }, }
    );

    messages.value.push({
      text: response.data.message,
      timestamp: response.data.timestamp,
      isSender: true,
      isReceiver: false,
    });

    newMessage.value = "";
  } catch (error) {
    console.error(`[Chat] Failed to send message:`, error.message);
  }
};

const selectChat = (user) => {
  selectedUser.value = user;
  selectedUserId.value = user.userId;
  selectedUserName.value = user.name;

  messageSearchText.value = "";  
  userSearchText.value = "";     
  searchBarVisible.value = false; 
  highlightedIndex.value = -1;   
  searchResults.value = [];      

  loadMessages(user.userId);
  startMessagePolling(user.userId);
  
};

const scrollToBottom = () => {
  const container = messageContainer.value;
  if (container) {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }
};

onMounted(async () => {
  initializeCurrentUser();
  await loadChatUsers();
  startUserListPolling();

  if (!selectedUserId.value && chatUsers.value.length > 0) {
    const firstUser = chatUsers.value[0];
    selectChat(firstUser);
  }
});

onUnmounted(() => {
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);

  if (messageTimer.value) {
    clearInterval(messageTimer.value);
  }
  if (userListTimer.value) {
    clearInterval(userListTimer.value);
  }
});
</script>

<style scoped>
@import './chat.css';

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
  color: white;
  font-weight: bold;
}

.fullscreen .chat-button {
  display: none;
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
  color: #17ad67;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.fake-button {
  text-decoration: none;
  color: rgb(238, 30, 30);
  font-size: large;
  background-color: white;
  width: 100%;
  height: 50px;
}

.highlight-text {
  background-color: #ffc107;
  font-weight: bold;
  color: #000;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-item.selected-user {
  background-color: #f0f8ff;
}

.user-item.official-user {
  background-color: #fff5f5;
  border-left: 4px solid red;
}

.official-badge {
  font-size: 12px;
  color: white;
  background-color: red;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
}

.user-item:hover {
  background-color: #f9f9f9;
}

.chatpic img {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  object-fit: cover;
}
.chatpic {
 min-width: 50px;
}
.user-info {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

/*test */
.highlight {
  background-color: rgba(255, 235, 59, 0.2);
  border-radius: 4px;
}

.highlight-text {
  background-color: #ffc107;
  color: #000;
  font-weight: bold;
  padding: 2px 4px;
  border-radius: 2px;
  display: inline-block;
}

.message-container.highlight {
  animation: pulse 1s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.02);
  }

  100% {
    transform: scale(1);
  }
}

/* 确保消息容器样式正确 */
.message-text {
  word-break: break-word;
  white-space: pre-wrap;
}

.user-info p {
  margin: 0;
  padding: 0;
}
</style>