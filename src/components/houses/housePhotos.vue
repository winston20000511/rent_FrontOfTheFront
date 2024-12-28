<template>
  <div>
    <!-- 加載狀態 -->
    <div v-if="loading" class="loading">加載中...</div>
    
    <!-- 錯誤提示 -->
    <div v-if="error" class="error">{{ error.message }}</div>
    
    <!-- 當有照片數據且未加載中或錯誤時顯示 -->
    <div v-if="!loading && !error && photos.length > 0">
      <!-- 主照片顯示 -->
      <img :src="currentPhoto" alt="房屋圖片" class="main-photo" />
      
      
      <!-- 照片控制按鈕 -->
      <div class="photo-controls">
        <button @click="previousPhoto" :disabled="photos.length <= 1">上一張</button>
        <button @click="nextPhoto" :disabled="photos.length <= 1">下一張</button>
      </div>
      
      <!-- 照片縮略圖 -->
      <div class="photo-thumbnails">
        <img 
          v-for="(photo, index) in photos" 
          :key="index" 
          :src="photo" 
          :alt="'縮略圖 ' + (index + 1)"
          :class="{ active: index === currentPhotoIndex }"
          @click="selectPhoto(index)" />
      </div>
    </div>
    
    <!-- 沒有照片的提示 -->
    <div v-if="!loading && !error && photos.length === 0" class="no-photos">
      暫無可顯示的照片。
    </div>
  </div>
</template>

<script>
export default {
  name: "HousePhotos",
  props: {
    houseId: {
      type: [String, Number],
      required: true,
    },
    baseUrl: {
      type: String,
      default: '/api/houses/getPhotos',
    },
  },
  data() {
    return {
      photos: [], // 照片列表
      currentPhotoIndex: 0, // 當前顯示的照片索引
      loading: true, // 是否加載中
      error: null, // 加載過程中的錯誤信息
    };
  },
  computed: {
    currentPhoto() {
      return this.photos[this.currentPhotoIndex] || '';
    },
  },
  methods: {
    async fetchHousePhotos() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${this.baseUrl}/${this.houseId}`);
        if (!response.ok) {
          throw new Error(`HTTP 錯誤！狀態碼：${response.status}`);
        }
        const data = await response.json();
        this.photos = data || [];
        this.currentPhotoIndex = 0;
      } catch (err) {
        console.error('獲取房屋照片時發生錯誤：', err);
        this.error = err;
        this.photos = [];
      } finally {
        this.loading = false;
      }
    },
    nextPhoto() {
      this.currentPhotoIndex = 
        (this.currentPhotoIndex + 1) % this.photos.length;
    },
    previousPhoto() {
      this.currentPhotoIndex = 
        (this.currentPhotoIndex - 1 + this.photos.length) % this.photos.length;
    },
    selectPhoto(index) {
      this.currentPhotoIndex = index;
    },
  },
  watch: {
    houseId: "fetchHousePhotos",
  },
  created() {
    this.fetchHousePhotos();
  },
};
</script>

<style scoped>
.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #555;
}

.error {
  text-align: center;
  color: red;
  font-size: 1.2rem;
}

.no-photos {
  text-align: center;
  color: #777;
  font-size: 1.2rem;
}

.main-photo {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.photo-controls {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.photo-controls button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.photo-controls button:hover {
  background-color: #0056b3;
}

.photo-controls button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.photo-thumbnails {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.photo-thumbnails img {
  width: 50px;
  height: 50px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s, transform 0.3s;
}

.photo-thumbnails img.active {
  opacity: 1;
  border-color: #007bff;
  transform: scale(1.1);
}

.photo-thumbnails img:hover {
  opacity: 1;
}
</style>
