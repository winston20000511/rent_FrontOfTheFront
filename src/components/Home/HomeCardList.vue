<script setup>
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import HouseView from "@/View/HouseView.vue";

// 接收 props
const props = defineProps({
  markers: {
    type: Object,
    required: true,
  },
});

// 狀態
const showView = ref(false);
const selectedHouseId = ref(null);

// 監聽 markers
watch(
  () => props.markers,
  (newVal) => {
    console.log("Markers updated:", newVal);
  }
);

function openHouseView(houseId) {
  console.log("Open HouseView for houseId:", houseId);
  selectedHouseId.value = Number(houseId); // HouseView 需要 Number
  showView.value = true;
}

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
        <div class="card card-shadow clickable-card" style="width: 100%"
          @click="openHouseView(list.houseid)"
        >
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

  <!-- Dialog 彈窗，appendTo="body" & breakpoints -->
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
    <!-- 將 HouseView 放入 Dialog -->
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
