<template>
  <div>
    <!-- 加載狀態 -->
    <div v-if="loading" class="loading">加載中...</div>

    <!-- 錯誤提示 -->
    <div v-if="error" class="error">
      {{ error.message }}
      <button @click="fetchHousePhotos" class="retry-button">重試</button>
    </div>

    <!-- 當有照片數據且未加載中或錯誤時顯示 -->
    <div v-if="!loading && !error && photos.length > 0">
      <!-- 使用 Swiper 顯示照片 -->
      <swiper ref="swiper" :slides-per-view="1" :pagination="{ clickable: true }" class="swiper-container">
        <swiper-slide v-for="(photo, index) in photos" :key="index">
          <img :src="`data:image/jpeg;base64,${photo}`" alt="房屋圖片" class="main-photo" @click="openPhoto(photo, index)" />
        </swiper-slide>

        <!-- 縮圖 -->
        <div class="thumbnails">
          <img 
            v-for="(thumb, thumbIndex) in photos" 
            :key="thumbIndex"
            :src="`data:image/jpeg;base64,${thumb}`"
            class="thumbnail"
            :class="{'highlighted': currentPhotoIndex === thumbIndex, 'dimmed': currentPhotoIndex !== thumbIndex}"
            @click="selectPhoto(thumbIndex)"
          />
        </div>
      </swiper>
    </div>

    <!-- 沒有照片的提示 -->
    <div v-if="!loading && !error && photos.length === 0" class="no-photos">
      <img src="../../assets/no-image.png" alt="暫時無照片展示">
    </div>

    <!-- 放大圖片的模態框 -->
    <div v-if="showModal" class="modal" @click="closeModal">
      <div class="modal-content">
        <img :src="`data:image/jpeg;base64,${selectedPhoto}`" alt="放大圖片" class="enlarged-photo" />
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

export default {
  name: "HousePhotos",
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    houseId: {
      type: [String, Number],
      required: true,
    },
    baseUrl: {
      type: String,
      default: 'http://localhost:8080/api/houses/getPhotos',
    },
  },
  data() {
    return {
      photos: [], // 照片列表
      loading: true, // 是否加載中
      error: null, // 加載過程中的錯誤信息
      showModal: false, // 是否顯示模態框
      selectedPhoto: null, // 當前選擇的照片
      currentPhotoIndex: 0, // 當前顯示的照片索引
    };
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
        const responseBody = await response.text();
        if (responseBody) {
          const data = JSON.parse(responseBody);
          this.photos = data || [];
        } else {
          this.photos = [];
        }
        this.currentPhotoIndex = 0;
      } catch (err) {
        console.error('獲取房屋照片時發生錯誤：', err);
        this.error = err;
        this.photos = [];
      } finally {
        this.loading = false;
      }
    },
    openPhoto(photo, index) {
      this.selectedPhoto = photo;
      this.currentPhotoIndex = index; // 更新当前显示照片的索引
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedPhoto = null;
    },
    selectPhoto(index) {
      this.currentPhotoIndex = index;
      this.$refs.swiper.swiper.slideTo(index); // 使用 swiper 的 slideTo 方法切換到指定索引
    }
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

.retry-button {
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 10px;
}

.retry-button:hover {
  background-color: #0056b3;
}

.no-photos {
  text-align: center;
  color: #777;
  font-size: 1.2rem;
}

.main-photo {
  display: block;
  margin: 0 auto;
  width: auto;
  height: 300px; /* 設置統一高度 */
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f5deb3; /* 替代黑色背景為木質調顏色 */
}

.swiper-container {
  background: url('../../assets/wood.jpg'); /* 設置木質調背景圖片 */
  background-size: cover;
}

.thumbnails {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.thumbnail {
  width: 50px;
  height: 50px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.7; /* 默认暗色调 */
  transition: opacity 0.3s ease;
}

.thumbnail:hover {
  opacity: 1; /* 鼠标悬停时恢复亮度 */
}

.highlighted {
  opacity: 1; /* 当前显示的照片缩略图保持亮度 */
  border: 2px solid #007bff; /* 高亮时的边框 */
}

.dimmed {
  opacity: 0.5; /* 其他照片缩略图暗色调 */
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
}

.modal-content {
  max-width: 90%;
  max-height: 90%;
}

.enlarged-photo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
