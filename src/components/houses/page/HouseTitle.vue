<template>
  <div>
    <!-- 房屋標題顯示區塊 -->
    <h1 v-if="title">{{ title }}</h1>
    <h1 v-else>載入中...</h1>
    <div v-if="error" class="error">
      <p style="color: red">{{ error }}</p>
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
    };
  },
  created() {
    this.fetchHouseTitle(); // 組件創建時發送請求
  },
  methods: {
    // 使用 Fetch API 獲取房屋標題
    async fetchHouseTitle() {
      this.error = ""; // 清空錯誤訊息
      try {
        const token = localStorage.getItem("jwt"); // 假設 token 存在 localStorage 中
        if (!token) {
          throw new Error("未找到 token");
        }
        const response = await fetch(
          `http://localhost:8080/api/houses/Title/${this.houseId}`,
          {
            method: "GET",
            headers: { Authorization: ` ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error("無法獲取標題，錯誤代碼：" + response.status);
        }
        this.title = await response.text(); // 獲取標題文字
      } catch (err) {
        this.error = err.message || "發生未知錯誤";
      }
    },
  },
};
</script>

<style scoped>
h1 {
  font-size: 2em;
  margin-top: 20px;
}

.error {
  margin-top: 20px;
  font-size: 1.2em;
  color: red;
}
</style>
