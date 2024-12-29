<script setup>
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import HouseView from "@/View/HouseView.vue";
import HousePhotos from "../houses/housePhotos.vue";
import { onMounted } from "vue";
import { useHouseCard } from "@/stores/CardHouseStore";

const props = defineProps({
  markers: {
    type: Object,
    required: true,
  },
  ads: {
    type: Object,
    required: true,
  }
  },);
onMounted(() => {
  if (props.markers?.searchList?.length > 0) {
    const houseIds = props.markers.searchList.map((house) => house.houseid); // 提取所有 houseId
    fetchAllClickCounts(houseIds); // 加載點擊數
  } else {
    console.error("No markers or searchList provided");
  }
});
const store = useHouseCard();
const showView = ref(false);
const selectedHouseId = ref(null);
const clickCounts = ref({}); // 儲存每個房屋的點擊數

async function fetchAllClickCounts(houseIds) {
  try {
    const response = await fetch(`http://localhost:8080/api/houses/clickCounts?houseIds=${houseIds.join(",")}`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    });
    if (response.ok) {
      const clickCountsData = await response.json();
      clickCounts.value = clickCountsData; // 更新到 Vue 的狀態
    } else {
      console.error("Failed to fetch all click counts");
    }
  } catch (error) {
    console.error("Error fetching all click counts:", error);
  }
}

async function fetchClickCount(houseId) {
  try {
    const response = await fetch(`http://localhost:8080/api/houses/${houseId}/clickCount`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    });
    if (response.ok) {
      return await response.json(); // 返回當前點擊數
    } else {
      console.error(`Failed to fetch click count for houseId: ${houseId}`);
      return 0;
    }
  } catch (error) {
    console.error("Error fetching click count:", error);
    return 0;
  }
}

// 增加點擊數
async function incrementClickCount(houseId) {
  try {
    const response = await fetch(`http://localhost:8080/api/houses/${houseId}/incrementClick`, {
      method: "PUT",
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    });
    if (!response.ok) {
      console.error(`Failed to increment click count for houseId: ${houseId}`);
    }
  } catch (error) {
    console.error("Error incrementing click count:", error);
  }
}
// 打開房屋詳細信息視窗
async function openHouseView(houseId) {
  selectedHouseId.value = Number(houseId);
  showView.value = true;

  try {
    // 增加點擊數
    await incrementClickCount(houseId);

    // 獲取最新點擊數
    const updatedClickCount = await fetchClickCount(houseId);
    clickCounts.value[houseId] = updatedClickCount;
  } catch (error) {
    console.error("Error handling house view:", error);
  }
}
// 關閉詳細信息視窗
function closeHouseView() {
  showView.value = false;
}

// 根據日期條件設置卡片樣式
function getCardClass(item) {
  const dateSpec = "1999-01-01T00:00:00";
  const sourceDate = new Date(item);
  const targetDate = new Date(dateSpec);

  if (sourceDate > targetDate) {
    return "bg-info bg-opacity-25 text-white"
  } else {
    return ""
  }

}
</script>

<template>
  <div class="container py-4 px-4 bg-body custom-shadow">
    <!-- 房屋列表 -->
    <div v-if="markers.searchList && markers.searchList.length" class="row">
      <div
        v-for="list in markers.searchList"
        :key="list.houseid"
        class="col-12 col-md-6 py-4"
      >
        <div
          class="card card-shadow clickable-card px-2 py-2"
          style="width: 100%"
          :class="getCardClass(list.paidDate)"
          @click="openHouseView(list.houseid)"
        >
          <!-- 房屋照片 -->
          <HousePhotos :houseId="list.houseid" @click.stop />
          <div class="card-body">
            <p class="card-text" style="font-size: 20px; font-weight: bold; color: black;">{{ list.houseTitle }}</p>
            <p class="card-text" style="color: black;">NT${{ list.price }}</p>
            <p class="card-text" style="color: black;">{{ list.address }}</p>
            <!-- 點擊數顯示 -->
            <div class="d-flex justify-content-end align-items-center">
              <i class="pi pi-eye" style="margin-right: 5px;"></i>
              <span class="text-muted">{{ clickCounts[list.houseid] || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 詳細信息對話框 -->
  <Dialog
    v-model:visible="showView"
    modal
    appendTo="body"
    :style="{ width: '80vw', maxWidth: '900px', height: '80vh', maxHeight: '90vh' }"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    header="房屋資訊"
    :closable="true"
    @hide="closeHouseView"
  >
    <HouseView :houseId="selectedHouseId" @close="closeHouseView" />
  </Dialog>
</template>

<style scoped>
.container {
  margin: 0;
  padding: 0;
}
.custom-shadow {
  margin: 0 0 0 5px;
  box-shadow: -5px 0px 5px -3px rgba(0, 0, 0, 0.4);
}
.card-shadow {
  box-shadow: -5px 5px 5px -3px rgba(0, 0, 0, 0.4);
}
.clickable-card,
.card-img-top,
.card-body {
  cursor: pointer;
}
</style>
