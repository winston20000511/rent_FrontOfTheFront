<template>
  <div class="title-card">
    <!-- 加載中顯示 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>正在載入標題...</p>
    </div>

    <!-- 錯誤訊息處理 -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <!-- 房屋標題顯示區塊 -->
    <div v-if="title && !isLoading && !error" class="title-content">
      <h1>{{ title }}</h1>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    houseId: {
      type: Number,
      required: true, // 從父組件傳入的 houseId，確保必填
    },
  },
  data() {
    return {
      title: "", // 存放從後端獲取的房屋標題
      error: "", // 錯誤訊息
      isLoading: true, // 加載狀態
    };
  },
  created() {
    this.fetchHouseTitle(); // 組件創建時發送請求
  },
  methods: {
    // 使用 Fetch API 獲取房屋標題
    async fetchHouseTitle() {
      this.error = ""; // 清空錯誤訊息
      this.isLoading = true; // 開始加載
      try {
        const token = localStorage.getItem("jwt"); // 假設 token 存在 localStorage 中
        if (!token) {
          throw new Error("未找到驗證令牌，請重新登入。");
        }
        const response = await fetch(
          `http://localhost:8080/api/houses/Title/${this.houseId}`,
          {
            method: "GET",
            headers: { Authorization: `${token}` }, // 修正 Bearer 前綴
          }
        );
        if (!response.ok) {
          throw new Error("無法獲取標題，錯誤代碼：" + response.status);
        }
        this.title = await response.text(); // 獲取標題文字
      } catch (err) {
        this.error = err.message || "發生未知錯誤";
      } finally {
        this.isLoading = false; // 結束加載
      }
    },
  },
};
</script>

<style scoped>
.title-card {
  max-width: 600px;
  margin: 40px auto;
  padding: 25px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  position: relative;
}

.title-content h1 {
  font-size: 2.5em;
  color: #333333;
  text-align: center;
  margin: 0;
}

.error-message {
  padding: 20px;
  background-color: #ffe5e5;
  border: 1px solid #ffcccc;
  border-radius: 8px;
  color: #d8000c;
  text-align: center;
  font-size: 1.2em;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  z-index: 10;
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #ffa500;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

h1 {
  transition: all 0.3s ease-in-out;
}

h1:hover {
  color: #ffa500;
}
</style>
