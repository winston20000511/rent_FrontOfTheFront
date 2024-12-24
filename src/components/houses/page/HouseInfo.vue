<template>
  <div class="house-details-container" v-if="!isLoading">
    <!-- 錯誤訊息處理 -->
    <div v-if="hasError" class="error-message">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- 房屋基本資料 -->
    <div v-if="houseDetails" class="house-basic-info">
      <h2>房屋基本資料</h2>
      <div class="basic-info-grid">
        <div class="info-item">
          <strong>價格:</strong>
          <span>{{ formatPrice(houseDetails.price) }} 元</span>
        </div>
        <div class="info-item">
          <strong>坪數:</strong>
          <span>{{ houseDetails.size }} 坪</span>
        </div>
        <div class="info-item">
          <strong>地址:</strong>
          <span>{{ houseDetails.address }}</span>
        </div>
        <div class="info-item">
          <strong>房間:</strong>
          <span>{{ houseDetails.room }} 間</span>
        </div>
        <div class="info-item">
          <strong>浴廁:</strong>
          <span>{{ houseDetails.bathroom }} 間</span>
        </div>
        <div class="info-item">
          <strong>客廳:</strong>
          <span>{{ houseDetails.livingroom }} 間</span>
        </div>
        <div class="info-item">
          <strong>廚房:</strong>
          <span>{{ houseDetails.kitchen }} 間</span>
        </div>
        <div class="info-item">
          <strong>樓層:</strong>
          <span>{{ houseDetails.floor }} 樓</span>
        </div>
        <div class="info-item">
          <strong>型態:</strong>
          <span>{{ houseDetails.houseType }}</span>
        </div>
        <div class="info-item" v-if="houseDetails.atticAddition">
          <strong>是否為頂樓加蓋:</strong>
          <span>是</span>
        </div>
      </div>
    </div>

    <hr />

    <!-- 家具與服務 -->
    <section>
      <h2>提供家具與服務</h2>
      <div class="icons-grid">
        <div
          v-for="(item, index) in availableFurnitureServices"
          :key="index"
          class="icon-card"
        >
          <img
            :src="`${baseUrl}src/assets/icon/house-on/${item.src}`"
            :alt="item.alt"
            :title="item.name"
            class="icon-image"
            @error="handleImageError"
          />
          <span>{{ item.name }}</span>
        </div>
      </div>
    </section>

    <hr />

    <!-- 房屋限制 -->
    <section>
      <h2>房屋限制</h2>
      <div class="icons-grid">
        <div
          v-for="(item, index) in allowedHouseRestrictions"
          :key="index"
          class="icon-card"
        >
          <img
            :src="`${baseUrl}src/assets/icon/house-on/${item.src}`"
            :alt="item.alt"
            :title="item.name"
            class="icon-image"
            @error="handleImageError"
          />
          <span>{{ item.name }}</span>
        </div>
        <div v-if="genderRestriction !== 0" class="icon-card">
          <img
            :src="getGenderImage(genderRestriction)"
            :alt="genderRestriction === 1 ? '男' : '女'"
            class="icon-image"
            @error="handleImageError"
          />
          <span>{{ genderRestriction === 1 ? '男' : '女' }}</span>
        </div>
      </div>
    </section>
  </div>

  <!-- 加載中顯示 -->
  <div v-if="isLoading" class="loading-overlay">
    <div class="spinner"></div>
    <p>正在加載資料...</p>
  </div>
</template>

<script>
export default {
  props: {
    houseId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      houseDetails: null,
      furnitureServices: [],
      houseRestrictions: [],
      genderRestriction: 0,
      isLoading: true,
      hasError: false,
      errorMessage: "", // 新增
    };
  },
  computed: {
    baseUrl() {
      return import.meta.env.BASE_URL;
    },
    availableFurnitureServices() {
      return this.furnitureServices.filter(service => service.available);
    },
    allowedHouseRestrictions() {
      return this.houseRestrictions.filter(restriction => restriction.allowed);
    },
  },
  mounted() {
    this.fetchHouseDetails(this.houseId);
  },
  methods: {
    formatPrice(price) {
      return price.toLocaleString(); // 格式化價格，例如 4300 轉為 4,300
    },
    getGenderImage(gender) {
      const genderMap = {
        1: "male.ico",
        2: "FEMALE.ico",
      };
      return genderMap[gender]
        ? new URL(`${this.baseUrl}src/assets/icon/house-on/${genderMap[gender]}`, import.meta.url).href
        : "";
    },
    handleImageError(event) {
      event.target.src = `${this.baseUrl}src/assets/icon/house-on/default.ico`; // 替代圖片路徑
    },
    fetchHouseDetails(houseId) {
      this.isLoading = true;
      const token = localStorage.getItem("jwt");
      if (!token) {
        this.hasError = true;
        this.errorMessage = "未找到驗證令牌，請重新登入。";
        this.isLoading = false;
        console.error("未找到 token");
        return;
      }
      fetch(`http://localhost:8080/api/houses/details/${houseId}`, {
        method: "GET",
        headers: { Authorization: `${token}` }, // 確保使用 Bearer 前綴
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("網絡錯誤");
          }
          return response.json();
        })
        .then(data => {
          this.houseDetails = data;
          this.genderRestriction = data.genderRestrictions || 0;

          // 動態生成家具服務
          this.furnitureServices = [
            { src: "washingMachine.ico", alt: "洗衣機", name: "洗衣機", available: data.washingMachine },
            { src: "airConditioner.ico", alt: "空調", name: "空調", available: data.airConditioner },
            { src: "network.ico", alt: "網路", name: "網路", available: data.network },
            { src: "bed.png", alt: "床架", name: "床架", available: data.bedstead },
            { src: "mattress.ico", alt: "床墊", name: "床墊", available: data.mattress },
            { src: "refrigerator.ico", alt: "冰箱", name: "冰箱", available: data.refrigerator },
            { src: "ewaterHeater.ico", alt: "電熱水器", name: "電熱水器", available: data.ewaterHeater },
            { src: "gas.ico", alt: "瓦斯熱水器", name: "瓦斯熱水器", available: data.gwaterHeater },
            { src: "TV.ico", alt: "電視", name: "電視", available: data.television },
            { src: "channel4.ico", alt: "第四台", name: "第四台", available: data.channel4 },
            { src: "sofa.ico", alt: "沙發", name: "沙發", available: data.sofa },
            { src: "desk.ico", alt: "桌椅", name: "桌椅", available: data.tables },
          ];

          // 動態生成房屋限制
          this.houseRestrictions = [
            { src: "PET.ico", alt: "允許養寵物", name: "允許養寵物", allowed: data.pet },
            { src: "Parking.ico", alt: "提供停車位", name: "提供停車位", allowed: data.parkingSpace },
            { src: "elevator.ico", alt: "有電梯", name: "有電梯", allowed: data.elevator },
            { src: "balcony.ico", alt: "有陽台", name: "有陽台", allowed: data.balcony },
            { src: "shortTerm.ico", alt: "允許短期租賃", name: "允許短期租賃", allowed: data.shortTerm },
            { src: "cooking.ico", alt: "允許烹飪", name: "允許烹飪", allowed: data.cooking },
            { src: "waterDispenser.ico", alt: "提供飲水機", name: "提供飲水機", allowed: data.waterDispenser },
            { src: "FEE.ico", alt: "管理費", name: "管理費", allowed: data.managementFee },
          ];

          this.isLoading = false;
        })
        .catch(error => {
          console.error("Error fetching house details:", error);
          if (error.message === "網絡錯誤") {
            this.errorMessage = "無法連接到伺服器，請檢查你的網絡連接。";
          } else {
            this.errorMessage = "發生未知錯誤，請稍後再試。";
          }
          this.hasError = true;
          this.isLoading = false;
        });
    },
  },
};
</script>

<style scoped>
.house-details-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.error-message {
  padding: 20px;
  background-color: #ffe5e5;
  border: 1px solid #ffcccc;
  border-radius: 8px;
  color: #d8000c;
  margin-bottom: 25px;
  text-align: center;
}

.house-basic-info h2,
.icons-grid h2 {
  font-size: 2em;
  margin-bottom: 20px;
  color: #333333;
  border-bottom: 3px solid #ffa500;
  padding-bottom: 8px;
}

.basic-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
}

.info-item {
  background: #fdf5e6;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.info-item strong {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #ff6600;
  font-size: 1.5em;
}
.info-item span {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: black;
  font-size: 1.5em;
}

.icons-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  justify-content: flex-start;
}

.icon-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
  text-align: center;
}

.icon-image {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #ffa500;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

hr {
  border: none;
  border-top: 3px solid #ffa500;
  margin: 15px 0;
}
h2 {
  font-size: 2em;
  margin-bottom: 2px; /* 增加與下方內容的間距 */
  padding-bottom: 8px;
}
</style>
