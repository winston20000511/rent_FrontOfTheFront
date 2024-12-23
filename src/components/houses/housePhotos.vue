<template>
  <div>
    <div v-if="loading" class="loading">加載中...</div>
    <div v-if="error" class="error">
      {{ error.message }}
      <button @click="fetchHousePhotos" class="retry-button">重試</button>
    </div>
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
          />
        </SplideSlide>
      </Splide>
    </div>
    <div v-if="!loading && !error && photos.length === 0" class="no-photos">
      <img src="../../assets/no-image.png" alt="暫時無照片展示" />
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
      photos: [],
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
    addLoopArrows(splide) {
      splide.on('arrow:mounted');
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

/* >>>> 使用 aspect-ratio 及 object-fit: cover */
.main-photo {
  display: block;
  margin: 0 auto;
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 8px;
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
</style>
