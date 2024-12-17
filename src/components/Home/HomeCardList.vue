<script setup>
import { ref, toRef, watch } from 'vue';
import HouseView from '@/View/HouseView.vue';

// 接收 props 傳遞的 markers
const props = defineProps({
  markers: {
    type: Array,
    required: true,
  },
});

// 創建響應式引用
const markers = toRef(props, 'markers');
const showView = ref(false); // 控制彈窗顯示
const selectedHouseId = ref(null); // 選中的房屋 ID
const selectedTitle = ref(''); // 選中的房屋標題

// 監控 markers 的變化
watch(markers, (newMarkers) => {
  console.log('Markers updated:', newMarkers);
});

// 打開房屋詳情頁面
const openHouseView = (houseId, title) => {
  console.log('openHouseView triggered');  // 確認方法是否被觸發
  console.log('House ID:', houseId);      // 輸出選中的房屋 ID
  console.log('Title:', title);            // 輸出選中的房屋標題
  
  selectedHouseId.value = houseId;
  selectedTitle.value = title;
  showView.value = true;
};
</script>

<template>
    <div class="container py-4 px-4 bg-body custom-shadow">
        <!-- 在此顯示markers.searchList的結構 -->
        <pre>{{ markers.searchList }}</pre>  <!-- 這裡可以檢查數據結構 -->

        <div v-if="markers.searchList && markers.searchList.length">
            <div v-for="list in markers.searchList" :key="list.id" class="col-12 col-md-6">
                <div 
                    class="card card-shadow clickable-card" 
                    style="width: 100%;" 
                    @click="openHouseView(list.id, list.title)">
                    <img src="/src/assets/img/view1.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <p class="card-text">{{ "NT$" + list.price }}</p>
                        <p class="card-text">{{ list.address }}</p>
                    </div>
                </div>
            </div>
        </div>
    
    <!-- 房屋詳細頁面 (彈窗) -->
    <HouseView v-if="showView" :houseId="selectedHouseId" :title="selectedTitle" @close="showView = false" />
    </div>
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
    cursor: pointer;  /* 確保卡片可以被點擊 */
}

.clickable-card {
    cursor: pointer; /* 改變鼠標樣式，表示該區域可點擊 */
}

.card-img-top {
    cursor: pointer; /* 使圖片區域也可點擊 */
}
</style>
