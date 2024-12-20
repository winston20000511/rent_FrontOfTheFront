<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useCart } from "@/stores/cartStore";

const cartStore = useCart();
const cartId = cartStore.cartId;
const cartItems = ref([]);
// 接收表單
const formContainer = ref(null);

// 追蹤載入狀況
const isLoading = ref(true);
const loadError = ref(null);

let token = localStorage.getItem('jwt');


onMounted(async () => {
  // 載入時取得購物車內容
    console.log("order confirm view cartId: ", cartId);
    
  try {
    const url = "http://localhost:8080/api/orders/content/confirmation";
    const response = await fetch(url,{
      method: "POST",
      headers: { "Content-Type": "application/json", authorization: `${token}` },
      body: cartId,
    });
    const data = await response.json();

    console.log("order confirm page: ", data);

    cartItems.value = data;
    isLoading.value = false;
  } catch (error) {
    loadError.value = "載入錯誤，請重新操作";
    isLoading.value = false;
  };




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
const handlePayment = async () => {

  await nextTick();

  if(!formContainer.value){
    throw new Error("formContainer尚未初始化");
  }

  if (cartStore.thirdParty === "linepay") {
    console.log("呼叫LINEPAY");

    // 之後要在頁面設choosePayment的選項
    let orderInfo = {
      cartId: cartStore.cartId,
      choosePayment: "linepay",
      thirdParty: cartStore.thirdParty,
    };

    // 新增訂單
    const submitOrderUrl = "http://localhost:8080/api/orders/create";
    const orderResponse = await fetch(submitOrderUrl,{
      method: "POST",
      headers: {"Content-Type": "application/json", authorization: `${token}`},
      body: JSON.stringify(orderInfo)
    });

    const orderData = await orderResponse.json();
    console.log("訂單資料: ", orderData);
    console.log("訂單號碼: ", orderData.merchantTradNo);

    const merchantTradNo = orderData.merchantTradNo;

    // 呼叫LINEPAY
    const linepayUrl = "http://localhost:8080/api/linepay/request";
    const linepayResponse = await fetch(linepayUrl,{
      method: "POST",
      headers: {"Content-Type": "application/json", authorization: `${token}`},
      body: merchantTradNo
    });

    const linepayPaymentUrl = await linepayResponse.json();
    // linepay會回傳paymentUrl
    window.location.href = linepayPaymentUrl.paymentUrl;

    console.log("付完款的回傳值: ", data);

  }
  
  if (cartStore.thirdParty === "ecpay") {
    // 呼叫綠界支付 (ECPay)
    console.log("呼叫ECpay");

    let orderInfo = {
      cartId: cartStore.cartId,
      choosePayment: "Credit",
      thirdParty: cartStore.thirdParty,
    };

    const submitOrderUrl = "http://localhost:8080/api/orders/create";
    const orderResponse = await fetch(submitOrderUrl,{
      method: "POST",
      headers: {"Content-Type": "application/json", authorization: `${token}`},
      body: JSON.stringify(orderInfo)
    });

    const orderData = await orderResponse.json();
    console.log("訂單資料: ", orderData);
    console.log("訂單號碼: ", orderData.merchantTradNo);

    const merchantTradNo = orderData.merchantTradNo;

    // 呼叫ECPAY
    try{
      const ecpayUrl = "http://localhost:8080/api/ecpay/ecpayCheckout";
      const ecpayResponse = await fetch(ecpayUrl, {
        method: "POST",
        headers: {"Content-Type": "application/json", authorization: `${token}`},
        body: merchantTradNo
      });

      const formHtml = await ecpayResponse.text();
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = formHtml.trim();
      const formElement = tempDiv.firstChild;

      console.log("formElement", formElement);

      formContainer.value.appendChild(formElement);

      console.log("formContainer: ", formContainer);

      formElement.submit();
    }catch(error){
      console.error("提交失敗: ", error);
    }

  }
};

</script>

<template>

  <div class="text-xl mb-3 text-center border-b border-black py-2">
      訂單確認
    </div>

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
            <th class="px-4 py-2 text-right">最終金額</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in cartItems" :key="index" class="text-center">
            <td class="px-4 py-2">{{ item.adId }}</td>
            <td class="px-4 py-2">{{ item.houseTitle }}</td>
            <td class="px-4 py-2">{{ item.adName }}</td>
            <td class="px-4 py-2" colspan="2">{{ item.adPeriod }}</td>
            <td class="px-4 py-2 text-right">{{ item.adPrice }}</td>
            <td class="px-4 py-2 text-right">{{ cartStore.couponUsage[item.adId]? `- ${cartStore.calculate.discountAmount} `: "" }}</td>
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

    <div ref="formContainer" class="hidden"></div>

</template>

<style scoped></style>
