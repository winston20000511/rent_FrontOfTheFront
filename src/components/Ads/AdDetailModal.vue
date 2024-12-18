<script setup>
import { defineProps, defineEmits, ref, reactive, computed, watch } from "vue";
import axios from "axios";

const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits();

// 紀錄可編輯的資料
const editableDetails = reactive({
  adName: "",
  adPrice: "",
  adtypeId: "",
  isEditing: false,
});

// 控制編輯按鈕樣式
const EditButtonClass = computed(() => {
  return props.detail.isPaid === "已付款"
    ? 'text-gray-400 border border-gray-400 cursor-not-allowed'
    : 'text-white bg-yellow-500 hover:bg-yellow-600';
});

watch(
  () => props.detail.adName,
  (newAdName) => {
    editableDetails.adName = newAdName;
  }
);

watch(
  () => props.detail.adPrice,
  (newAdPrice) => {
    editableDetails.adPrice = newAdPrice;
  }
);

// 計算廣告資料，會根據是否處於編輯狀態來決定是否可編輯
const adDetails = computed(() => [
  { label: "廣告編號", value: props.detail.adId, editable: false },
  { label: "房屋標題", value: props.detail.houseTitle, editable: false },
  {
    label: "廣告方案",
    value: editableDetails.adName,
    editable: editableDetails.isEditing,
  },
  {
    label: "廣告金額",
    value: `NTD ${props.detail.adPrice}`,
    editable: editableDetails.isEditing,
  },
  { label: "付款狀態", value: props.detail.isPaid, editable: false },
  {
    label: "訂單號碼",
    value: props.detail.orderId === null ? "無" : props.detail.orderId,
    editable: false,
  },
  { label: "付款日期", value: props.detail.paidDate, editable: false },
  {
    label: "起訖日期",
    value: getAdValidation(props.detail.paidDate, props.detail.adName),
    editable: false,
  },
]);

const selectedAdType = ref(props.detail.adName);
const adtypes = ref([]);

// 計算廣告日期
function getAdValidation(startDateStr, adtype) {
  const totalDays = parseInt(adtype);
  const startDate = new Date(startDateStr);
  let endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + totalDays);

  const formatDate = (date) => date.toLocaleDateString("en-CA");

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  let validation =
    formattedStartDate === "Invalid Date"
      ? "無"
      : `${formattedStartDate} ~ ${formattedEndDate}`;

  return validation;
}

// 啟用編輯
const editDetail = async () => {
  editableDetails.isEditing = true;
  try {
    const response = await axios.get("/advertisements/adtypes");
    adtypes.value = response.data;
    selectedAdType.value = props.detail.adName;
    editableDetails.adName = props.detail.adName;
  } catch (error) {
    console.error("系統錯誤: ", error);
  }
};

// 監控廣告方案變化以更新價格
watch(
  () => editableDetails.adName,
  (newAdName) => {
    const selectedAd = adtypes.value.find((ad) => ad.adName === newAdName);
    if (selectedAd) {
      editableDetails.adPrice = selectedAd.adPrice;
      editableDetails.adtypeId = selectedAd.adtypeId;
    }
  }
);

// 儲存選擇的廣告方案
const saveAdPlan = async () => {

  const response = await axios.put(
    "/advertisements",
    {
      adId: props.detail.adId,
      newAdtypeId: editableDetails.adtypeId,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const updatedAd = await response.data;

  props.detail.adName = updatedAd.adName;
  props.detail.adPrice = updatedAd.adPrice;

  // 更新 editableDetails 中的資料
  editableDetails.adName = updatedAd.adName;
  editableDetails.isEditing = false; // 儲存後關閉編輯
};

// 取消編輯
const cancelEdit = () => {
  editableDetails.adName = props.detail.adName;
  editableDetails.isEditing = false;
};

const closeDetail = () => {
  emit("close-detail");
};
</script>

<template>
  <div
    class="fixed inset-0 z-20 bg-gray-500/75 flex items-center justify-center"
  >
    <div class="bg-white rounded-lg shadow-lg w-4/5 h-4/5 p-8">
      <div class="text-right">
        <button
          class="m-1 px-3 py-1.5 rounded"
          @click="editDetail"
          :disabled="props.detail.isPaid === '已付款'"
          :class="EditButtonClass"
          > 編輯
        </button>
        <button
          class="m-1 px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600"
          @click="closeDetail"
        >
          關閉
        </button>
      </div>

      <div>
        <h3 class="text-2xl font-semibold text-gray-900 text-center">
          廣告內容
        </h3>
        <div class="m-4 overflow-auto h-[calc(100%-6rem)]">
          <table class="border border-gray-400 w-full">
            <tbody class="px-10">
              <tr v-for="(item, index) in adDetails" :key="index">
                <th class="bg-gray-200 w-1/4 text-center">{{ item.label }}</th>
                <td class="px-8 py-2">
                  <span v-if="!item.editable">{{ item.value }}</span>
                  <span v-else>
                    <select
                      v-if="item.label === '廣告方案'"
                      v-model="editableDetails.adName"
                      class="border border-gray-300 rounded px-2 py-1"
                    >
                      <option
                        v-for="adtype in adtypes"
                        :key="adtype.adtypeId"
                        :value="adtype.adName"
                      >
                        {{ adtype.adName }}
                      </option>
                    </select>
                    <p
                      v-if="item.label === '廣告金額'"
                      v-bind="editableDetails.adPrice"
                    >
                      NTD {{ editableDetails.adPrice }}
                    </p>

                    <button
                      v-if="
                        editableDetails.isEditing && item.label === '廣告方案'
                      "
                      @click="saveAdPlan"
                      class="px-2 py-1 bg-green-500 text-white rounded ml-2"
                    >
                      儲存
                    </button>
                    <button
                      v-if="
                        editableDetails.isEditing && item.label === '廣告方案'
                      "
                      @click="cancelEdit"
                      class="px-2 py-1 bg-gray-500 text-white rounded ml-2"
                    >
                      取消
                    </button>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
