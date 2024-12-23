<!-- src/components/houses/page/OwnerInfo.vue -->
<template>
  <div class="owner-info-container">
    <div v-if="ownerInfo" class="owner-basic">
      <Avatar
        :image="ownerInfo.picture || '/src/assets/img/default-avatar.jpg'"
        size="large"
        shape="circle"
        class="owner-avatar"
      />
      <div class="owner-text">
        <p class="owner-name">{{ ownerInfo.name }}</p>
        <p class="owner-phone">{{ ownerInfo.phone }}</p>
      </div>
    </div>
    <div v-else class="loading-owner">正在加載屋主資訊...</div>

    <div class="owner-actions flex gap-2">
      <Button
        label="預約看房"
        icon="pi pi-calendar-plus"
        class="p-button-warning"
        @click="openBookingView"
      />
      <Button
        label="傳送訊息"
        icon="pi pi-comments"
        class="p-button-outlined p-button-warning"
        @click="sendMessage"
      />
    </div>

    <!-- BookingView 彈窗 -->
    <BookingView
      v-if="showBookingView"
      :isVisible="showBookingView"
      @closeView="closeBookingView"
      :houseId="houseId"
    />
  </div>
</template>

<script>

import Button from "primevue/button";
import Avatar from "primevue/avatar";
import BookingView from "@/View/BookingView.vue";

export default {
  components: {
    BookingView,
    Button,
    Avatar,
  },
  props: {
    houseId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      ownerInfo: null,
      showBookingView: false,
    };
  },
  mounted() {
    this.fetchOwnerInfo();
  },
  methods: {
    async fetchOwnerInfo() {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          throw new Error("未找到 token");
        }
        const resp = await fetch(
          `http://localhost:8080/api/houses/ownerInfo/${this.houseId}`,
          {
            method: "GET",
            headers: { Authorization: token },
          }
        );
        if (!resp.ok) throw new Error("API 請求失敗");
        const data = await resp.json();
        this.ownerInfo = {
          userId: data.userId || "",
          name: data.name || "",
          phone: data.phone || "",
          picture: data.picture
            ? `data:image/jpeg;base64,${btoa(
                new Uint8Array(data.picture).reduce(
                  (acc, byte) => acc + String.fromCharCode(byte),
                  ""
                )
              )}`
            : "",
        };
      } catch (error) {
        console.error("取得屋主資訊失敗:", error);
      }
    },
    openBookingView() {
      this.showBookingView = true;
    },
    closeBookingView() {
      this.showBookingView = false;
    },
    sendMessage() {
      alert(`已發送訊息給 ${this.ownerInfo.name}`);
    },
  },
};
</script>

<style scoped>
.owner-info-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.owner-basic {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.owner-avatar {
  width: 80px;
  height: 80px;
  border: 2px solid #ff9800; /* Amber 邊框 */
}

.owner-text {
  display: flex;
  flex-direction: column;
}

.owner-name {
  font-weight: bold;
  font-size: 1.2rem;
  color: #4e342e; /* 深咖啡色 */
  margin: 0;
}

.owner-phone {
  color: #616161;
  margin: 0;
}

.owner-actions {
  display: flex;
  gap: 1rem;
}

.loading-owner {
  text-align: center;
  color: #757575;
}
</style>
