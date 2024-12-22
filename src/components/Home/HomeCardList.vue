<script setup>
import { ref, toRef, watch } from "vue";
import HousePhotos from "../houses/housePhotos.vue";
import HouseView from "@/View/HouseView.vue";

// 接收 props 傳遞的 markers
const props = defineProps({
  markers: {
    type: Object,
    required: true,
  },
});

// 創建響應式引用
const showView = ref(false); // 控制彈窗顯示
const selectedHouseId = ref(null); // 選中的房屋 ID

// 監控 markers 的變化
watch(
  () => props.markers,
  (newMarkers) => {
    console.log("Markers updated:", newMarkers);
  }
);

// 打開房屋詳情頁面，僅傳遞 houseId
const openHouseView = (houseId) => {
  console.log("openHouseView triggered");
  console.log("House ID:", houseId);

  selectedHouseId.value = String(houseId);
  showView.value = true;
};

// 關閉彈窗
const closeHouseView = () => {
  showView.value = false; // 隱藏彈窗
};
</script>

<template>
  <div class="container py-4 px-4 bg-body custom-shadow">
    <div
      v-if="props.markers.searchList && props.markers.searchList.length"
      class="row"
    >
      <div
        v-for="list in props.markers.searchList"
        :key="list.houseid"
        class="col-12 col-md-6 py-4"
      >
        <div
          class="card card-shadow clickable-card"
          style="width: 100%"
          @click="openHouseView(list.houseid)"
        >
          <!-- 只傳遞 houseId -->
          <img src="/src/assets/img/view1.jpg" class="card-img-top" alt="..." />
          <div class="card-body">
            <p class="card-text">{{ "NT$" + list.price }}</p>
            <p class="card-text">{{ list.address }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 房屋詳細頁面 (彈窗) -->
  <HouseView
    v-if="showView"
    :houseId="selectedHouseId"
    @close="closeHouseView"
    :useOverlay="true"
  />
</template>

<style scoped>
.custom-shadow {
  position: relative;
  margin: 0px 0px 0px 5px;
  box-shadow: -5px 0px 5px -3px rgba(0, 0, 0, 0.4);
}

.card-shadow {
  position: relative;
  box-shadow: -5px 5px 5px -3px rgba(0, 0, 0, 0.4);
}

.card-body {
  cursor: pointer; /* 確保卡片可以被點擊 */
}

.clickable-card {
  cursor: pointer; /* 改變鼠標樣式，表示該區域可點擊 */
}

.card-img-top {
  cursor: pointer; /* 使圖片區域也可點擊 */
}
</style>
