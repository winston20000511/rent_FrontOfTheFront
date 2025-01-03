<script setup>
import { ref, reactive, watch, onMounted } from "vue";

import OrderPageTitle from "@/components/Orders/OrderPageTitle.vue";
import OrderStatusFilter from "@/components/Orders/OrderStatusFilter.vue";
import OrderDateFilter from "@/components/Orders/OrderDateFilter.vue";
import OrderUserInputFilter from "@/components/Orders/OrderUserInputFilter.vue";
import CreateOrderButton from "@/components/Orders/CreateOrderButton.vue";
import OrderDetailModal from "@/components/Orders/OrderDetailModal.vue";
import PopUpMessage from "@/components/Ads/PopUpMessage.vue";
import OrderList from "@/components/Orders/OrderList.vue";
import Overlay from "@/components/Ads/Overlay.vue";

const filters = reactive({
  page: 1,
  status: "all",
  daterange: "all",
  inputcondition: "none",
  input: "",
});

const orders = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const showMessage = ref(false);
const messageTitle = ref("");
const messageContent = ref("");
const isCancelOrder = ref(false);
const showOrderDetail = ref(false);
const detail = ref({});
const showOverlay = ref(false);
const isLoading = ref(false);

let token = localStorage.getItem("jwt");

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const changeFilter = (filterName, filterValue) => {
  filters[filterName] = filterValue;
  filters.page = 1;
  filters.input = "";
  currentPage.value = 1;
  filterOrders();
};

const updateInput = (input) => {
  currentPage.value = 1;
  filters.input = input;
};

const filterOrders = async () => {
  console.log("變更的篩選條件: ", filters);

  isLoading.value = true;

  try {
    const url = "http://localhost:8080/api/orders/filter";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify(filters),
    });

    const { content, totalPages: total } = await response.json();

    orders.value = content;
    totalPages.value = total;

    await delay(200);
  } catch (error) {
    console.error("發送請求時有錯誤: ", error);
  } finally {
    isLoading.value = false;
  }
};

const onPageNumberChange = async (page) => {
  currentPage.value = page;
  filters.page = page;
  await filterOrders();
};

const handleOrderCancelResult = (result) => {
  console.log("取消結果: ", result);

  showOverlay.value = true;
  messageTitle.value = result.messageTitle;
  messageContent.value = result.message;
  showMessage.value = true;
  isCancelOrder.value = result.success && result.messageTitle.includes("取消");

  if (result.success) {
    const order = orders.value.find(
      (order) => order.merchantTradNo === result.merchantTradNo
    );
    if (order) order.orderStatus = "取消中";
  }
};

const closeMessage = () => {
  showMessage.value = false;
  showOverlay.value = false;
};

const showOrderDetailFunc = (orderDetail) => {
  detail.value = orderDetail;
  showOverlay.value = true;
  showOrderDetail.value = true;
};

const closeOrderDetail = () => {
  showOverlay.value = false;
  showOrderDetail.value = false;
  detail.value = {};
};

const onOverlayClick = () => {
  showOrderDetail.value = false;
  showMessage.value = false;
  showOverlay.value = false;
};

watch(
  () => filters.input,
  () => {
    filterOrders();
  }
);

onMounted(() => {
  filterOrders();
});
</script>

<template>
  <OrderPageTitle />

  <div v-if="isLoading" class="loading-overlay">
    <div class="spinner"></div>
  </div>

  <div class="flex flex-wrap items-center space-x-6 mt-4 mb-6 px-6">
    <OrderStatusFilter v-model="filters.status" @filter-change="changeFilter" />
    <OrderDateFilter
      v-model="filters.daterange"
      @filter-change="changeFilter"
    />
    <OrderUserInputFilter
      @filter-change="changeFilter"
      @input-update="updateInput"
    />
  </div>

  <div class="w-full text-right px-4">
    <CreateOrderButton @click-create-btn="goToAddAd" />
  </div>

  <main class="m-3">
    <OrderList
      :orders="orders"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="onPageNumberChange"
      @order-cancel-result="handleOrderCancelResult"
      @detail="showOrderDetailFunc"
    />
  </main>

  <Overlay v-show="showOverlay" @click="onOverlayClick" />
  <OrderDetailModal
    v-show="showOrderDetail"
    :detail="detail"
    @close-detail="closeOrderDetail"
  />
  <PopUpMessage
    v-show="showMessage"
    :showMessage="showMessage"
    :messageTitle="messageTitle"
    :message="messageContent"
    :isCancelOrder="isCancelOrder"
    @close-message="closeMessage"
  />
</template>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/tailwindcss@^2.2.19/dist/tailwind.min.css");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");
@import url("/src/assets/adAndOrderFront.css");

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>