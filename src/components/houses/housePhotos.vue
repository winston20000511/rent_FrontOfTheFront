<template>
  <div>
    <div v-if="loading" class="loading">加載中...</div>
    <div v-else-if="error" class="error">
      {{ error.message }}
      <button @click="fetchHousePhotos" class="retry-button">重試</button>
    </div>
    <div v-else>
      <!-- 如果有圖片 -->
      <div v-if="photos.length > 0">
        <Splide :options="splideOptions" class="splide-container" @arrows-mounted="addLoopArrows">
          <SplideSlide v-for="(photo, index) in photos" :key="photo.id">
            <img
              :src="`data:image/jpeg;base64,${photo.base64}`"
              alt="房屋圖片"
              class="main-photo"
            />
          </SplideSlide>
        </Splide>
      </div>

      <!-- 如果沒圖片 -->
      <div v-else class="no-photos">
        <img src="../../assets/no-image.png" alt="暫時無照片展示" />
      </div>
    </div>
  </div>
</template>

<script>
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/splide/dist/css/splide.min.css';

export default {
  name: "HousePhotos",
  components: {
    Splide,
    SplideSlide,
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
        type: "loop",
        perPage: 1,
        focus: "center",
        gap: "1rem",
        padding: { left: "5rem", right: "5rem" },
        pagination: true,
        arrowPath: "M14 2L3 12L14 22", // 客製箭頭路徑
      },
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
    addLoopArrows(splide) {
      splide.on('arrow:mounted', () => {
        // 如果需要在 mounted arrows 時再做一些操作
      });
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
  max-width: 90%; /* 保持圖片不超出容器寬度 */
  height: 100%; /* 讓高度根據寬度自適應 */
  object-fit: contain; /* 避免圖片被裁切，可根據需求改成 cover */
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: transform 0.3s ease; /* 滑鼠懸停效果 */
}
.main-photo:hover {
  transform: scale(1.05);
}

.splide-container {
  padding: 1rem;
}
.splide__pagination {
  bottom: -1.5rem;
}
.splide__pagination__page {
  background-color: gray;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.splide__pagination__page.is-active {
  background-color: red;
}

/* 響應式樣式 */
@media (max-width: 1200px) {
  .main-photo {
    max-width: 80%; /* 在較小螢幕上縮小圖片 */
  }
}

@media (max-width: 768px) {
  .main-photo {
    max-width: 70%; /* 手機裝置上進一步縮小 */
  }
}
</style>
