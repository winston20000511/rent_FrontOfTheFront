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
          <div class="card-header">
            <div style="float: left;">
              <span v-if="getShowGood(list.paidDate)" class="badge bg-warning" style="font-size: 20px;">{{ hotMark }}</span>
            </div>
            <div style="float: right;" class="d-flex justify-content-end align-items-center">
              <i class="pi pi-eye" style="margin-right: 5px;"></i>
              <span class="text-muted">{{ clickCounts[list.houseid] || 0 }}</span>
            </div>
          </div>
          <HousePhotos :houseId="list.houseid" @click.stop />
          <div class="card-body">
            <p class="card-text" style="font-size: 20px; font-weight: bold;">{{ list.houseTitle }}</p>
            <p class="card-text">NT${{ list.price }}</p>
            <p class="card-text">{{ list.address }}</p>
          </div>
        </div>

        <!-- 每次渲染时更新点击数 -->
        <div v-if="scheduleClickCountUpdate(list.houseid)" style="display: none;"></div>
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
    @hide="closeHouseView"
  >
    <HouseView :houseId="selectedHouseId" @close="closeHouseView" />
  </Dialog>
</template>

<script setup>
import { ref } from "vue";
import Dialog from "primevue/dialog";
import HouseView from "@/View/HouseView.vue";
import HousePhotos from "../houses/housePhotos.vue";
import { useHouseCard } from "@/stores/CardHouseStore";

const props = defineProps({
  markers: {
    type: Object,
    required: true,
  },
  ads: {
    type: Object,
    required: true,
  },
});

const store = useHouseCard();
const showView = ref(false);
const selectedHouseId = ref(null);
const clickCounts = ref({});
const hotMark = ref('');

async function fetchClickCount(houseId) {
  try {
    const response = await fetch(`http://localhost:8080/api/houses/${houseId}/clickCount`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      console.error(`Failed to fetch click count for houseId: ${houseId}`);
      return 0;
    }
  } catch (error) {
    console.error("Error fetching click count:", error);
    return 0;
  }
}

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

function scheduleClickCountUpdate(houseId) {
  setTimeout(async () => {
    try {
      clickCounts.value[houseId] = await fetchClickCount(houseId);
    } catch (error) {
      console.error(`Error updating click count for houseId: ${houseId}`, error);
    }
  }, 1000); // 延时1秒更新

  return true; // 确保渲染后执行一次
}

async function openHouseView(houseId) {
  selectedHouseId.value = Number(houseId);
  showView.value = true;

  try {
    await incrementClickCount(houseId);
    clickCounts.value[houseId] = await fetchClickCount(houseId);
  } catch (error) {
    console.error("Error handling house view:", error);
  }
}

function closeHouseView() {
  showView.value = false;
}

function getShowGood(item) {
  const dateSpec = "1999-01-01T00:00:00";
  const sourceDate = new Date(item);
  const targetDate = new Date(dateSpec);

  if (sourceDate > targetDate) {
    hotMark.value = '推薦';
    return true;
  } else {
    hotMark.value = '';
    return false;
  }
}
</script>

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
.card-header-custom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.card {
  max-width: 800px; 
  max-height: 500px; 
  overflow: hidden; 
}

.card .card-img-top img {
  max-height: 200px; 
  max-width: 100%; 
  object-fit: cover; 
}
</style>
