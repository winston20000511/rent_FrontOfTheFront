<script setup>
import { ref, computed } from "vue";
import axios from "axios";

const props = defineProps({
  ads: {
    type: Array,
    required: true,
  },
});

// const emit = defineEmits(["close-message", "pageChange", "orderCancelResult", "detail", "order-cancel-result"]);

const emit = defineEmits(["close-message", "adDeleteResult", "detail", "ad-delete-result"]);

const isAdded = ref(false);

const processedAds = computed(() => {
  return props.ads.map((ad) => {
    const remainingDays = ad.remainingDays;
    const isPaid = ad.isPaid;

    // 設定狀態的CSS樣式
    let statusClass;
    if (isPaid === "已付款" && remainingDays < 0) {
      statusClass =
        "inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800";
    } else if (isPaid === "已付款") {
      statusClass =
        "inline-block px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800";
    } else if (isPaid === "未付款") {
      statusClass =
        "inline-block px-2 py-1 text-xs font-medium rounded-full bg-pink-100 text-pink-800";
    } else {
      statusClass = "";
    }

    // 設定狀態內容的文字
    let statusText;
    let remainingDaysText;
    if(remainingDays < 0){
      statusText = "已到期";
      remainingDaysText = "無";
    }else if(remainingDays == null){
      statusText = "未發布";
      remainingDaysText = "無";
    }else{
      statusText = "發布中";
      remainingDaysText = remainingDays;
    }

    // 刪除按鈕樣式
    let deleteButtonClass;
    let cartButtonClass;
    if(isPaid === "已付款" || remainingDays < 0){
      deleteButtonClass = "text-gray-400 border rounded cursor-default";
      cartButtonClass = "text-gray-400 border rounded cursor-default";
    }else{
      deleteButtonClass = "text-red-600 bg-red-100 rounded hover:bg-red-200";
      cartButtonClass = "text-green-600 bg-green-100 rounded hover:bg-green-200";
    }

    // 回傳
    return {
      ...ad,
      statusClass,
      statusText,
      remainingDaysText,
      deleteButtonClass,
      cartButtonClass
    };
  });
});

// 刪除
const deleteAd = async (adId) =>{
  const userConfirmed = window.confirm("確定要刪除嗎？")
  if(userConfirmed){
    try{
      const response = await axios.delete("/advertisements", {
        data: adId, 
        headers: { 
          'Content-Type': 'application/json' 
        }
      });

      emit('ad-delete-result',{
        sucess: response.data,
        adId,
        messageTitle: response.data ? '已刪除VIP推播申請' : '未成功刪除，請稍後再試',
        message: response.data ? '' : '若有問題，請聯繫客服人員',
      })

    }catch(error){
      console.error("伺服器錯誤: ", error);
      emit('ad-delete-result', {
        success: false,
        adId,
        messageTitle: '系統錯誤，取消訂單失敗',
        message: '請稍後再試',
      });
    }
  } else {
    emit('ad-delete-result', {
      success: false,
      adId,
      messageTitle: '尚未刪除VIP推播申請',
      message: '',
    });
  }
};

const checkAd = async (adId) =>{
  try{
    const response = await axios.get(`/advertisements/adId/${adId}`);
    emit("detail", response.data);
  }catch(error){
    console.error("系統錯誤: ", error);
  }
}

const addAdToCart = async (adId) =>{
  console.log(adId, " add");

}

</script>

<template>
  <div>
    <div
      class="px-4 py-2 text-sm font-bold text-yellow-600 bg-yellow-100 rounded m-3"
    >
      <div>．VIP申請僅保留三天。如逾期未付款，視為取消申請。</div>
      <div>．加入訂單後，可前往查看選購清單，並進行付費。</div>
    </div>

    <table class="table-auto w-full border-collapse border border-gray-300">
      <thead class="bg-gray-100">
        <tr>
          <th
            class="px-4 py-2 text-left text-sm font-medium text-gray-600 text-center"
          >
            房屋標題
          </th>
          <th class="px-4 py-2 text-center text-sm font-medium text-gray-600">
            發布時間
          </th>
          <th class="px-4 py-2 text-center text-sm font-medium text-gray-600">
            廣告狀態
          </th>
          <th class="px-4 py-2 text-center text-sm font-medium text-gray-600">
            付款狀態
          </th>
          <th class="px-4 py-2 text-center text-sm font-medium text-gray-600">
            剩餘時間
          </th>
          <th
            class="px-4 py-2 text-center text-sm font-medium text-gray-600"
          ></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(ad, index) in processedAds"
          :key="index"
          class="border-b hover:bg-gray-50"
        >
          <td class="px-4 py-3 text-sm text-gray-700 text-center">
            {{ ad.houseTitle }}
          </td>
          <td class="px-4 py-3 text-sm text-center text-gray-700">
            {{ ad.paidDate }}
          </td>
          <td class="px-4 py-3 text-sm text-center text-gray-700">
            <span :class="ad.statusClass">{{ ad.statusText }}</span>
          </td>
          <td class="px-4 py-3 text-sm text-center text-gray-700">
            {{ ad.isPaid }}
          </td>
          <td class="px-4 py-3 text-sm text-center text-gray-700">
            {{ ad.remainingDaysText }}
          </td>
          <td class="px-4 py-3 text-sm text-center text-gray-700">
            <button
              button
              class="px-3 py-1 text-sm mr-1 text-blue-600 bg-blue-100 rounded hover:bg-blue-200" @click="checkAd(ad.adId)"
            >
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="px-3 py-1 text-sm mr-1" button :class="ad.cartButtonClass" :disabled="ad.remainingDays < 0 || ad.Paid === '已付款'" @click="addAdToCart(ad.adId)">
              <i class="fa-solid fa-cart-plus"></i>
            </button>
            <button
              button
              class="px-3 py-1 text-sm"
              :class="ad.deleteButtonClass"
              @click="deleteAd(ad.adId)" :disabled="ad.isPaid === '已付款'"
            >
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
          
        </tr>
        <tr v-if="processedAds.length === 0">
          <td colspan="5" class="px-4 py-3 text-center text-gray-500">
            目前沒有商品
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 購物車區域
      <div class="mt-6 p-4 bg-gray-50 border border-gray-300 rounded">
        <h3 class="text-lg font-bold text-gray-700 mb-3">購物車</h3>
        <ul class="list-disc pl-5">
          <li v-for="(cartItem, index) in cart" :key="index" class="text-sm text-gray-700">
            {{ cartItem.name }} - 數量: {{ cartItem.quantity }}
          </li>
        </ul>
      </div>-->
  </div>
</template>

<style scoped></style>
