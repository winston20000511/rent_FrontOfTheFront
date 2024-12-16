<template>
  <div :class="['chat-app', { fullscreen }]">
    <!-- sidebar -->
    <div class="sidebar">
      <div class="chat-list">
        <div v-for="user in chatUsers" :key="user.userId" class="user-item" 
        :class="{'selected-user': user.userName === selectedUserName}"
        @click="selectChat(user)">
          {{ user.name }}
        </div>
      </div>
    </div>

    <!-- chat-window -->
    <div class="chat-window">
      <!-- show selsct user -->
       <div class="current-use">
        {{selectedUserName || "請選擇一個使用者" }}
        <!-- <h3>{{selectedUserName || "請選擇一個使用者" }}</h3> -->
      </div>

      <!-- switch -->
      <button @click="toggleFullscreen" class="toggle-btn">
        {{ fullscreen ? '彈窗' : '全螢幕' }}
      </button>

      <!-- message bar -->
      <div class="messages" ref="messageContainer">
        <div v-for="(message, index) in messages" :key="index" :class="{
          'message-right': message.isSender,
          'message-left': message.isReceiver
        }">
          <div class="message-text">{{ message.text }}</div>
          <div class="message-timestamp">{{ formatTimestamp(message.timestamp) }}</div>
        </div>

        <!-- display pic -->
        <!-- display text -->
        <!-- time  -->
        <!-- if null -->
      </div>

      <!-- input MSG -->
      <div class="input">
        <textarea v-model="newMessage" placeholder="Type your message..."></textarea>
        <button @click="sendMessage">Send</button>
      </div>

      <slot></slot>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted ,nextTick} from "vue";
import axios from "axios";
import.meta.env.VITE_APIURL;

// Reactive variables
const fullscreen = ref(false);
const currentUser = ref({ userId: 51, userName: "" });
const selectedUser = ref(null);
const selectedUserId = ref(null);
const selectedUserName = ref("");
const chatUsers = ref([]);
const messages = ref([]);
const newMessage = ref("");
const messageContainer = ref(null);

// Toggle fullscreen mode
const toggleFullscreen = () => {
  fullscreen.value = !fullscreen.value;
};

// Load chat users via REST API
const loadChatUsers = async () => {
  console.log("[Chat] Loading chat users...");
  try {
    const response = await fetch(`${import.meta.env.VITE_APIURL}/messages/list`);
    const rawUsers = await response.json();
    const user =  chatUsers.value = rawUsers.map(([userId, userName]) => ({
      userId,
      name: userName,
    }));
    if (user) {
    selectedUserId.value = user.userId;
    selectedUserName.value = user.name;
  }
    console.log("[Chat] Chat users loaded:", chatUsers.value);
  } catch (error) {
    console.error("[Chat] Failed to load chat users:", error.message);
  }
};

// Load messages via REST API
const loadMessages = async (userId) => {
  console.log(`[Chat] Loading messages for user ${userId}...`);
  selectedUser.value = chatUsers.value.find(user => user.userId === userId);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APIURL}/messages/${currentUser.value.userId}/${userId}`
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

// Format timestamp for display
const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};


// Send a message via WebSocket
const sendMessage  = async  () => {
  if (!newMessage.value.trim() || !selectedUser.value) return;

const messagePayload = {
  senderId: currentUser.value.userId,
  receiverId: selectedUser.value.userId,
  message: newMessage.value.trim(),
};

try {
  const response = await axios.post(
    `${import.meta.env.VITE_APIURL}/messages/send`,
    messagePayload
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


<style>
@import './chat.css';

/* popup model */
.chat-app {
  /* border: 10px solid red; */
  background-color: white !important;


  display: flex;

  position: fixed;
  right: 0%;
  bottom: 15%;
  width: 50%;
  height: 60%;


  position: fixed;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 18px;
  overflow: hidden;
  background-color: #fff;
  z-index: 9999;
}

.chat-window {
  /* border: 10px solid blue; */
}

.user-item {
  padding: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
}

.user-item:hover {
  background-color: #e0f0ff;
}

.selected-user {
  background-color: #007bff;
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

.toggle-btn {
  position: absolute;
  top: 0%;
  right: 0%;

  /* padding: 5px 10px; */
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* .toggle-btn:hover {
  background-color: #57a5f8;
} */

/* input end ???? */
</style>
