<script setup>
import { ref, reactive, watch } from "vue";
import { useCart } from "@/stores/cartStore";
import router from "@/router";

const emit = defineEmits(["toggle-cart"]);

const props = defineProps({
    cartStore: {
    type: Object,
    required: true,
  },
});


const selectedPaymentMethod = ref("linepay");

// 關閉購物車
const toggleCart = () => {
  emit("toggle-cart");
};

// 處理時間顯示格式
function formatAddedDate(datetime) {
    if(!datetime){
        return;
    }

  const dateTimeArr = datetime.split("T");
  const date = dateTimeArr[0];
  const time = dateTimeArr[1].substring(0, 5);

  return `${date} ${time}`;
}

// 將產品放入購物車 > 在ADLIST處理

// 刪除購物車內容
const cartStore = useCart();
function removeFromCart(adId){
  cartStore.removeFromCart(adId);
};

// 清空購物車

// 前往結帳
function checkOut() {
    cartStore.setPaymentMethod(selectedPaymentMethod.value);
    
    router.push({ name: 'orderConfirm'});
}

</script>

<template>
  <!-- hidden-right -->
  <div
    class="fixed top-0 right-0 w-80 h-full bg-white shadow-lg transform z-50"
  >
    <div class="flex justify-between p-4 border-b">
      <h2 class="text-xl font-semibold">選購清單</h2>
      <button
        class="text-xl font-bold text-gray-600 hover:text-gray-800 focus:outline-none text-right"
        @click="toggleCart"
      >
        ×
      </button>
    </div>

    <div class="p-4 flex-1 overflow-y-auto">
      <div
        v-for="(cartItem, index) in cartStore.cartItems"
        :key="index"
        class="p-4 border rounded-lg shadow-sm mb-4 relative"
      >
        <button
          class="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-lg hover:bg-red-400"
          @click="removeFromCart(cartItem.adId)"
        >
          x
        </button>

        <div class="flex justify-between">
          <p class="font-semibold">
            廣告編號：<span class="text-blue-600">{{ cartItem.adId }}</span>
          </p>
          <p class="text-gray-500">價格：{{ cartItem.adPrice }}</p>
        </div>
        <p>
          廣告方案：<span class="text-green-600">{{ cartItem.adtypeId }}</span>
        </p>
        <p class="text-sm text-gray-500">
          加入購物車時間：{{ formatAddedDate(cartItem.addedDate) }}
        </p>
      </div>
    </div>

    <div class="p-4 space-y-4">
      <p class="text-lg font-semibold">選擇付款方式</p>
      <div class="flex flex-col space-y-2">
        <label class="flex items-center">
          <input
            type="radio"
            name="payment-method"
            value="linepay"
            v-model="selectedPaymentMethod"
            class="mr-2"
            checked
          />
          <span class="text-gray-700"
            ><img width="70px" src="../../assets/Line_pay_logo.svg.png"
          /></span>
        </label>

        <label class="flex items-center">
          <input
            type="radio"
            name="payment-method"
            value="Credit"
            v-model="selectedPaymentMethod"
            class="mr-2"
          />
          <span class="text-gray-700"
            ><i class="fa-solid fa-credit-card"></i> 信用卡</span
          >
        </label>
      </div>
    </div>

    <div class="p-4 text-right border-t mt-auto">
      <button
        class="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700" @click="checkOut"
      >
        前往結帳
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 確保購物車區域可滾動，並固定底部結帳按鈕 */
div {
  display: flex;
  flex-direction: column;
}

.p-4.flex-1 {
  flex-grow: 1;
  overflow-y: auto;
}

.p-4.text-right {
  margin-top: auto;
}
</style>
