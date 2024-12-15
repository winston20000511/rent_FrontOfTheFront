<script setup>
/* 待補: 加入購物車 & 更新 noAdHouses 的分頁 */
import { ref, reactive, watch, onMounted } from 'vue';
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
    userInput: "",
});

// 確保載入(還沒用到)
const isLoading = ref(false);

// 廣告列表
const showAdList = ref(true);
const ads = ref([]);

// 篩選項目
const currentPage = ref(1);
const totalPages = ref(1);

// 背景遮罩
const showOverlay = ref(false);

// 提示訊息
const showMessage = ref(false);
const messageTitle = ref("");
const messageContent = ref("");

// 廣告詳細
const showAdDetail = ref(false);
const detail = ref({});

// 沒有廣告推播的物件
const showNoAdHouses = ref(false);
const noAdHouses = ref([]);
const adtypes = ref([]);

// 購物車
const showCart = ref(false);
const cartItems = ref([]);


// 初始化
onMounted(async () => {
    filterAds();
});

// 篩選條件變更
const changeFilter = (filterName, filterValue) => {
    filters[filterName] = filterValue;
    filters.page = 1;
    filters.userInput = "";
    currentPage.value = 1;
    filterAds();
};

const updateInput = (input) => {
    currentPage.value = 1;
    filters.userInput = input;
};

const filterAds = async () => {
    console.log("篩選條件: ", filters);
    try {
        const response = await axios.post("/advertisements/filter", filters);
        const {content, totalPages: total} = response.data;
        ads.value = content;
        totalPages.value = total;
    } catch (error) {
        console.error("發送請求時發生錯誤: ", error);
    }
};

// 換頁
const onPageNumberChange = async (page) => {
    currentPage.value = page;
    filters.page = page;
    // 判斷filterAd還是noAdHouses
    await filterAds();
};

// 編輯
const showAdDetailFunc = (adDetail) =>{
    detail.value = adDetail;
    showOverlay.value = true;
    showAdDetail.value = true;
}

const closeAdDetail = () =>{
    showOverlay.value = false;
    showAdDetail.value = false;
    detail.value = {};
}

// 點選查看可以加廣告的房子
const toggleNoAdHousesTable = () =>{
    filters.page = 1;
    currentPage.value = 1;

    if(showAdList.value === false){
        showAdList.value = true;
        showNoAdHouses.value = false;
        filterAds();
    }else{
        showAdList.value = false;
        showNoAdHouses.value = true;
        filterNoAdHouses();
        getAdtypeAndId();
    }
}

// 取得廣告類型
const getAdtypeAndId = async() =>{
    const response = await axios.get("/advertisements/adtypes");
    adtypes.value = response.data;
    console.log("ad types: ", response.data);
}

// 取得目前沒有掛廣告的物件（沒有廣告或已過期）
const filterNoAdHouses = async() =>{
    const url = "/advertisements/houseswithoutadds";
    try{
        const response = await axios.post(url, 
            filters.page,
            {headers: {'Content-Type': 'application/json'}}
        );
        noAdHouses.value = response.data.content;
        console.log("no ad houses: ", response.data);
    }catch(error){
        console.error("請求錯誤: ", error);
    }
};

// 接收NoAdHouse中選的houseId及adtypeId
const handleSelectedHouseAndAdtypInfo = ({houseId, adtypeId}) =>{
    console.log("House ID:", houseId);
    console.log("Adtype ID:", adtypeId);
};

// 開關購物車
const toggleCart = () =>{
    if(showCart.value === true){
        showCart.value = false;
    }else{
        getCartItems();
        showCart.value = true;
    }
};

// 取得購物車資料
async function getCartItems() {
  try {
    const response = await axios.post("/api/cart/list", filters);
    cartItems.value = await response.data;

    console.log("get cart items: ", response.data);

  } catch (error) {
    console.error("無法取得購物車內容: ", error);
  }
}

// 加入購物車


// 刪除
const handleDeleteAdResult = (result) =>{
    messageTitle.value = result.messageTitle;
    messageContent.value = result.message;
    showMessage.value = true;

    if(result.sucess){
        filterAds();
    }
}

const closeMessage = () => {
    showMessage.value = false;
};

watch(() => filters.userInput, () => {
    filterAds();
});
</script>

<template>
    <AdPageTitle />

    <div class="flex flex-wrap items-center space-x-6 mt-4 mb-6 px-6">
        <div class="flex items-center space-x-6 flex-grow">
            <!-- 這裡需要確保 filter-change 事件傳遞的是正確的篩選值 -->
            <AdPaymentStatusFilter v-model="filters.paymentstatus" @filter-change="changeFilter" />
            <AdPaidDateFilter v-model="filters.daterange" @filter-change="changeFilter" />
        </div>

        <div class="flex items-center justify-end w-full sm:w-auto">
            <AddAdButton @toggle-no-ad-houses="toggleNoAdHousesTable" :show-ad-list="showAdList"/>
        </div>
    </div>

    <div class="flex flex-wrap items-center space-x-6 mt-4 mb-6 px-6">
        <div class="flex items-center space-x-6 flex-grow">
            <AdUserInputFilter @filter-change="changeFilter" @input-update="updateInput" />
        </div>

        <div class="flex items-center justify-end w-full sm:w-auto">
            <CheckCartListButton @toggle-cart="toggleCart"/>
        </div>
    </div>

    <main class="m-3">
        <div id="view-box" class="border border-gray-400 py-2 px-2 rounded-md">
            <AdList v-show="showAdList" :ads="ads" @ad-delete-result="handleDeleteAdResult" @detail="showAdDetailFunc"/>
            <NoAdHouseList v-show="showNoAdHouses" :noAdHouses="noAdHouses" :adtypes="adtypes" @selected-house-adtype-id="handleSelectedHouseAndAdtypInfo"/>
            <Pagination :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="onPageNumberChange"/>
        </div>
    </main>

    <Overlay v-if="showOverlay"/>
    <PopUpMessage v-show="showMessage" :showMessage="showMessage" :messageTitle="messageTitle" :message="messageContent" @close-message="closeMessage" />
    <AdDetailModal v-show="showAdDetail" :detail="detail" @close-detail="closeAdDetail"/>
    <CartList v-show="showCart" @toggle-cart="toggleCart" :cart-items="cartItems"/>
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
