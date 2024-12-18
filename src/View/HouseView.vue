<template>
  <div v-if="visible" class="modal-overlay" @click.self="handleOverlayClick">
    <div class="modal-content">
      <div class="header">
        <button class="favorite-btn" @click="toggleFavorite">
          <i :class="isFavorited ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
        </button>
        <button class="close-btn" @click="closeModal">
          <i class="bi bi-x-circle"></i>
        </button>
      </div>
      
      <hr />

      <!-- 房屋圖片 -->
      <HousePhotos :houseId="houseId" />
      <hr />
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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';
import HouseTitle from "@/components/houses/page/HouseTitle.vue";
import HouseInfo from "@/components/houses/page/HouseInfo.vue";
import OwnerInfo from "@/components/houses/page/OwnerInfo.vue";
import HouseDescription from "@/components/houses/page/HouseDescription.vue";
import HousePhotos from '@/components/houses/housePhotos.vue';

// 定義接收的 props
const props = defineProps({
  houseId: {
    type: Number,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
});

// 定義 emits 事件
const emit = defineEmits(["close"]);

// 關閉彈窗
const closeModal = () => {
  emit("close"); // 通知父組件關閉彈窗
};

const handleOverlayClick = (event) => {
  if (event.target.classList.contains('modal-overlay')) {
    closeModal();
  }
};

// 定義收藏狀態
const isFavorited = ref(false);

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value;
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 20px;
}

.modal-content {
  background: white;
  padding: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 80vh;
  border-radius: 10px;
  position: relative;
  overflow: auto;
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

@media (max-width: 768px) {
  .modal-content {
    max-width: 90%;
    padding: 10px;
  }

  .close-btn {
    padding: 3px 8px;
  }
}
</style>
