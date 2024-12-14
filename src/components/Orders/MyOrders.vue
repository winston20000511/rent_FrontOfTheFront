<script setup>
  import { ref, reactive, watch, onMounted } from 'vue';
  import axios from 'axios';
  
  import OrderPageTitle from '@/components/Orders/OrderPageTitle.vue';
  import OrderStatusFilter from '@/components/Orders/OrderStatusFilter.vue';
  import OrderDateFilter from '@/components/Orders/OrderDateFilter.vue';
  import OrderUserInputFilter from '@/components/Orders/OrderUserInputFilter.vue';
  import CreateOrderButton from '@/components/Orders/CreateOrderButton.vue';
  import OrderDetailModal from '@/components/Orders/OrderDetailModal.vue';
  import PopUpMessage from '@/components/Ads/PopUpMessage.vue';
  import OrderList from '@/components/Orders/OrderList.vue';
  import Overlay from '@/components/Ads/Overlay.vue';

  const filters = reactive({
    page: 1,
    status: "all",
    daterange: "all",
    inputcondition: "none",
    userInput: "",
  });

  const orders = ref([]);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const showMessage = ref(false);
  const messageTitle = ref('');
  const messageContent = ref('');
  const showOrderDetail = ref(false);
  const detail = ref({});
  const showOverlay = ref(false);

  const goToAddAd = () => {
    console.log("點到新增VIP服務的按鈕");
  };

  const changeFilter = (filterName, filterValue) => {
    filters[filterName] = filterValue;
    filters.page = 1;
    filters.userInput = "";
    currentPage.value = 1;
    filterOrders();
  };

  const updateInput = (input) => {
    currentPage.value = 1;
    filters.userInput = input;
  };

  const filterOrders = async () => {
    console.log("變更的篩選條件: ", filters);
    try {
      const response = await axios.post("/api/orders/filter", filters);
      const { content, totalPages: total } = response.data;
      orders.value = content;
      totalPages.value = total;
    } catch (error) {
      console.error("發送請求時有錯誤: ", error);
    }
  };

  const onPageNumberChange = async (page) => {
    currentPage.value = page;
    filters.page = page;
    await filterOrders();
  };

  const handleOrderCancelResult = (result) => {
    messageTitle.value = result.messageTitle;
    messageContent.value = result.message;
    showMessage.value = true;

    if (result.sucess) {
      const order = orders.value.find((order) => order.merchantTradNo === result.merchantTradNo);
      if (order) order.orderStatus = "取消中";
    }
  };

  const closeMessage = () => {
    showMessage.value = false;
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

  watch(() => filters.userInput, () => {
    filterOrders();
  });

  onMounted(() => {
    filterOrders();
  });
</script>

<template>
  <OrderPageTitle />

  <div class="flex flex-wrap items-center space-x-6 mt-4 mb-6 px-6">
    <OrderStatusFilter v-model="filters.status" @filter-change="changeFilter" />
    <OrderDateFilter v-model="filters.daterange" @filter-change="changeFilter" />
    <OrderUserInputFilter @filter-change="changeFilter" @input-update="updateInput" />
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

  <Overlay v-show="showOverlay"/>
  <OrderDetailModal v-show="showOrderDetail" :detail="detail" @close-detail="closeOrderDetail" />
  <PopUpMessage v-show="showMessage" :showMessage="showMessage" :messageTitle="messageTitle" :message="messageContent" @close-message="closeMessage" />
</template>

<style scoped>
  @import url("https://npmcdn.com/flatpickr/dist/themes/dark.css");
  @import url("https://cdn.jsdelivr.net/npm/tailwindcss@^2.2.19/dist/tailwind.min.css");
  @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");
  @import url("https://fonts.googleapis.com");
  @import url("https://fonts.gstatic.com");
  @import url("https://fonts.googleapis.com/css2?family=Pacifico&display=swap");

  @import url("/src/assets/adAndOrderFront.css");
</style>
