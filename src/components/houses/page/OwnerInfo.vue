<template>
  <div class="owner-info-container">
    <div class="owner-info">
      <img :src="ownerInfo.picture" alt="屋主照片" class="owner-avatar" />
      <div class="owner-details">
        <p class="owner-name">{{ ownerInfo.name }}</p>
        <p class="owner-phone">{{ ownerInfo.phone }}</p>
      </div>
    </div>

    <div class="appointment-time">
      <button @click="loadBookingView" class="send-button btn btn-info">
        預約看房
      </button>
      <BookingView
        v-if="showBookingView"
        :isVisible="showBookingView"
        @closeView="closeBookingView"
        :houseId="houseId"
      />
    </div>

    <div class="message-section">
      <button @click="sendMessage" class="send-message-button">发送信息</button>
    </div>
  </div>
</template>

<script>
import BookingView from "@/View/BookingView.vue";

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
        userId: "",
        name: "",
        phone: "",
        picture: "", // Base64 编码的图片
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
    // 使用 fetch 获取屋主信息
    async fetchOwnerInfo() {
      try {
        const token = localStorage.getItem("jwt"); // 假设 token 存在 localStorage 中
        if (!token) {
          throw new Error("未找到 token");
        }
        const response = await fetch(
          `http://localhost:8080/api/houses/ownerInfo/${this.houseId}`,
          {
            method: "GET",
            headers: { Authorization: `${token}` },
          }
        );
        if (!response.ok) throw new Error("API 请求失败");

        const data = await response.json();
        this.ownerInfo.name = data.name;
        this.ownerInfo.phone = data.phone;
        this.ownerInfo.userId = data.userId;
        // 将 byte[] 转换为 Base64 字符串
        if (data.picture) {
          const base64String = btoa(
            new Uint8Array(data.picture).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
          this.ownerInfo.picture = `data:image/jpeg;base64,${base64String}`;
        } else {
          this.ownerInfo.picture = "/path/to/default-avatar.jpg";
        }
      } catch (error) {
        console.error("获取屋主信息失败:", error);
      }
    },
    loadBookingView() {
      this.showBookingView = true;
    },
    closeBookingView() {
      this.showBookingView = false;
    },
  },
  created() {
    this.fetchOwnerInfo(); // 获取屋主信息
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
