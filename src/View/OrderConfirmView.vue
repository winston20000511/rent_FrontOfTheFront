<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useCart } from "@/stores/cartStore";
import axios from 'axios';

const cartStore = useCart();
const cartId = cartStore.cartId;
const cartItems = ref([]);

// 追蹤載入狀況
const isLoading = ref(true);
const loadError = ref(null);


onMounted(async () => {
  // 載入時取得購物車內容
    console.log("order confirm view cartId: ", cartId);
    
  try {
    const response = await axios.post("/api/orders/content/confirmation", cartId,
        {headers: { 'Content-Type': 'application/json' }}
    );

    console.log("order confirm page: ", response.data);

    cartItems.value = response.data;
    isLoading.value = false;
  } catch (error) {
    loadError.value = "載入錯誤，請重新操作";
    isLoading.value = false;
  }

  // 載入時禁止返回上一頁
  // // 1. 推送當前頁面到歷史紀錄
  // window.history.pushState(null, "", window.location.href);
  
  // // 2. 設置 onpopstate 事件，防止返回上一頁
  // window.onpopstate = function(){
  //   window.history.pushState(null, "", window.location.href)
  // };

  // onBeforeUnmount(() => {
  //   window.onpopstate = null;  // 清理事件處理器
  // });

});

// 處理付款邏輯
const handlePayment = () => {
  if (thirdParty === "linepay") {
    // 呼叫LINEPAY API
    console.log("呼叫LINEPAY");

  }
  
  if (thirdParty === "ecpay") {
    // 呼叫綠界支付 (ECPay)
    console.log("呼叫ECpay");
  }
};

</script>

<template>

  <div class="text-xl mb-3 text-center border-b border-black py-2">
      訂單確認
    </div>

    <div>檢驗選擇的付款方式 {{cartStore.thirdParty}} </div>

    <div v-if="isLoading" class="text-center mt-10">
      <p>資料加載中...</p>
    </div>

    <div v-if="loadError" class="text-center mt-10 text-red-500">
      <p>{{ loadError }}</p>
    </div>

    <div v-if="!isLoading && !loadError">
      <div class="flex items-center mr-64 ml-64 mt-10">
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 flex items-center justify-center bg-gray-100 border-2 border-blue-300 rounded-full">
            <div class="w-3 h-3 rounded-full bg-blue-400"></div>
          </div>
          <div class="mt-2 text-sm text-gray-600">確認</div>
        </div>
        <div class="flex-1 h-0.5 bg-gray-200 -mt-6"></div>
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"></div>
          <div class="mt-2 text-sm text-gray-600">付款</div>
        </div>
        <div class="flex-1 h-0.5 bg-gray-200 -mt-6"></div>
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"></div>
          <div class="mt-2 text-sm text-gray-600">完成</div>
        </div>
      </div>

      <div class="my-8 px-6 py-3 text-center border-b-2 border-blue-400 text-lg font-medium">
        step1. 請確認訂單內容
      </div>

      <table class="min-w-full table-auto px-4 py-4 mt-4">
        <thead class="bg-gray-100">
          <tr class="text-center text-sm font-medium text-gray-700">
            <th class="px-4 py-2">服務編號</th>
            <th class="px-4 py-2">物件內容</th>
            <th class="px-4 py-2">VIP方案</th>
            <th class="px-4 py-2" colspan="2">VIP服務時間</th>
            <th class="px-4 py-2 text-right">金額</th>
            <th class="px-4 py-2 text-right">折扣</th>
            <th class="px-4 py-2">最終金額</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in cartItems" :key="index" class="text-center">
            <td class="px-4 py-2">{{ item.adId }}</td>
            <td class="px-4 py-2">{{ item.houseTitle }}</td>
            <td class="px-4 py-2">{{ item.adName }}</td>
            <td class="px-4 py-2" colspan="2">{{ item.adPeriod }}</td>
            <td class="px-4 py-2 text-right">{{ item.adPrice }}</td>
            <td class="px-4 py-2">{{ cartStore.couponUsage[item.adId]? `- ${cartStore.calculate.discountAmount} `: "" }}</td>
            <td class="px-4 py-2 text-right">{{ cartStore.couponUsage[item.adId]? (item.adPrice-cartStore.calculate.discountAmount) : item.adPrice }}</td>
          </tr>
          <tr class="border-t border-gray-300">
            <td class="px-4 py-2 text-right font-bold" colspan="7">總計</td>
            <td class="px-4 py-2 text-right">{{ cartStore.calculate.totalPrice }}</td>
          </tr>
          <tr>
            <td colspan="8" class="text-right">
              <button @click="handlePayment" type="button" class="px-4 py-2 m-4 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition duration-300">
                確認付款
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

</template>

<style scoped></style>
