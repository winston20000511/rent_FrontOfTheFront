<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue';
import { useCart } from "@/stores/cartStore";
import axios from 'axios';

import AdPageTitle from '@/components/Ads/AdPageTitle.vue';
import AdPaymentStatusFilter from '@/components/Ads/AdPaymentStatusFilter.vue';
import AdPaidDateFilter from '@/components/Ads/AdPaidDateFilter.vue';
import AdUserInputFilter from '@/components/Ads/AdUserInputFilter.vue';
import AddAdButton from '@/components/Ads/AddAdButton.vue';
import CheckCartListButton from '@/components/Ads/CheckCartListButton.vue';
import AdList from '@/components/Ads/AdList.vue';
import Pagination from '@/components/Ads/Pagination.vue';
import NoAdHouseList from '@/components/Ads/NoAdHouseList.vue';
import PopUpMessage from '@/components/Ads/PopUpMessage.vue';
import Overlay from '@/components/Ads/Overlay.vue';
import AdDetailModal from '@/components/Ads/AdDetailModal.vue';
import CartList from '@/components/Ads/CartList.vue';

const filters = reactive({
    page: 1,
    daterange: "all",
    paymentstatus: "all",
    input: "",
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

// 初始化
onMounted(async () => {
    await filterAds();
});

// 篩選條件變更
const changeFilter = (filterName, filterValue) => {
    filters[filterName] = filterValue;
    ads.value = [];
    filters.page = 1;
    filters.input = ""; // 重設 input
    currentPage.value = 1;
    filterAds();
};

// 篩選廣告
const filterAds = async () => {
    console.log("篩選條件: ", filters);
    try {

        const response = await axios.post("/advertisements/filter", filters);
        const { content, totalPages: total } = response.data;
        ads.value = content;
        totalPages.value = total;

        if (currentPage.value > totalPages.value) {
            currentPage.value = totalPages.value > 0 ? totalPages.value : 1;
        }

        if (ads.value.length === 0 && currentPage.value !== 1) {
            currentPage.value = 1; 
        }

        // 等待 Vue 更新 DOM
        await nextTick();
        console.log('Updated ads:', ads.value);
    } catch (error) {
        console.error("發送請求時發生錯誤: ", error);
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
    const response = await axios.get("/advertisements/adtypes");
    adtypes.value = response.data;
    console.log("ad types: ", response.data);
};

// 取得沒有掛廣告的房源
const filterNoAdHouses = async () => {
    const url = "/advertisements/houseswithoutadds";
    try {
        const response = await axios.post(url, filters.page, {
            headers: { 'Content-Type': 'application/json' },
        });
        noAdHouses.value = response.data.content;
        console.log("no ad houses: ", response.data);
    } catch (error) {
        console.error("請求錯誤: ", error);
    }
};

// 開關購物車
const toggleCart = () => {
    if (showCart.value === true) {
        showCart.value = false;
    } else {
        getCartInfo();
        showCart.value = true;
    }
};

// 取得購物車資料
const cartStore = useCart();
async function getCartInfo() {
    cartStore.loadCart();
};

// 刪除廣告結果處理
const handleDeleteAdResult = (result) => {
    messageTitle.value = result.messageTitle;
    messageContent.value = result.message;
    showMessage.value = true;

    if (result.sucess) {
        filterAds();
    }
};

// 關閉提示訊息
const closeMessage = () => {
    showMessage.value = false;
};

// 監聽 input 變更
watch(() => filters.input, async () => {
    filters.page = 1;
    currentPage.value = 1; 
    await filterAds();
});

</script>


<template>
    <AdPageTitle />

    <div class="flex flex-wrap items-center space-x-6 mt-4 mb-6 px-6">
        <div class="flex items-center space-x-6 flex-grow">
            <AdPaymentStatusFilter v-model="filters.paymentstatus" @filter-change="changeFilter" />
            <AdPaidDateFilter v-model="filters.daterange" @filter-change="changeFilter" />
        </div>

        <div class="flex items-center justify-end w-full sm:w-auto">
            <AddAdButton @toggle-no-ad-houses="toggleNoAdHousesTable" :show-ad-list="showAdList"/>
        </div>
    </div>

    <div class="flex flex-wrap items-center space-x-6 mt-4 mb-6 px-6">
        <div class="flex items-center space-x-6 flex-grow">
            <AdUserInputFilter v-model="filters.input"/>
        </div>

        <div class="flex items-center justify-end w-full sm:w-auto">
            <CheckCartListButton @toggle-cart="toggleCart"/>
        </div>
    </div>

    <main class="m-3">
        <div id="view-box" class="border border-gray-400 py-2 px-2 rounded-md">
            <AdList v-if="showAdList" :ads="ads" @ad-delete-result="handleDeleteAdResult" @detail="showAdDetailFunc"/>
            <NoAdHouseList v-if="showNoAdHouses" :noAdHouses="noAdHouses" :adtypes="adtypes"/>
            <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="onPageNumberChange"/>
        </div>
    </main>

    <Overlay v-if="showOverlay"/>
    <PopUpMessage v-show="showMessage" :showMessage="showMessage" :messageTitle="messageTitle" :message="messageContent" @close-message="closeMessage" />
    <AdDetailModal v-show="showAdDetail" :detail="detail" @close-detail="closeAdDetail"/>
    <CartList v-show="showCart" @toggle-cart="toggleCart" :cartStore="cartStore"/>
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
