<template>
  <div>
    <!-- 加載狀態 -->
    <div v-if="loading" class="loading">加載中...</div>

    <!-- 錯誤提示 -->
    <div v-if="error" class="error">
      {{ error.message }}
      <button @click="fetchHousePhotos" class="retry-button">重試</button>
    </div>

    <!-- 照片輪播 -->
    <div v-if="!loading && !error && photos.length > 0">
      <Splide
        :options="splideOptions"
        class="splide-container"
        @arrows-mounted="addLoopArrows"
      >
        <SplideSlide v-for="(photo, index) in photos" :key="index">
          <img
            :src="`data:image/jpeg;base64,${photo}`"
            alt="房屋圖片"
            class="main-photo"
            @click="openPhoto(photo)"
          />
        </SplideSlide>
      </Splide>
    </div>

    <!-- 沒有照片的提示 -->
    <div v-if="!loading && !error && photos.length === 0" class="no-photos">
      <img src="../../assets/no-image.png" alt="暫時無照片展示" />
    </div>

    <!-- 模態框：放大顯示圖片 -->
    <div v-if="showModal" class="modal" @click="closeModal">
      <div class="modal-content">
        <img
          :src="`data:image/jpeg;base64,${selectedPhoto}`"
          alt="放大圖片"
          class="enlarged-photo"
        />
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
      photos: [], // 照片列表
      loading: true, // 是否加載中
      error: null, // 錯誤信息
      showModal: false, // 是否顯示模態框
      selectedPhoto: null, // 當前選擇的照片
      splideOptions: {
        type: "loop", // 啟用循環播放
        perPage: 1,
        focus: "center",
        gap: "1rem",
        padding: { left: "5rem", right: "5rem" },
        pagination: true,
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
            Authorization: `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP 錯誤！狀態碼：${response.status}`);
        }

        const responseBody = await response.text();
        if (responseBody) {
          this.photos = JSON.parse(responseBody) || [];
        } else {
          this.photos = [];
        }
      } catch (err) {
        console.error("獲取房屋照片時發生錯誤：", err);
        this.error = err;
        this.photos = [];
      } finally {
        this.loading = false;
      }
    },
    openPhoto(photo) {
      this.selectedPhoto = photo;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedPhoto = null;
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
  width: auto;
  height: 300px; /* 恢復圖片原高度 */
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
}

.splide-container {
  background-color: #f5deb3;
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
  cursor: pointer;
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
