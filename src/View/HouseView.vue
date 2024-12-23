<template>
  <!-- 不用再判斷 `v-if="visible"`, 也不需要自製的 .modal-overlay -->
  <div class="house-view-container">
    <div class="header">
      <!-- 收藏按鈕 -->
      <button class="favorite-btn" @click="toggleFavorite">
        <i :class="isFavorited ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
      </button>
    </div>

    <hr />

    <!-- 房屋圖片 -->
    <HousePhotos :houseId="houseId" />
    <hr />

    <!-- 房屋標題 -->
    <HouseTitle :houseId="houseId" />
    <hr />

    <div class="info-container">
      <!-- 房屋信息 -->
      <HouseInfo :houseId="houseId" />
      <!-- 房東信息 -->
      <OwnerInfo :houseId="houseId" />
    </div>

    <hr />

    <!-- 房屋描述 -->
    <HouseDescription :houseId="houseId" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import HouseTitle from "@/components/houses/page/HouseTitle.vue";
import HouseInfo from "@/components/houses/page/HouseInfo.vue";
import OwnerInfo from "@/components/houses/page/OwnerInfo.vue";
import HouseDescription from "@/components/houses/page/HouseDescription.vue";
import HousePhotos from '@/components/houses/housePhotos.vue';

// 定義接收的 props
const props = defineProps({
  houseId: {
    type: Number,
    required: true, // 需傳入houseId，否則警告
  },
});

// 定義 emits 事件
const emit = defineEmits(["close"]);

// 關閉視窗的函式
function closeModal() {
  emit("close"); // 通知父組件關閉彈窗
}

// 收藏狀態
const isFavorited = ref(false);
function toggleFavorite() {
  isFavorited.value = !isFavorited.value;
}
</script>

<style scoped>
.house-view-container {
  /* 這個容器由外層（例如 <Dialog>）控制大小、可視／不可視 */
  background-color: #ffffff;
  border-radius: 8px;
  padding: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.close-btn .bi {
  font-size: 24px;
  color: blue; /* 設置成藍色 */
}

.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.favorite-btn .bi {
  font-size: 24px;
  color: red;
}

.info-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
