<template>
  <div>
    <!-- 顯示加載中的狀態 -->
    <div v-if="loading">加載中...</div>
    
    <!-- 顯示錯誤信息 -->
    <div v-if="error">{{ error.message }}</div>
    
    <!-- 當圖片加載成功且沒有錯誤時，顯示照片 -->
    <div v-if="!loading && !error">
      <img :src="currentPhoto" alt="House Photo" />
      
      <!-- 照片導航控制 -->
      <div class="photo-controls">
        <button @click="previousPhoto">上一張</button>
        <button @click="nextPhoto">下一張</button>
      </div>

      <!-- 照片縮略圖顯示 -->
      <div class="photo-thumbnails">
        <div 
          v-for="(photo, index) in photos" 
          :key="index" 
          @click="selectPhoto(index)">
          <img :src="photo" :alt="'縮略圖 ' + index" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 預設從父層傳入 houseId 來識別要查看的房屋
    houseId: {
      type: [String, Number],
      required: true
    },
    // 基本 API 地址，默認為 /api/houses/getPhotos
    baseUrl: {
      type: String,
      default: '/api/houses/getPhotos'
    }
  },
  data() {
    return {
      // 照片列表
      photos: [],
      // 當前顯示的照片索引
      currentPhotoIndex: 0,
      // 加載狀態
      loading: true,
      // 錯誤信息
      error: null
    }
  },
  computed: {
    // 根據當前索引來取得顯示的圖片
    currentPhoto() {
      return this.photos[this.currentPhotoIndex]
    }
  },
  methods: {
    // 從後端獲取房屋照片
    async fetchHousePhotos() {
      this.loading = true
      this.error = null
      
      try {
        // 使用 `fetch` 發送請求，這裡會傳入 houseId 來獲取特定房屋的照片
        const response = await fetch(`${this.baseUrl}/${this.houseId}`)
        
        // 如果返回的狀態碼不是 2xx，則拋出錯誤
        if (!response.ok) {
          throw new Error(`HTTP 錯誤！狀態碼：${response.status}`)
        }
        
        // 解析返回的 JSON 數據，假設返回的是照片 URL 列表
        const data = await response.json()
        this.photos = data
        this.currentPhotoIndex = 0
      } catch (error) {
        console.error('獲取房屋照片時發生錯誤：', error)
        this.error = error
        this.photos = []
      } finally {
        this.loading = false
      }
    },
    // 顯示下一張照片
    nextPhoto() {
      this.currentPhotoIndex = 
        (this.currentPhotoIndex + 1) % this.photos.length
    },
    // 顯示上一張照片
    previousPhoto() {
      this.currentPhotoIndex = 
        (this.currentPhotoIndex - 1 + this.photos.length) % this.photos.length
    },
    // 直接選擇某張照片
    selectPhoto(index) {
      this.currentPhotoIndex = index
    }
  },
  created() {
    // 組件創建時自動加載照片
    this.fetchHousePhotos()
  },
  watch: {
    // 如果 houseId 改變，重新獲取照片
    houseId() {
      this.fetchHousePhotos()
    }
  }
}
</script>

<style scoped>
/* 照片控制按鈕樣式 */
.photo-controls {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

/* 照片縮略圖顯示 */
.photo-thumbnails {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.photo-thumbnails img {
  width: 50px;
  height: 50px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.photo-thumbnails img:hover {
  opacity: 1;
}
</style>
