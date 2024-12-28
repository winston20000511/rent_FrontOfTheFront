<template>
  <div>
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
    </div>
    <div v-else-if="error" class="error">
      {{ error.message }}
      <button @click="fetchHousePhotos" class="retry-button">重試</button>
    </div>
    <div v-else>
      <!-- 如果有圖片 -->
      <div v-if="photos.length > 0">
        <Splide :options="splideOptions" class="splide-container">
          <template #arrows>
            <button class="splide__arrow splide__arrow--prev">
              <svg viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button class="splide__arrow splide__arrow--next">
              <svg viewBox="0 0 24 24">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </template>
          <SplideSlide v-for="(photo, index) in photos" :key="photo.id">
            <img
              :src="`data:image/jpeg;base64,${photo.base64}`"
              alt="房屋圖片"
              class="main-photo"
              @click="openImageModal(photo)"
            />
          </SplideSlide>
        </Splide>
      </div>

      <!-- 如果沒圖片 -->
      <div v-else class="no-photos">
        <img src="../../assets/no-image.png" alt="暫時無照片展示" />
      </div>
    </div>

    <!-- 圖片模態框 -->
    <Dialog v-model:visible="isModalVisible" header="圖片查看" :modal="true" :style="{ width: '80vw' }">
      <img :src="selectedPhotoSrc" alt="選中圖片" style="width: 100%;" />
    </Dialog>
  </div>
</template>

<script>
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import Dialog from 'primevue/dialog'; // 引入 Dialog 组件

export default {
  name: "HousePhotos",
  components: {
    Splide,
    SplideSlide,
    Dialog,
  },
  props: {
    houseId: {
      type: [String, Number],
      required: true,
    },
    baseUrl: {
      type: String,
      default: "http://localhost:8080/api/houses/getPhotos",
    },
  },
  data() {
    return {
      photos: [],   // 改成 [{ id: "101", base64: "xxx"}, ...]
      loading: true,
      error: null,
      splideOptions: {
        type: "fade-loop",
        perPage: 1,
        focus: "start", 
        gap: "1em",
        padding: { left: "50px", right: "50px" },
        pagination: true,
        arrows: true,
        start: 0, // 確保從第一張開始
      },
      isModalVisible: false, 
      selectedPhotoSrc: '', 
    };
  },
  methods: {
    async fetchHousePhotos() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem("jwt");
        const response = await fetch(`${this.baseUrl}/${this.houseId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP 錯誤！狀態碼：${response.status}`);
        }
        const responseBody = await response.json(); 
        // 假設後端回傳: [ { id:"101", base64:"..." }, ... ]
        this.photos = Array.isArray(responseBody) ? responseBody : [];
      } catch (err) {
        console.error("獲取房屋照片時發生錯誤：", err);
        this.error = err;
        this.photos = [];
      } finally {
        this.loading = false;
      }
    },
    openImageModal(photo) {
      this.selectedPhotoSrc = `data:image/jpeg;base64,${photo.base64}`;
      this.isModalVisible = true;
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
/* Loading Spinner */
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #007bff; /* 藍色 Spinner */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

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
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.main-photo:hover {
  transform: scale(1.05);
}

.splide-container {
  width: 100%;
  padding: 1rem;
}

.splide__arrow {
  background: none;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}

.splide__arrow svg {
  fill: #ff9800;
  width: 100%;
  height: 100%;
}

.splide__arrow--prev {
  left: 10px;
}

.splide__arrow--next {
  right: 10px;
}

.splide__arrow:hover svg {
  fill: #e68900;
}

.splide__pagination {
  bottom: -1.5rem;
}
::v-deep(.splide__pagination__page) {
  background-color: lightgray !important;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin: 0 5px;
}

::v-deep(.splide__pagination__page.is-active) {
  background-color: #4feac0 !important;
  transform: scale(1.2);
}

::v-deep(.splide__pagination__page:hover) {
  background-color: #4fe4ea !important;
}
@media (max-width: 1200px) {
  .main-photo {
    max-width: 80%;
  }
}

@media (max-width: 768px) {
  .main-photo {
    max-width: 70%;
    max-height: 300px;
  }
}
</style>
