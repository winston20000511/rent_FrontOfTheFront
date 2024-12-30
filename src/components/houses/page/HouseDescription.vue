<template>
  <div class="description-card">
    <!-- 加載中顯示 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>正在加載房屋簡介...</p>
    </div>

    <!-- 錯誤訊息處理 -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <!-- 房屋簡介顯示區塊 -->
    <div v-if="houseDescription && !isLoading && !error" class="description-content">
      <h3>房屋簡介</h3>
      <p>{{ houseDescription.description }}</p>
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
      houseDescription: null, // 用於存儲從後端獲取的房屋簡介資料
      isLoading: true, // 加載狀態
      error: "", // 錯誤訊息
    };
  },
  mounted() {
    // 在組件加載時發送請求
    this.fetchHouseDescription(this.houseId);
  },
  methods: {
    // 使用 fetch 發送 GET 請求來獲取房屋簡介
    async fetchHouseDescription(houseId) {
      this.error = ""; // 清空錯誤訊息
      this.isLoading = true; // 開始加載
      try {
        const token = localStorage.getItem("jwt"); // 假設 token 存在 localStorage 中
        if (!token) {
          throw new Error("未找到驗證令牌，請重新登入。");
        }
        const response = await fetch(
          `http://localhost:8080/api/houses/Description/${houseId}`,
          {
            method: "GET",
            headers: { Authorization: `${token}` }, // 修正 Bearer 前綴
          }
        );
        if (!response.ok) {
          throw new Error("無法獲取房屋簡介，錯誤代碼：" + response.status);
        }
        const data = await response.json(); // 解析 JSON 數據
        this.houseDescription = data; // 將資料存儲到 houseDescription 變量中
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
.description-card {
  max-width: 700px;
  margin: 40px auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  position: relative;
}

.description-content h3 {
  font-size: 1.8em;
  color: #ffa500; /* 與 hr 線相似的顏色 */
  margin-bottom: 10px;
  border-bottom: 2px solid #ffa500;
  padding-bottom: 5px;
}

.description-content p {
  font-size: 16px;
  line-height: 1.6;
  color: #333333;
  text-align: justify;
}

.error-message {
  padding: 20px;
  background-color: #ffe5e5;
  border: 1px solid #ffcccc;
  border-radius: 8px;
  color: #d8000c;
  text-align: center;
  font-size: 1.2em;
  margin-top: 20px;
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

h3 {
  transition: all 0.3s ease-in-out;
}

h3:hover {
  color: #ff8c00;
}
</style>
