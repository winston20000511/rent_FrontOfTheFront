<script setup>
import { ref, computed } from "vue";
import { useCart } from "@/stores/cartStore";
import router from "@/router";

const emit = defineEmits(["toggle-cart"]);

const selectedThirdParty = ref("linepay");
const cartStore = useCart();
cartStore.choosePayment = "linepay"; // 預設linepay

// 優惠券
const activeCouponIndex = ref(null);
// 購物車下拉顯示詳細內容
const expandedIndex = ref(null);

// 關閉購物車
const toggleCart = () => {
  emit("toggle-cart");
  cartStore.loadCart();
};

// 處理時間顯示格式
function formatAddedDate(datetime) {
  if (!datetime) {
    return;
  }

  const dateTimeArr = datetime.split("T");
  const date = dateTimeArr[0];
  const time = dateTimeArr[1].substring(0, 5);

  return `${date} ${time}`;
}

// 將產品放入購物車 > 在ADLIST處理

// 刪除購物車內容
function removeFromCart(adId) {
  activeCouponIndex.value = null;
  cartStore.removeFromCart(adId);
};

function handlePaymentMethodSelection(event){
  cartStore.choosePayment = event.target.dataset.value;
  console.log("cartStore.choosePayment:", cartStore.choosePayment);
}

// 前往結帳
function checkOut() {
  cartStore.thirdParty = selectedThirdParty.value;
  router.push({ name: "OrderConfirm" });
}

function toggleCoupon(index) {
  const cartItem = cartStore.cartItems[index];

  if (activeCouponIndex.value === null) {
    const isCouponLeft = cartStore.minusOneCoupon(1);
    if (isCouponLeft) {
      activeCouponIndex.value = index;
      cartStore.applyCouponToAd(cartItem.adId);
    }
  } else {
    if (activeCouponIndex.value === index) {
      activeCouponIndex.value = null;
      cartStore.addCoupon(1);
      cartStore.removeCoupon(cartItem.adId);
    } else {
      activeCouponIndex.value = index;
      cartStore.applyCouponToAd(cartItem.adId);
    }
  }

  cartStore.loadCart();
}

// 展開購物車中的物品詳細
function toggleDetails(index) {
  expandedIndex.value = expandedIndex.value === index ? null : index;
}

// 計算總價
const totalPrice = computed(() => {
  return cartStore.calculate.totalPrice;
});
const discountAmount = computed(() => {
  return cartStore.calculate.discountAmount;
});

//
</script>

<template>
  <transition name="slide">
    <div
      class="fixed top-0 right-0 h-full bg-white shadow-lg transform z-50"
      style="width: 360px"
    >
      <div class="flex justify-between px-4 py-3 border-b">
        <h2 class="text-xl font-semibold">申請清單</h2>
        <button
          class="text-xl font-bold text-gray-600 hover:text-gray-800 focus:outline-none"
          @click="toggleCart"
        >
          ×
        </button>
      </div>

      <div class="p-4 flex-1 overflow-y-auto" style="height: 320px">
        <div
          v-for="(cartItem, index) in cartStore.cartItems"
          :key="index"
          class="p-3 border rounded-lg shadow-sm mb-4"
        >
          <div class="flex justify-between">
            <div>
              <p class="text-sm font-bold">編號：{{ cartItem.adId }}</p>
              <p class="text-sm">
                方案：{{ cartItem.adtypeId }} &nbsp; X &nbsp; NTD
                {{ cartItem.adPrice }}
              </p>

              <div class="flex items-center">
                <button
                  class="text-blue-500 underline hover:text-blue-700 mr-2"
                  @click="toggleDetails(index)"
                >
                  <span class="text-lg">
                    {{ expandedIndex === index ? "&#9652;" : "&#9662;" }}
                  </span>
                </button>
              </div>
            </div>
            <div>
              <div class="mb-2">
                <button
                  class="rounded bg-yellow-500 hover:bg-yellow-300 text-white text-sm px-2 py-1"
                  @click="toggleCoupon(index)"
                >
                  {{ activeCouponIndex === index ? "已使用" : "優惠券" }}
                </button>
              </div>
              <div class="text-right">
                <button
                  class="bg-red-500 text-white text-sm px-2 py-1 rounded hover:bg-red-400"
                  @click="removeFromCart(cartItem.adId)"
                >
                  移除
                </button>
              </div>
            </div>
          </div>
          <div
            v-show="expandedIndex === index"
            class="mt-2 bg-gray-50 p-3 border-t text-sm text-gray-600"
          >
            <p>房屋編號：{{ "天數" }}</p>
            <p>推播時長：{{ "天數" }}</p>
          </div>
        </div>
      </div>

      <div class="p-4 border-t">
        <p class="text-lg font-semibold mb-1">
          總價：<span class="text-green-600">${{ totalPrice }}</span>
        </p>
        <p class="text-sm text-gray-600 mb-1">
          已套用優惠：- NTD {{ discountAmount }}
        </p>
        <p class="text-sm text-gray-500">
          剩餘優惠券數量：{{ cartStore.couponNumber }}
        </p>

        <p class="text-lg font-semibold mt-3 mb-1">選擇付款方式</p>
        <div class="flex justfy-between">
          <label class="flex items-center">
            <input
              type="radio"
              name="third-party"
              value="linepay"
              data-value="Linepay"
              v-model="selectedThirdParty"
              class="mr-2"
              checked
              @change="handlePaymentMethodSelection"
            />
            <span class="text-gray-700"> LINEPAY </span>
          </label>

          <label class="flex items-center">
            <input
              type="radio"
              name="third-party"
              value="ecpay"
              data-value="Credit"
              v-model="selectedThirdParty"
              @change="handlePaymentMethodSelection"
              class="ml-8 mr-2"
            />
            <span class="text-gray-700"
              ><i class="fa-solid fa-credit-card"></i> 信用卡</span
            >
          </label>
        </div>
      </div>

      <button
        class="fixed bottom-0 w-full px-4 py-2 bg-green-600 text-white text-center shadow hover:bg-green-700"
        @click="checkOut"
      >
        前往結帳
      </button>
    </div>
  </transition>

</template>

<style scoped>

  .cart-panel {
    transform: translateX(100%);
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.3s ease-in-out;
  }

  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(100%);
  }
  
  .slide-enter-to,
  .slide-leave-from {
    transform: translateX(0);
  }

</style>
