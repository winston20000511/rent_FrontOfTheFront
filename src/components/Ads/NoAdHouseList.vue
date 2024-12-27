<script setup>
import { ref, watch, defineComponent } from "vue";
import Dialog from "primevue/dialog"; // 引入Dialog元件
import HouseView from "@/View/HouseView.vue"; // 假設您有一個顯示房屋詳細資料的組件

defineComponent({ name: "noadhouselist" });

const emit = defineEmits(["filter-no-ad-houses"]);

const props = defineProps({
  noAdHouses: {
    type: Array,
    required: true,
  },
  adtypes: {
    type: Array,
    required: true,
  },
});

let token = localStorage.getItem("jwt");

const isDataLoaded = ref(false);
const selectedAdtypes = ref([]);

// 使用者選取的房屋及廣告類別
const selectedHouseId = ref("");
const selectedAdtype = ref("");

// 控制 Modal 顯示狀態
const showHouseModal = ref(false);

// 初始化資料
function initializeData() {
  if (props.noAdHouses.length > 0 && props.adtypes.length > 0) {
    console.log("初始化載入");
    selectedAdtypes.value = props.noAdHouses.map(
      () => props.adtypes[0] || null
    );
  } else {
    console.log("沒有符合資料");
  }

  isDataLoaded.value = true;
}

watch(
  [() => props.noAdHouses, () => props.adtypes],
  () => {
    initializeData();
  },
  { immediate: true }
);

// 用於打開查看房屋資料的函式
function checkHouseInfo(houseId) {
  selectedHouseId.value = houseId; // 設置選中的房屋ID
  showHouseModal.value = true; // 顯示 Modal
}

// 插入廣告資料表
async function addAd(houseId, adtypeId) {
  if (!houseId || !adtypeId) {
    console.error("House ID: ", houseId, " or Adtype ID is missing: ", adtypeId);
    return;
  }

  const selectedInfo = {
    houseId,
    adtypeId,
  };

  try {
    const url = "http://localhost:8080/api/advertisements";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify(selectedInfo),
    });

    const success = await response.json();

    if (success) {
      alert("新增成功");
      emit("filter-no-ad-houses");
    } else {
      alert("新增失敗");
    }
  } catch (error) {
    console.error("Error adding ad:", error);
  }
}
</script>

<template>
  <div>
    <div v-if="!isDataLoaded" class="text-center py-6 text-gray-500">
      資料載入中...
    </div>

    <div v-else>
      <div
        class="px-4 py-2 text-sm font-bold text-yellow-600 bg-yellow-100 rounded m-3"
      >
        請選擇想要升級為VIP的物件
      </div>

      <table
        class="table-auto w-full text-sm border border-gray-300 rounded-lg"
      >
        <thead>
          <tr class="bg-green-400 text-white text-center">
            <th class="px-4 py-3 font-semibold">房屋標題</th>
            <th class="px-4 py-3 font-semibold">查看房屋</th>
            <th class="px-4 py-3 font-semibold">廣告方案</th>
            <th class="px-4 py-3 font-semibold">廣告價格</th>
            <th class="px-4 py-3 font-semibold">新增廣告</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="props.noAdHouses.length === 0"
            class="text-center py-6 text-gray-500"
          >
            <td class="px-4 py-3" colspan="5">沒有符合資料</td>
          </tr>
          <tr
            v-else
            v-for="(noAdHouse, index) in props.noAdHouses"
            :key="index"
            class="text-center"
          >
            <td class="px-4 py-3">{{ noAdHouse.houseTitle }}</td>
            <td class="px-4 py-3">
              <button
                class="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                @click="checkHouseInfo(noAdHouse.houseId)"
              >
                查看
              </button>
            </td>
            <td class="px-4 py-3">
              <select
                @input="getHouseAndAdtypeInfo(index)"
                v-model="selectedAdtypes[index]"
              >
                <option
                  v-for="(adtype, adIndex) in props.adtypes"
                  :key="adIndex"
                  :value="adtype"
                >
                  {{ adtype.adName }}
                </option>
              </select>
            </td>
            <td>NTD {{ selectedAdtypes[index]?.adPrice }}</td>
            <td class="px-4 py-3 text-center">
              <button
                class="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                @click="addAd(noAdHouse.houseId, selectedAdtypes[index]?.adtypeId)"
              >
                新增
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 房屋詳細資訊 Modal -->
    <Dialog
      v-model:visible="showHouseModal"
      header="房屋詳細資料"
      :modal="true"
      :dismissableMask="true"
      class="dialog-theme"
    >
      <HouseView :houseId="selectedHouseId" @close="showHouseModal = false" />
    </Dialog>
  </div>
</template>

<style scoped>
.dialog-theme .p-dialog {
  width: 80%;
  max-width: 800px;
}
</style>
