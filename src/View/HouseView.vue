<template>
    <div v-if="visible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">X</button>
        
        <!-- 房屋標題 -->
        <HouseTitle :houseId="houseId" />
        <hr />
        
        <!-- 房屋圖片 -->
        <HousePhotos :houseId="houseId" />
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
  import { defineProps, defineEmits } from 'vue';
  import HouseTitle from "@/components/houses/page/HouseTitle.vue";
  import HouseInfo from "@/components/houses/page/HouseInfo.vue";
  import OwnerInfo from "@/components/houses/page/OwnerInfo.vue";
  import HouseDescription from "@/components/houses/page/HouseDescription.vue";
  
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
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    width: 90%;
    max-width: 800px;
    border-radius: 10px;
    position: relative;
  }
  
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: red;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
  }
  
  .info-container {
    display: flex;
    justify-content: space-between;
  }
  </style>
  