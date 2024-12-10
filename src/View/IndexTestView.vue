<script setup>
import { ref } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import BookingView from './BookingView.vue';

// 控制彈窗顯示狀態
const showBookingModal = ref(false);

// 關閉彈窗方法
const closeBookingModal = () => {
  showBookingModal.value = false;
};

</script>

<template>
  <!-- 房子介紹按鈕 -->
  <button type="button" class="btn btn-primary" @click="showBookingModal = true">
    預約看房
  </button>

  <!-- 自定義彈窗 -->
  <div
    v-if="showBookingModal"
    class="custom-modal-overlay"
    @click.self="closeBookingModal"
  >
    <div class="custom-modal">
      <div class="custom-modal-header">
        <h2>預約看房</h2>
        <button type="button" class="close-button" @click="closeBookingModal">
          &times;
        </button>
      </div>
      <div class="custom-modal-body">
        <!-- 載入 BookingView -->
        <BookingView />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 遮罩層樣式 */
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 彈窗樣式 */
.custom-modal {
  background: #fff;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-out;
}

/* 彈窗頭部樣式 */
.custom-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
}

.custom-modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.close-button {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

/* 彈窗內容樣式 */
.custom-modal-body {
  padding: 20px;
}

/* 動畫 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>