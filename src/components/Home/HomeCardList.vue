<script setup>
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import HouseView from "@/View/HouseView.vue";

const props = defineProps({
  markers: {
    type: Object,
    required: true,
  },
});

const showView = ref(false);
const selectedHouseId = ref(null);
const clickCounts = ref({}); // 儲存每個房屋的點擊數

watch(
  () => props.markers,
  (newVal) => {
    if (newVal?.searchList?.length) {
      // 初始化 clickCounts
      newVal.searchList.forEach((house) => {
        if (!clickCounts.value[house.houseid]) {
          fetchClickCount(house.houseid);
        }
      });
    }
  },
  { immediate: true }
);

async function openHouseView(houseId) {
  selectedHouseId.value = Number(houseId);
  showView.value = true;

  // 增加點擊數
  try {
    await incrementClickCount(houseId);
    clickCounts.value[houseId] += 1; // 更新本地點擊數
  } catch (error) {
    console.error("Failed to increment click count:", error);
  }
}

async function incrementClickCount(houseId) {
  const response = await fetch(`/api/houses/${houseId}/incrementClick`, {
    method: "PUT",
    headers: {
      Authorization: localStorage.getItem("jwt"),
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to increment click count for houseId: ${houseId}`);
  }
}

async function fetchClickCount(houseId) {
  try {
    const response = await fetch(`/api/houses/${houseId}/clickCount`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    });
    if (response.ok) {
      const count = await response.json();
      clickCounts.value[houseId] = count;
    } else {
      console.error(`Failed to fetch click count for houseId: ${houseId}`);
    }
  } catch (error) {
    console.error("Error fetching click count:", error);
  }
}

function closeHouseView() {
  showView.value = false;
}

function getCardClass(item){

  const dateSpec = '1999-01-01T00:00:00';
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
    <div v-if="markers.searchList && markers.searchList.length" class="row">
      <div
        v-for="list in markers.searchList"
        :key="list.houseid"
        class="col-12 col-md-6 py-4"
      >
        <div class="card card-shadow clickable-card px-2 py-2" 
          style="width: 100%"
          :class="getCardClass(list.paidDate)"
          @click="openHouseView(list.houseid)"
        >
          <img
            :src="list.image || '/src/assets/img/view1.jpg'"
            class="card-img-top"
            alt="House Image"
          />
          <div class="card-body">
            <p class="card-text" style="font-size: 20px; font-weight: bold;">{{ list.houseTitle }}</p>
            <p class="card-text">NT${{ list.price }}</p>
            <p class="card-text">{{ list.address }}</p>
            <!-- 顯示點擊數 -->
            <div class="d-flex justify-content-end align-items-center">
              <i class="pi pi-eye" style="margin-right: 5px;"></i>
              <span class="text-muted">{{ clickCounts[list.houseid] || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Dialog
    v-model:visible="showView"
    modal
    appendTo="body"
    :style="{ width: '80vw', maxWidth: '900px', height: '80vh', maxHeight: '90vh' }"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    header="房屋資訊"
    :closable="true"
    @hide="showView = false"
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
