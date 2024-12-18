<template>
  <div class="house-details">
    <!-- 房屋基本資料 -->
    <div class="house-basic-info" v-if="houseDetails">
      <h3>房屋基本資料</h3>
      <p><strong>價格：</strong>{{ houseDetails.price }} 元</p>
      <p><strong>坪數：</strong>{{ houseDetails.size }} 坪</p>
      <p><strong>地址：</strong>{{ houseDetails.address }}</p>
      <p><strong>房間數：</strong>{{ houseDetails.rooms }} 間</p>
      <p><strong>浴廁數：</strong>{{ houseDetails.bathrooms }} 門</p>
      <p><strong>客廳數：</strong>{{ houseDetails.livingRooms }} 間</p>
      <p><strong>廚房數：</strong>{{ houseDetails.kitchens }} 間</p>
      <p><strong>樓層數：</strong>{{ houseDetails.floors }} 樓</p>
    </div>

    <!-- 家具與服務 -->
    <h3>提供家具與服務</h3>
    <div class="furniture-services">
      <div v-for="(item, index) in furnitureServices" :key="index" class="icon-label">
        <img :src="getFurnitureImage(item)" :alt="getFurnitureAltText(item)" class="icon-image" />
        <span>{{ item.name }}</span>
      </div>
    </div>
    
    <!-- 房屋限制 -->
    <h3>房屋限制</h3>
    <div class="house-restrictions">
      <div v-for="(item, index) in houseRestrictions" :key="index" class="icon-label">
        <img :src="getRestrictionImage(item)" :alt="getRestrictionAltText(item)" class="icon-image" />
        <span>{{ item.name }}</span>
      </div>
    </div>

    <!-- 性別限制 -->
    <h3>性別限制</h3>
    <div v-if="genderRestriction !== 0">
      <img :src="getGenderImage(genderRestriction)" :alt="genderRestriction === 1 ? '男' : '女'" class="icon-image" />
      <span>{{ genderRestriction === 1 ? '男生' : '女生' }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      houseDetails: null, // 存儲從後端獲取的資料
      furnitureServices: [
        { src: 'washingMachine.ico', alt: '洗衣機', name: '洗衣機', available: true },
        { src: 'airConditioner.ico', alt: '空調', name: '空調', available: true },
        { src: 'network.ico', alt: '網路', name: '網路', available: false },
        { src: 'bed.png', alt: '床架', name: '床架', available: true },
        { src: 'mattress.ico', alt: '床墊', name: '床墊', available: true },
        { src: 'refrigerator.ico', alt: '冰箱', name: '冰箱', available: true },
        { src: 'ewaterHeater.ico', alt: '電熱水器', name: '電熱水器', available: false },
        { src: 'gas.ico', alt: '瓦斯熱水器', name: '瓦斯熱水器', available: true },
        { src: 'TV.ico', alt: '電視', name: '電視', available: true },
        { src: 'cannel4.ico', alt: '第四台', name: '第四台', available: false },
        { src: 'sofa.cio', alt: '沙發', name: '沙發', available: true },
        { src: 'desk.ico', alt: '桌椅', name: '桌椅', available: true },
      ],
      houseRestrictions: [
        { src: 'PET.ico', alt: '允許養寵物', name: '允許養寵物', allowed: true },
        { src: 'Parking.ico', alt: '提供停車位', name: '提供停車位', allowed: false },
        { src: 'elevator.ico', alt: '有電梯', name: '有電梯', allowed: true },
        { src: 'balcony.ico', alt: '有陽台', name: '有陽台', allowed: false },
        { src: 'shortTerm.ico', alt: '允許短期租賃', name: '允許短期租賃', allowed: true },
        { src: 'cooking.ico', alt: '允許烹飪', name: '允許烹飪', allowed: false },
        { src: 'waterDispenser.ico', alt: '提供飲水機', name: '提供飲水機', allowed: true },
        { src: 'FEE.ico', alt: '管理費', name: '管理費', allowed: false },
        { src: 'gender.ico', alt: '性別限制', name: '性別限制', allowed: null },
      ],
      genderRestriction: " ", // 性別限制：0 不顯示，1 男性，2 女性
      isLoading: true, // 加載狀態
      hasError: false, // 錯誤狀態
    };
  },
  mounted() {
    const houseId = 1; // 假設這是當前房屋的 ID，你可以根據實際情況從 URL 或路由中提取
    this.fetchHouseDetails(houseId);
  },
  methods: {
    getFurnitureImage(item) {
      const imagePath = item.available && item.available !== false
        ? `../../../assets/icon/house-on/${item.src}`
        : `../../../assets/icon/house-off/${item.src}`;
      return imagePath;
    },

    getRestrictionImage(item) {
      const imagePath = item.allowed && item.allowed !== false
        ? `../../../assets/icon/house-on/${item.src}`
        : `../../../assets/icon/house-off/${item.src}`;
      return imagePath;
    },

    getFurnitureAltText(item) {
      return item.available ? item.alt : 'NO';
    },

    getRestrictionAltText(item) {
      return item.allowed ? item.alt : 'NO';
    },

    getGenderImage(genderRestriction) {
      if (genderRestriction === 1) {
        return `../../../assets/icon/house-on/male.ico`;
      } else if (genderRestriction === 2) {
        return `../../../assets/icon/house-on/female.ico`;
      }
      return ''; // 如果是 0，不顯示任何圖示
    },

    fetchHouseDetails(houseId) {
      this.isLoading = true;
      fetch(`http://localhost:8080/api/houses/details/${houseId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('網絡錯誤');
          }
          return response.json();
        })
        .then((data) => {
          this.houseDetails = data;
          this.isLoading = false;
          this.genderRestriction = data.genderRestriction; // 假設後端有性別限制資料
        })
        .catch((error) => {
          console.error('Error fetching house details:', error);
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

.error-message {
  color: red;
  font-weight: bold;
}
</style>
