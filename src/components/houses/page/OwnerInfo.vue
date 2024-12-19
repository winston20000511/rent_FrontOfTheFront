<template>
  <div class="owner-info-container">
    <div class="owner-info">
      <img :src="'data:image/jpeg;base64,' + ownerInfo.picture" alt="屋主照片" class="owner-avatar" />
      <div class="owner-details">
        <p class="owner-name">{{ ownerInfo.name }}</p>
        <p class="owner-phone">{{ ownerInfo.phone }}</p>
      </div>
    </div>

    <div class="appointment-time">
      <button @click="loadBookingView" class="send-button btn btn-info">預約看房</button>
      <BookingView v-if="showBookingView" :isVisible="showBookingView" @closeView="closeBookingView"
        :houseId="houseId" />
    </div>

    <div class="message-section">
      <button @click="sendMessage" class="send-message-button">发送信息</button>
    </div>

  </div>
</template>

<script>
import BookingView from '@/View/BookingView.vue';

export default {
  components: {
    BookingView,
  },
  props: {
    houseId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      ownerInfo: {
        name: "",
        phone: "",
        picture: "", // Base64 編碼的图片
      },
      appointmentTime: "",
      showBookingView: false,
    };
  },
  methods: {
    sendMessage() {
      alert(
        `发送信息给 ${this.ownerInfo.name}，预约时间：${this.appointmentTime}`
      );
    },
    // 使用 fetch 獲取屋主信息
    async fetchOwnerInfo() {
      try {
        const token = localStorage.getItem("jwt"); // 假設 token 存在 localStorage 中
        if (!token) {
          throw new Error("未找到 token");
        }
        const response = await fetch(
          `http://localhost:8080/api/houses/owner/${this.houseId}`,
          {
            method: "GET",
            headers: { Authorization: ` ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error("網路請求失敗");
        }
        const data = await response.json();
        this.ownerInfo = data; // 将返回的数据赋值给 ownerInfo
      } catch (error) {
        console.error("獲取屋主信息失敗:", error);
      }
    }, loadBookingView() {
      this.showBookingView = true;
    },
    closeBookingView() {
      this.showBookingView = false;
    },
  },
  data() {
    return {
      ownerInfo: {
        name: "",
        phone: "",
        picture: "", // Base64 編碼的圖片
      },
      appointmentTime: "",
      showBookingView: false,
    };
  },
  created() {
    this.fetchOwnerInfo(); // 獲取屋主信息
  },
};
</script>

<style scoped>
.owner-info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.owner-info {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.owner-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.owner-details {
  display: flex;
  flex-direction: column;
}

.owner-name {
  font-size: 18px;
  font-weight: bold;
}

.owner-phone {
  font-size: 14px;
  color: #555;
}

.appointment-section {
  margin-bottom: 20px;
}

.send-message-button {
  background-color: #3579c0;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.send-message-button:hover {
  background-color: #0056b3;
}
</style>
