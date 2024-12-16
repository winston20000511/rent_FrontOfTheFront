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
      <div>
        <div class="icon-label">
          <img :src="furnitureServices[0].src" alt="洗衣機" class="icon-image" /> 洗衣機
        </div>
        <div class="icon-label">
          <img :src="furnitureServices[1].src" alt="空調" class="icon-image" /> 空調
        </div>
        <div class="icon-label">
          <img :src="furnitureServices[2].src" alt="網路" class="icon-image" /> 網路
        </div>
        <div class="icon-label">
          <img :src="furnitureServices[3].src" alt="床架" class="icon-image" /> 床架
        </div>
        <div class="icon-label">
          <img :src="furnitureServices[4].src" alt="床墊" class="icon-image" /> 床墊
        </div>
        <div class="icon-label">
          <img :src="furnitureServices[5].src" alt="冰箱" class="icon-image" /> 冰箱
        </div>
        <div class="icon-label">
          <img :src="furnitureServices[6].src" alt="電熱水器" class="icon-image" /> 電熱水器
        </div>
        <div class="icon-label">
          <img :src="furnitureServices[7].src" alt="瓦斯熱水器" class="icon-image" /> 瓦斯熱水器
        </div>
        <div class="icon-label">
          <img :src="furnitureServices[8].src" alt="電視" class="icon-image" /> 電視
        </div>
        <div class="icon-label">
          <img :src="furnitureServices[9].src" alt="第四台" class="icon-image" /> 第四台
        </div>
        <div class="icon-label">
          <img :src="furnitureServices[10].src" alt="沙發" class="icon-image" /> 沙發
        </div>
        <div class="icon-label">
          <img :src="furnitureServices[11].src" alt="桌椅" class="icon-image" /> 桌椅
        </div>
      </div>
  
      <!-- 分隔線 -->
      <hr />
  
      <!-- 房屋限制 -->
      <h3>房屋限制</h3>
      <div>
        <div class="icon-label">
          <img :src="houseRestrictions[0].src" alt="允許養寵物" class="icon-image" /> 允許養寵物
        </div>
        <div class="icon-label">
          <img :src="houseRestrictions[1].src" alt="提供停車位" class="icon-image" /> 提供停車位
        </div>
        <div class="icon-label">
          <img :src="houseRestrictions[2].src" alt="有電梯" class="icon-image" /> 有電梯
        </div>
        <div class="icon-label">
          <img :src="houseRestrictions[3].src" alt="有陽台" class="icon-image" /> 有陽台
        </div>
        <div class="icon-label">
          <img :src="houseRestrictions[4].src" alt="允許短期租賃" class="icon-image" /> 允許短期租賃
        </div>
        <div class="icon-label">
          <img :src="houseRestrictions[5].src" alt="允許烹飪" class="icon-image" /> 允許烹飪
        </div>
        <div class="icon-label">
          <img :src="houseRestrictions[6].src" alt="提供飲水機" class="icon-image" /> 提供飲水機
        </div>
        <div class="icon-label">
          <img :src="houseRestrictions[7].src" alt="管理費" class="icon-image" /> 管理費
        </div>
        <div class="icon-label">
          <img :src="houseRestrictions[8].src" alt="性別限制" class="icon-image" /> 性別限制
        </div>
      </div>
    </div>
  </template>
  
  <script>
 export default {
  data() {
    return {
      houseDetails: null, // 存儲從後端獲取的資料
    };
  },
  mounted() {
    // 假設你有一個 houseId，可以從路由中提取
    const houseId = 1; // 假設這是當前房屋的 ID，你可以根據實際情況從 URL 或路由中提取
    this.fetchHouseDetails(houseId);
  },
  methods: {
    // 使用 fetch 從後端獲取房屋詳細資料
    fetchHouseDetails(houseId) {
      fetch(`http://localhost:8080/details/${houseId}`)
        .then(response => response.json())
        .then(data => {
          this.houseDetails = data; // 將資料存儲到 houseDetails 中
        })
        .catch(error => {
          console.error("Error fetching house details:", error);
        });
    }
  }
};
</script>
  
  <style scoped>
  .house-details {
    padding: 20px;
  }
  
  .house-basic-info {
    margin-bottom: 20px;
  }
  
  