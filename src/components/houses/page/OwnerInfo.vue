<template>
  <div class="owner-info-container">
    <div v-if="ownerInfo" class="owner-basic">
      <Avatar 
        :image="ownerInfo.picture || '/src/assets/no-photo.png'" 
        size="large" 
        shape="circle" 
        class="owner-avatar"
        @error="handleImageError" 
      />
      <div class="owner-text">
        <p class="owner-name">{{ ownerInfo.name }}</p>
        <p class="owner-phone">{{ ownerInfo.phone }}</p>
      </div>
    </div>
    <div v-else class="loading-owner">正在加載屋主資訊...</div>

    <div class="owner-actions flex gap-2">
      <Button 
        v-if="!isOwner" 
        label="傳送訊息" 
        icon="pi pi-comments" 
        class="p-button-outlined p-button-warning" 
        @click="SendMsgDialog=true" 
      />
      <Button 
        v-if="!isOwner" 
        label="預約看房" 
        icon="pi pi-calendar-plus" 
        class="p-button-warning" 
        @click="openBookingView" 
      />
    </div>

    <!-- BookingView 彈窗 -->
    <BookingView 
      v-if="showBookingView" 
      :isVisible="showBookingView" 
      @closeView="closeBookingView" 
      :houseId="houseId" 
    />

    <Dialog 
      :visible="SendMsgDialog" 
      :modal="true" 
      :dismissableMask="false" 
      header="傳送訊息給房東" 
      class="dialog-theme"
    >
      <div class="dialog-theme">
        <input 
          v-model="message" 
          type="text" 
          placeholder="请输入消息..."
          class="message-input"
        >
        <button @click="handleSendMessage" class="send-button">發送</button>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Button from "primevue/button";
import Avatar from "primevue/avatar";
import BookingView from "@/View/BookingView.vue";
import axios from "axios";
import Dialog from 'primevue/dialog';

export default {
  components: {
    BookingView,
    Button,
    Avatar,
    Dialog,
  },
  props: {
    houseId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      message: '',
      ownerInfo: null,
      showBookingView: false,
      SendMsgDialog: false,
      isOwner: false,
    };
  },
  mounted() {
    this.fetchOwnerInfo();
  },
  methods: {
    async handleSendMessage() {
      if (!this.message.trim()) {
        alert('請輸入訊息');
        return;
      }

      console.log("[ownerInfo]arrival send function");

      const token = localStorage.getItem("jwt");
      console.log(localStorage.getItem("jwt"));

      if (!token) {
        return alert("未登入");
      }
      
      const decodedToken = this.parseJwt(token);
      if (!decodedToken) {
        return alert("JWT 解析錯誤，請重新登入");
      }

      console.log("current login userId:", decodedToken.userId);
      console.log("owner userId:", this.ownerInfo.userId);

      const messagePayload = {
        senderId: decodedToken.userId,
        receiverId: this.ownerInfo.userId,
        message: this.message.trim(),
      };

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APIURL}/messages/send`,
          messagePayload,
          {
            headers: {
              authorization: `${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert("訊息已發送!");
        this.message = '';
        this.SendMsgDialog = false;
      } catch (error) {
        console.error(`[Chat] Failed to send message:`, error.message);
        alert("發送失敗，請稍後再試");
      }
    },

    parseJwt(token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error("JWT 解析失敗:", error);
        return null;
      }
    },

    handleImageError(event) {
      event.target.src = '/src/assets/no-photo.png';
    },

    async fetchOwnerInfo() {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          throw new Error("未找到 token");
        }

        const userIdFromToken = this.parseUserIdFromToken(token);

        const resp = await fetch(
          `http://localhost:8080/api/houses/ownerInfo/${this.houseId}`,
          {
            method: "GET",
            headers: { Authorization: token },
          }
        );
        
        if (!resp.ok) {
          const errorText = await resp.text();
          console.error("API 請求失敗:", errorText);
          throw new Error(errorText || "未知錯誤");
        }
        
        const data = await resp.json();

        this.ownerInfo = {
          userId: data.userId || "",
          name: data.name || "",
          phone: data.phone || "",
          picture: data.picture
            ? `data:image/jpeg;base64,${btoa(
              String.fromCharCode(...new Uint8Array(data.picture))
            )}`
            : "/src/assets/no-photo.png",
        };

        this.isOwner = userIdFromToken === this.ownerInfo.userId;
      } catch (error) {
        console.error("取得屋主資訊失敗:", error);
      }
    },

    parseUserIdFromToken(token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        return decodedPayload.userid || "";
      } catch (e) {
        console.error("無法解析 TOKEN:", e);
        return "";
      }
    },

    openBookingView() {
      this.showBookingView = true;
    },

    closeBookingView() {
      this.showBookingView = false;
    },
  },
};
</script>

<style scoped>
.owner-info-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.owner-basic {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.owner-avatar {
  width: 80px;
  height: 80px;
  border: 2px solid #ff9800;
}

.owner-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.owner-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.owner-name {
  font-weight: bold;
  font-size: 1.2rem;
  color: #4e342e;
  margin: 0;
}

.owner-phone {
  color: #616161;
  margin: 0;
}

.loading-owner {
  text-align: center;
  color: #757575;
}

.dialog-theme {
  border-radius: 10px;
  background-color: #e3f2fd;
  padding: 10px;
}

/* 新增的样式 */
.message-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.send-button {
  background-color: #ff9800;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.send-button:hover {
  background-color: #f57c00;
}
</style>