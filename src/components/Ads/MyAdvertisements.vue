<script setup>
import { ref, reactive, watch, onMounted, nextTick } from "vue";
import { useCart } from "@/stores/cartStore";

import AdPageTitle from "@/components/Ads/AdPageTitle.vue";
import AdPaymentStatusFilter from "@/components/Ads/AdPaymentStatusFilter.vue";
import AdPaidDateFilter from "@/components/Ads/AdPaidDateFilter.vue";
import AdUserInputFilter from "@/components/Ads/AdUserInputFilter.vue";
import AddAdButton from "@/components/Ads/AddAdButton.vue";
import CheckCartListButton from "@/components/Ads/CheckCartListButton.vue";
import AdList from "@/components/Ads/AdList.vue";
import Pagination from "@/components/Ads/Pagination.vue";
import NoAdHouseList from "@/components/Ads/NoAdHouseList.vue";
import PopUpMessage from "@/components/Ads/PopUpMessage.vue";
import Overlay from "@/components/Ads/Overlay.vue";
import AdDetailModal from "@/components/Ads/AdDetailModal.vue";
import CartList from "@/components/Ads/CartList.vue";

const filters = reactive({
  page: 1,
  daterange: "all",
  paymentstatus: "all",
  housetitle: "",
});

const isLoading = ref(false);
const showAdList = ref(true);
const ads = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const showOverlay = ref(false);
const showMessage = ref(false);
const messageTitle = ref("");
const messageContent = ref("");
const showAdDetail = ref(false);
const detail = ref({});
const showNoAdHouses = ref(false);
const noAdHouses = ref([]);
const adtypes = ref([]);
const showCart = ref(false);

let token = localStorage.getItem("jwt");

// 取得購物車所需資料：購物車內容 + 使用者擁有的優惠券數量
const cartStore = useCart();

// 初始化
onMounted(async () => {
  isLoading.value = true;
  await filterAds();
  cartStore.initializeCart();
  await getAdtypeAndId();
  isLoading.value = false;
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 篩選條件變更
const changeFilter = (filterName, filterValue) => {
  filters[filterName] = filterValue;
  ads.value = [];
  filters.page = 1;
  filters.housetitle = ""; // 重設 input
  currentPage.value = 1;
  filterAds();
};

// 篩選廣告
const filterAds = async () => {
  console.log("篩選條件: ", filters);

  isLoading.value = true;
  try {
    let url = "http://localhost:8080/api/advertisements/filter";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify(filters),
    });
    const data = await response.json();
    console.log("篩選廣告結果: ", data);
    const { content, totalPages: total } = data;

    ads.value = content;
    totalPages.value = total;

    if (!ads) {
      return;
    }

    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value > 0 ? totalPages.value : 1;
    }

    if (ads.value.length === 0 && currentPage.value !== 1) {
      currentPage.value = 1;
    }

    // 等待 Vue 更新 DOM
    // await nextTick();
    await delay(200);
    
    console.log("Updated ads:", ads.value);
  } catch (error) {
    console.error("發送請求時發生錯誤: ", error);
  } finally {
    isLoading.value = false;
  }
};

// 換頁
const onPageNumberChange = async (page) => {
  currentPage.value = page;
  filters.page = page;
  await filterAds();
};

// 編輯廣告
const showAdDetailFunc = (adDetail) => {
  detail.value = adDetail;
  showOverlay.value = true;
  showAdDetail.value = true;
};

// 關閉廣告詳情
const closeAdDetail = () => {
  showOverlay.value = false;
  showAdDetail.value = false;
  detail.value = {};
  console.log("close ad detail showAdDeatil.value: ", showAdDetail.value);
};

// 顯示無廣告的物件
const toggleNoAdHousesTable = () => {
  filters.page = 1;
  currentPage.value = 1;

  if (showAdList.value === false) {
    showAdList.value = true;
    showNoAdHouses.value = false;
    filterAds();
  } else {
    showAdList.value = false;
    showNoAdHouses.value = true;
    filterNoAdHouses();
    getAdtypeAndId();
  }
};

// 取得廣告類型
const getAdtypeAndId = async () => {
  const url = "http://localhost:8080/api/advertisements/adtypes";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", authorization: `${token}` },
  });
  const data = await response.json();

  console.log("adtypes ", data);

  adtypes.value = data;
};

// 取得沒有掛廣告的房源
const filterNoAdHouses = async () => {
  const url = "http://localhost:8080/api/advertisements/houses/withoutads";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify(filters.page),
    });
    const data = await response.json();

    console.log(data.content);

    noAdHouses.value = data.content;
    console.log("no ad houses: ", noAdHouses.value);
  } catch (error) {
    console.error("請求錯誤: ", error);
  }
};

// 開關購物車
const toggleCart = () => {
  if (showCart.value === true) {
    showCart.value = false;
    showOverlay.value = false;
  } else {
    showCart.value = true;
    showOverlay.value = true;
  }
};

// 刪除廣告結果處理
const handleDeleteAdResult = (result) => {
  console.log("delete result: ", result);
  messageTitle.value = result.messageTitle;
  messageContent.value = result.message;
  showMessage.value = true;

  if (result.success) {
    filterAds();
  }
};

// 關閉提示訊息
const closeMessage = () => {
  showMessage.value = false;
};

const closeOnOverlayClick = () => {
  console.log("close on overlay click: ", showAdDetail.value);
  showMessage.value = false;
  showCart.value = false;
  showAdDetail.value = false;
  showOverlay.value = false;
};

// 監聽 input housetitle 變更
watch(
  () => filters.housetitle,
  async () => {
    filters.page = 1;
    currentPage.value = 1;
    await filterAds();
  }
);
</script>

<template>
  <AdPageTitle />

  <div v-if="isLoading" class="loading-overlay">
    <div class="spinner"></div>
  </div>

  <div class="flex flex-wrap items-center space-x-6 mt-4 mb-6 px-6">
    <div class="flex items-center space-x-6 flex-grow">
      <AdPaymentStatusFilter
        v-model="filters.paymentstatus"
        @filter-change="changeFilter"
      />
      <AdPaidDateFilter
        v-model="filters.daterange"
        @filter-change="changeFilter"
      />
    </div>

    <div class="flex items-center justify-end w-full sm:w-auto">
      <AddAdButton
        @toggle-no-ad-houses="toggleNoAdHousesTable"
        :show-ad-list="showAdList"
      />
    </div>
  </div>

  <div class="flex flex-wrap items-center space-x-6 mt-4 mb-6 px-6">
    <div class="flex items-center space-x-6 flex-grow">
      <AdUserInputFilter v-model="filters.housetitle" />
    </div>

    <div class="flex items-center justify-end w-full sm:w-auto">
      <CheckCartListButton @toggle-cart="toggleCart" />
    </div>
  </div>

  <main class="m-3">
    <div id="view-box" class="border border-gray-400 py-2 px-2 rounded-md">
      <AdList
        v-if="showAdList"
        :ads="ads"
        @ad-delete-result="handleDeleteAdResult"
        @detail="showAdDetailFunc"
      />

      <NoAdHouseList
        v-if="showNoAdHouses"
        :noAdHouses="noAdHouses"
        :adtypes="adtypes"
        @filter-no-ad-houses="filterNoAdHouses"
      />

      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="onPageNumberChange"
      />
    </div>
  </main>

  <Overlay v-show="showOverlay" @click="closeOnOverlayClick" />
  <PopUpMessage
    v-show="showMessage"
    :showMessage="showMessage"
    :messageTitle="messageTitle"
    :message="messageContent"
    @close-message="closeMessage"
  />
  <AdDetailModal
    v-show="showAdDetail"
    :detail="detail"
    @close-detail="closeAdDetail"
  />
  <CartList v-show="showCart" @toggle-cart="toggleCart" />
</template>

<style scoped>
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
