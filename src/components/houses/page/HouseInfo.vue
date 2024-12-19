<template>
  <div class="house-details" v-if="!isLoading">
    <!-- 加載中錯誤處理 -->
    <div v-if="hasError" class="error-message">
      無法加載房屋資料，請稍後再試。
    </div>

    <!-- 房屋基本資料 -->
    <div v-if="houseDetails" class="house-basic-info">
      <h3>房屋基本資料</h3>
      <div class="info-item large-text">
        <strong>價格:</strong><span>{{ houseDetails.price }} 元</span>
      </div>
      <div class="info-item large-text">
        <strong>坪數:</strong><span>{{ houseDetails.size }} 坪</span>
      </div>
      <div class="info-item large-text">
        <strong>地址:</strong><span>{{ houseDetails.address }}</span>
      </div>
      <div class="info-grid">
        <div class="info-item">
          <span>房間</span>
          <span>{{ houseDetails.room }} 間</span>
        </div>
        <div class="info-item">
          <span>浴廁</span>
          <span>{{ houseDetails.bathroom }} 間</span>
        </div>
        <div class="info-item">
          <span>客廳</span>
          <span>{{ houseDetails.livingroom }} 間</span>
        </div>
        <div class="info-item">
          <span>廚房</span>
          <span>{{ houseDetails.kitchen }} 間</span>
        </div>
        <div class="info-item">
          <span>樓層</span>
          <span>{{ houseDetails.floor }} 樓</span>
        </div>
        <div class="info-item">
          <span>型態</span>
          <span>{{ houseDetails.houseType }}</span>
        </div>
      </div>

      <!-- 頂樓加蓋 -->
      <div v-if="houseDetails.atticAddition" class="info-item">
        <strong>是否為頂樓加蓋:</strong
        ><span>{{ houseDetails.atticAddition ? "是" : "否" }}</span>
      </div>
    </div>

    <hr />

    <!-- 家具與服務 -->
    <h3>提供家具與服務</h3>
    <div class="furniture-services">
      <!-- 渲染家具服務，只有 available 為 true 時顯示 -->
      <div
        v-for="(item, index) in furnitureServices"
        :key="index"
        v-show="item.available"
        class="icon-label"
      >
        <img
          :src="baseUrl + 'src/assets/icon/house-on/' + item.src"
          :alt="item.alt"
          :title="item.name"
          class="icon-image"
        />
        <span>{{ item.name }}</span>
      </div>
    </div>

    <hr />

    <!-- 房屋限制 -->
    <h3>房屋限制</h3>
    <div class="house-restrictions">
      <!-- 渲染房屋限制，只有 allowed 為 true 時顯示 -->
      <div
        v-for="(item, index) in houseRestrictions"
        :key="index"
        v-show="item.allowed"
        class="icon-label"
      >
        <img
          :src="baseUrl + 'src/assets/icon/house-on/' + item.src"
          :alt="item.alt"
          :title="item.name"
          class="icon-image"
        />
        <span>{{ item.name }}</span>
      </div>

      <!-- 性別限制 -->
      <div v-if="genderRestriction !== 0">
        <img
          :src="getGenderImage(genderRestriction)"
          :alt="genderRestriction === 1 ? '男' : '女'"
          class="icon-image"
        />
      </div>
    </div>

    <hr />
  </div>

  <!-- 加載中顯示 -->
  <div v-if="isLoading" class="loading-message">
    <span>正在加載資料...</span>
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
      houseDetails: null, // 存儲從後端獲取的資料
      furnitureServices: [
        {
          src: "washingMachine.ico",
          alt: "洗衣機",
          name: "洗衣機",
          available: true,
        },
        {
          src: "airConditioner.ico",
          alt: "空調",
          name: "空調",
          available: true,
        },
        { src: "network.ico", alt: "網路", name: "網路", available: true },
        { src: "bed.png", alt: "床架", name: "床架", available: false },
        { src: "mattress.ico", alt: "床墊", name: "床墊", available: true },
        { src: "refrigerator.ico", alt: "冰箱", name: "冰箱", available: true },
        {
          src: "ewaterHeater.ico",
          alt: "電熱水器",
          name: "電熱水器",
          available: false,
        },
        {
          src: "gas.ico",
          alt: "瓦斯熱水器",
          name: "瓦斯熱水器",
          available: true,
        },
        { src: "TV.ico", alt: "電視", name: "電視", available: false },
        {
          src: "channel4.ico",
          alt: "第四台",
          name: "第四台",
          available: false,
        },
        { src: "sofa.ico", alt: "沙發", name: "沙發", available: false },
        { src: "desk.ico", alt: "桌椅", name: "桌椅", available: true },
      ],
      houseRestrictions: [
        {
          src: "PET.ico",
          alt: "允許養寵物",
          name: "允許養寵物",
          allowed: true,
        },
        {
          src: "Parking.ico",
          alt: "提供停車位",
          name: "提供停車位",
          allowed: true,
        },
        { src: "elevator.ico", alt: "有電梯", name: "有電梯", allowed: false },
        { src: "balcony.ico", alt: "有陽台", name: "有陽台", allowed: false },
        {
          src: "shortTerm.ico",
          alt: "允許短期租賃",
          name: "允許短期租賃",
          allowed: true,
        },
        {
          src: "cooking.ico",
          alt: "允許烹飪",
          name: "允許烹飪",
          allowed: true,
        },
        {
          src: "waterDispenser.ico",
          alt: "提供飲水機",
          name: "提供飲水機",
          allowed: true,
        },
        { src: "FEE.ico", alt: "管理費", name: "管理費", allowed: true },
        { src: "gender.ico", alt: "性別限制", name: "性別限制", allowed: true },
      ],
      genderRestriction: 0, // 性別限制: 0 不顯示，1 男性，2 女性
      isLoading: true, // 加載狀態
      hasError: false, // 錯誤狀態
    };
  },
  computed: {
    baseUrl() {
      return import.meta.env.BASE_URL; // 獲取 BASE_URL，並作為計算屬性
    },
  },
  mounted() {
    this.fetchHouseDetails(this.houseId);
  },
  methods: {
    getFurnitureAltText(item) {
      return item.available ? item.alt : "不可用";
    },

    getRestrictionAltText(item) {
      return item.allowed ? item.alt : "不可用";
    },

    getGenderImage(genderRestriction) {
      if (genderRestriction === 1) {
        return new URL("@/assets/icon/house-on/male.ico", import.meta.url).href;
      } else if (genderRestriction === 2) {
        return new URL("@/assets/icon/house-on/female.ico", import.meta.url)
          .href;
      }
      return ""; // 如果是0，不顯示任何圖示
    },

    fetchHouseDetails(houseId) {
      this.isLoading = true;
      const token = localStorage.getItem("jwt"); // 假設 token 存在 localStorage 中
      if (!token) {
        throw new Error("未找到 token");
      }
      fetch(`http://localhost:8080/api/houses/details/${houseId}`, {
        method: "GET",
        headers: { Authorization: ` ${token}` },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("網絡錯誤");
          }
          return response.json();
        })
        .then((data) => {
          this.houseDetails = data;
          this.isLoading = false;
          this.genderRestriction = data.genderRestrictions; // 假設後端有性別限制資料
        })
        .catch((error) => {
          console.error("Error fetching house details:", error);
          this.hasError = true;
          this.isLoading = false;
        });
    },
  },
};
</script>
<style scoped>
.house-details {
  padding: 20px;
}

.house-basic-info {
  margin-bottom: 20px;
}

h3 {
  font-size: 1.5em; /* 調整標題大小 */
  font-weight: bold; /* 調整標題粗體 */
  margin-bottom: 5px;
}

hr {
  margin: 10px 0; /* 增加分隔線上下間距 */
  border: 0;
  border-top: 5px solid black;
}

.icon-label {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.icon-image {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.furniture-services,
.house-restrictions {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.furniture-services .icon-label,
.house-restrictions .icon-label {
  display: inline-flex;
  align-items: center;
}

.info-grid {
  display: flex;
  flex-wrap: wrap; /* 支持多行排列 */
}

.info-item {
  background: #ffa500; /* 設置為亮橘色 */
  border-radius: 5px; /* 圓角 */
  padding: 10px; /* 增加內邊距 */
  margin: 5px; /* 增加外邊距 */
}

.info-item span {
  text-align: center; /* 中心對齊文本 */
}

.large-text {
  font-size: 1.5em; /* 調整字體大小 */
}

.error-message {
  color: red;
  font-weight: bold;
}

.loading-message {
  font-size: 1.2em;
  color: #007bff;
  font-weight: bold;
}
</style>
