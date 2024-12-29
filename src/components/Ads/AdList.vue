<script setup>
import { ref, computed } from "vue";
import { useCart } from "@/stores/cartStore";
import HouseView from "@/View/HouseView.vue";
import Dialog from "primevue/dialog";

let token = localStorage.getItem("jwt");

// 插入購物車資料表
const cartStore = useCart();
cartStore.loadCart();

function addAdToCart(adId) {
  cartStore.addToCart(adId);
  cartStore.loadCart();
}

const props = defineProps({
  ads: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits([
  "close-message",
  "adDeleteResult",
  "detail",
  "ad-delete-result",
]);

const showHouseView = ref(false);
const selectedHouseId = ref(null);

const checkHouseInfo = (houseId) => {
  selectedHouseId.value = Number(houseId);
  showHouseView.value = true;
};

// 處理過的廣告資料
const processedAds = computed(() => {
  if (!props.ads) {
    return [];
  }

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
    if (remainingDays < 0) {
      statusText = "已到期";
      remainingDaysText = "無";
    } else if (remainingDays == null) {
      statusText = "未發布";
      remainingDaysText = "無";
    } else {
      statusText = "發布中";
      remainingDaysText = remainingDays;
    }

    // 刪除按鈕樣式
    let deleteButtonClass;
    let cartButtonClass;
    if (isPaid === "已付款" || remainingDays < 0) {
      deleteButtonClass = "text-gray-400 border rounded cursor-default";
      cartButtonClass = "text-gray-400 border rounded cursor-default";
    } else {
      deleteButtonClass = "text-red-600 bg-red-100 rounded hover:bg-red-200";
      cartButtonClass =
        "text-green-600 bg-green-100 rounded hover:bg-green-200";
    }

    // 回傳處理過的資料
    return {
      ...ad,
      statusClass,
      statusText,
      remainingDaysText,
      deleteButtonClass,
      cartButtonClass,
    };
  });
});

// 刪除廣告
const deleteAd = async (adId) => {
  const userConfirmed = window.confirm("確定要刪除嗎？");
  if (userConfirmed) {
    try {
      const url = "http://localhost:8080/api/advertisements";
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },
        body: JSON.stringify(adId),
      });
      const sucess = await response.json();

      if (sucess) {
        emit("ad-delete-result", {
          success: true,
          adId,
          messageTitle: "已刪除VIP推播申請",
          message: "",
        });

        cartStore.removeFromCart(adId);
        cartStore.loadCart();
        
      } else {
        emit("ad-delete-result", {
          success: false,
          adId,
          messageTitle: "未成功刪除，請稍後再試",
          message: "若有問題，請聯繫客服人員",
        });
      }
    } catch (error) {
      console.error("伺服器錯誤: ", error);
      emit("ad-delete-result", {
        success: false,
        adId,
        messageTitle: "系統錯誤，取消訂單失敗",
        message: "請稍後再試",
      });
    }
  } else {
    emit("ad-delete-result", {
      success: false,
      adId,
      messageTitle: "尚未刪除VIP推播申請",
      message: "",
    });
  }
};

// 查看廣告詳細資料
const checkAd = async (adId) => {
  try {
    const url = `http://localhost:8080/api/advertisements/adId`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: adId,
    });
    const data = await response.json();
    emit("detail", data);
  } catch (error) {
    console.error("系統錯誤: ", error);
  }
};
</script>

<template>
  <div>
    <div
      class="px-4 py-2 text-sm font-bold text-yellow-600 bg-yellow-100 rounded m-3"
    >
      <div>．加入選購清單後，可前往查看並進行付費。</div>
      <div>
        ．選購清單之內容，於加入第一筆項目起算，保留三天。如逾期未結帳，將自動清除所有紀錄。
      </div>
    </div>

    <!-- 資料表格 -->
    <div class="table-container overflow-y-auto max-h-96">
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
              VIP服務狀態
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
            v-for="ad in processedAds"
            :key="ad.adId"
            class="border-b hover:bg-gray-50"
          >
            <td class="px-4 py-3 text-sm text-gray-700 text-center">
              <button
                class="px-3 py-1 text-sm text-gray-600 bg-transparent border-0 underline hover:bg-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                @click="checkHouseInfo(ad.houseId)"
              >
              {{ ad.houseTitle }}
              </button>
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
                class="px-3 py-1 text-sm mr-1 text-blue-600 bg-blue-100 rounded hover:bg-blue-200"
                @click="checkAd(ad.adId)"
              >
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button
                class="px-3 py-1 text-sm mr-1"
                :class="ad.cartButtonClass"
                :disabled="ad.remainingDays < 0 || ad.isPaid === '已付款'"
                @click="addAdToCart(ad.adId)"
              >
                <i class="fa-solid fa-cart-plus"></i>
              </button>
              <button
                class="px-3 py-1 text-sm"
                :class="ad.deleteButtonClass"
                @click="deleteAd(ad.adId)"
                :disabled="ad.isPaid === '已付款'"
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </td>
          </tr>
          <tr v-if="processedAds.length === 0">
            <td colspan="6" class="px-4 py-3 text-center text-gray-500">
              目前沒有申請VIP服務
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>

    <!-- 房屋資訊彈窗 -->
    <Dialog
    v-model:visible="showHouseView"
    :modal="true"
    :dismissableMask="true"
    header="查看房屋資訊"
    class="dialog-theme"
  >
    <div class="dialog-container">
      <HouseView :houseId="selectedHouseId" @close="showHouseView = false" />
    </div>
  </Dialog>
</template>

<style scoped>
.table-container {
  max-height: 24rem;
  overflow-y: auto;
}
</style>
