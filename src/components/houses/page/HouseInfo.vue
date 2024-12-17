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
    <div v-if="furnitureServices">
      <div v-for="(item, index) in furnitureServices" :key="index" class="icon-label">
        <img :src="item.src" :alt="item.alt" class="icon-image" /> {{ item.name }}
      </div>
    </div>

    <!-- 房屋限制 -->
    <h3>房屋限制</h3>
    <div v-if="houseRestrictions">
      <div v-for="(item, index) in houseRestrictions" :key="index" class="icon-label">
        <img :src="item.src" :alt="item.alt" class="icon-image" /> {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      houseDetails: null, // 存儲從後端獲取的資料
      furnitureServices: [
        { src: 'img/washing-machine.jpg', alt: '洗衣機', name: '洗衣機' },
        { src: 'img/air-conditioner.jpg', alt: '空調', name: '空調' },
        { src: 'img/internet.jpg', alt: '網路', name: '網路' },
        { src: 'img/bedding.jpg', alt: '床架', name: '床架' },
        { src: 'img/mattress.jpg', alt: '床墊', name: '床墊' },
        { src: 'img/fridge.jpg', alt: '冰箱', name: '冰箱' },
        { src: 'img/electric-water-heater.jpg', alt: '電熱水器', name: '電熱水器' },
        { src: 'img/gas-water-heater.jpg', alt: '瓦斯熱水器', name: '瓦斯熱水器' },
        { src: 'img/tv.jpg', alt: '電視', name: '電視' },
        { src: 'img/cable-tv.jpg', alt: '第四台', name: '第四台' },
        { src: 'img/sofa.jpg', alt: '沙發', name: '沙發' },
        { src: 'img/tables-chairs.jpg', alt: '桌椅', name: '桌椅' },
      ],
      houseRestrictions: [
        { src: 'img/pet-friendly.jpg', alt: '允許養寵物', name: '允許養寵物' },
        { src: 'img/parking.jpg', alt: '提供停車位', name: '提供停車位' },
        { src: 'img/elevator.jpg', alt: '有電梯', name: '有電梯' },
        { src: 'img/balcony.jpg', alt: '有陽台', name: '有陽台' },
        { src: 'img/short-term-rent.jpg', alt: '允許短期租賃', name: '允許短期租賃' },
        { src: 'img/cooking.jpg', alt: '允許烹飪', name: '允許烹飪' },
        { src: 'img/water-dispenser.jpg', alt: '提供飲水機', name: '提供飲水機' },
        { src: 'img/management-fee.jpg', alt: '管理費', name: '管理費' },
        { src: 'img/gender-restriction.jpg', alt: '性別限制', name: '性別限制' },
      ],
      isLoading: true, // 加載狀態
      hasError: false, // 錯誤狀態
    };
  },
  mounted() {
    const houseId = 1; // 假設這是當前房屋的 ID，你可以根據實際情況從 URL 或路由中提取
    this.fetchHouseDetails(houseId);
  },
  methods: {
    // 使用 fetch 從後端獲取房屋詳細資料
    fetchHouseDetails(houseId) {
      this.isLoading = true; // 開始加載
      fetch(`http://localhost:8080/api/houses/details/${houseId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('網絡錯誤');
          }
          return response.json();
        })
        .then((data) => {
          this.houseDetails = data; // 將資料存儲到 houseDetails 中
          this.isLoading = false; // 結束加載
        })
        .catch((error) => {
          console.error('Error fetching house details:', error);
          this.hasError = true; // 顯示錯誤信息
          this.isLoading = false; // 結束加載
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
}

.icon-image {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.error-message {
  color: red;
  font-weight: bold;
}
</style>