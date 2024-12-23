<script setup>
import { computed, ref } from "vue";
import { useCart } from "@/stores/cartStore";
import Button from "primevue/button";
import InputText from "primevue/inputtext";

let token = localStorage.getItem("jwt");

// 插入購物車資料表
const cartStore = useCart();
cartStore.loadCart();

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

// 過濾條件設定
const filters = ref({
  global: { value: null },
  houseTitle: { value: null },
  paidDate: { value: null },
  statusText: { value: null },
  isPaid: { value: null },
});

const selectedAd = ref();

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
        body: JSON.stringify({ adId }),
      });
      const success = await response.json();

      if (success) {
        emit("ad-delete-result", {
          success: true,
          adId,
          messageTitle: "已刪除VIP推播申請",
          message: "",
        });
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
    const url = `http://localhost:8080/api/advertisements/${adId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    });
    const data = await response.json();
    emit("detail", data);
  } catch (error) {
    console.error("系統錯誤: ", error);
  }
};
</script>

<template>
  <div class="card">
    <DataTable
      v-model:filters="filters"
      v-model:selection="selectedAd"
      :value="processedAds"
      stateStorage="session"
      stateKey="dt-state-demo-session"
      paginator
      :rows="5"
      filterDisplay="menu"
      selectionMode="single"
      dataKey="adId"
      :globalFilterFields="['houseTitle', 'paidDate', 'statusText', 'isPaid']"
      tableStyle="min-width: 50rem"
    >
      <template #header>
        <div class="px-4 py-2 text-sm font-bold text-yellow-600 bg-yellow-100 rounded m-3">
          <div>．VIP申請僅保留三天。如逾期未付款，視為取消申請。</div>
          <div>．加入訂單後，可前往查看選購清單，並進行付費。</div>
        </div>
      </template>

      <!-- 廣告標題欄位 -->
      <Column field="houseTitle" header="房屋標題" sortable style="width: 15%" class="px-4"/>

      <!-- 發布時間欄位 -->
      <Column field="paidDate" header="發布時間" sortable style="width: 15%" class="px-4"/>

      <!-- 廣告狀態欄位 -->
      <Column header="廣告狀態" sortable style="width: 15%" class="px-4">
        <template #body="{ data }">
          <span :class="data.statusClass">{{ data.statusText }}</span>
        </template>
      </Column>

      <!-- 付款狀態欄位 -->
      <Column field="isPaid" header="付款狀態" sortable style="width: 15%" class="px-4"/>

      <!-- 剩餘時間欄位 -->
      <Column field="remainingDaysText" header="剩餘時間" sortable style="width: 15%" class="px-4"/>

      <!-- 操作欄位 -->
      <Column header="" style="width: 20%" class="text-center">
        <template #body="{ data }">
          <div class="flex justify-center gap-2">
            <button
              class="px-3 py-1 text-sm mr-1 text-blue-600 bg-blue-100 rounded hover:bg-blue-200"
              @click="checkAd(data.adId)"
            >
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button
              class="px-3 py-1 text-sm mr-1"
              :class="data.cartButtonClass"
              :disabled="data.remainingDays < 0 || data.isPaid === '已付款'"
              @click="addAdToCart(data.adId)"
            >
              <i class="fa-solid fa-cart-plus"></i>
            </button>
            <button
              class="px-3 py-1 text-sm"
              :class="data.deleteButtonClass"
              :disabled="data.isPaid === '已付款'"
              @click="deleteAd(data.adId)"
            >
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </template>
      </Column>

      <template #empty>
        <div class="p-3 text-center text-gray-500">目前沒有廣告</div>
      </template>
    </DataTable>
  </div>
</template>

<style scoped>

</style>
