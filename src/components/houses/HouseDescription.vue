<template>
  <div class="house-description">
    <!-- 顯示房屋簡介 -->
    <h3>房屋簡介</h3>
    <div v-if="houseDescription">
      <p>{{ houseDescription.description }}</p> <!-- 只顯示簡介 -->
    </div>
    <!-- 加載中的狀態 -->
    <div v-else>
      <p>正在加載房屋簡介...</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      houseDescription: null, // 用於存儲從後端獲取的房屋簡介資料
      houseId: 1 // 假設 houseId 是固定的，你也可以根據需求從路由中提取
    };
  },
  mounted() {
    // 在組件加載時發送請求
    this.fetchHouseDescription(this.houseId);
  },
  methods: {
    // 使用 fetch 發送 GET 請求來獲取房屋簡介
    fetchHouseDescription(houseId) {
      fetch(`/Title/${houseId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json(); // 解析 JSON 數據
        })
        .then(data => {
          this.houseDescription = data; // 將資料存儲到 houseDescription 變量中
        })
        .catch(error => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  }
};
</script>

<style scoped>
/* 可以根據需要添加樣式 */
.house-description {
  margin: 20px;
}

.house-description h3 {
  font-size: 24px;
  font-weight: bold;
}

.house-description p {
  font-size: 16px;
  line-height: 1.6;
}
</style>
