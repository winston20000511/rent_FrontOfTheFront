<script setup>
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";         // 引入 PrimeVue 的 Dialog
import HouseView from "@/View/HouseView.vue"; // 你的 HouseView 元件

// 接收 props
const props = defineProps({
  markers: {
    type: Object,
    required: true,
  },
});

// 控制彈窗顯示/隱藏
const showView = ref(false);
// 儲存當前選擇的 houseId
const selectedHouseId = ref(null);

// 監聽 markers（可選）
watch(
  () => props.markers,
  (newMarkers) => {
    console.log("Markers updated:", newMarkers);
  }
);

/**
 * 打開房屋詳細彈窗
 * @param houseId - 從卡片取得的 ID
 */
function openHouseView(houseId) {
  console.log("Opening HouseView for houseId:", houseId);
  // 由於 HouseView 裡定義 houseId = Number，需要轉型為 Number
  selectedHouseId.value = Number(houseId);
  showView.value = true;
}

/** 關閉房屋詳細彈窗 */
function closeHouseView() {
  showView.value = false;
}
</script>

<template>
  <div class="container py-4 px-4 bg-body custom-shadow">
    <div v-if="markers.searchList && markers.searchList.length" class="row">
      <div
        v-for="list in markers.searchList"
        :key="list.houseid"
        class="col-12 col-md-6 py-4"
      >
        <div
          class="card card-shadow clickable-card"
          style="width: 100%"
          @click="openHouseView(list.houseid)"
        >
          <!-- 若 list.image 有資料則用，否則預設 /src/assets/img/view1.jpg -->
          <img
            :src="list.image || '/src/assets/img/view1.jpg'"
            class="card-img-top"
            alt="House Image"
          />
          <div class="card-body">
            <p class="card-text">NT${{ list.price }}</p>
            <p class="card-text">{{ list.address }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 使用 PrimeVue 的 Dialog 來顯示 HouseView -->
  <Dialog
    v-model:visible="showView"
    modal                             
    appendTo="body"                  
    :closable="true"                
    header="房屋資訊"               
    :style="{ width: '50vw' }"        
  >
    <!-- 在 Dialog 裡顯示 HouseView -->
    <HouseView
      :houseId="selectedHouseId"
      @close="closeHouseView"        
    />
  </Dialog>
</template>

<style scoped>
.container {
  margin: 0;
  padding: 0;
}
.custom-shadow {
  margin: 0px 0px 0px 5px;
  box-shadow: -5px 0px 5px -3px rgba(0, 0, 0, 0.4);
}
.card-shadow {
  box-shadow: -5px 5px 5px -3px rgba(0, 0, 0, 0.4);
}
.card-body,
.clickable-card,
.card-img-top {
  cursor: pointer;
}
</style>
