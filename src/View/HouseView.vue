<template>
    <div v-if="visible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">X</button>
        <HouseTitle :houseId="houseId" />
        <hr />
        <HousePhotos :houseId="houseId"/>
        <hr />
        <div class="info-container">
          <HouseInfo :houseId="houseId" />
          <OwnerInfo :houseId="houseId" />
        </div>
        <hr />
        <HouseDescription :houseId="houseId" />
      </div>
    </div>
  </template>
  
  <script setup>
  import HouseTitle from "@/components/houses/page/HouseTitle.vue";

  import HouseInfo from "@/components/houses/page/HouseInfo.vue";
  import OwnerInfo from "@/components/houses/page/OwnerInfo.vue";
  import HouseDescription from "@/components/houses/page/HouseDescription.vue";
import HousePhotos from "@/components/houses/housePhotos.vue";
  
  defineProps({
    houseId: {
      type: Number,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  });
  
  const emit = defineEmits(["close"]);
  
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
  