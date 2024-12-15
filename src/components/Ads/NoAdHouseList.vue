<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["filter-no-ad-houses", "selected-house-adtype-id"]);

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

const isDataLoaded = ref(false);

const selectedAdtypes = ref([]);

const initializeData = () => {
  if (props.noAdHouses.length > 0 && props.adtypes.length > 0) {
    selectedAdtypes.value = props.noAdHouses.map(
      () => props.adtypes[0] || null
    );
    isDataLoaded.value = true;
  }
};

watch(
  [() => props.noAdHouses, () => props.adtypes],
  () => {
    isDataLoaded.value = false;
    initializeData();
  },
  { immediate: true }
);

// 更新價格的方法
const getHouseAndAdtypeInfo = (index) => {
  const selectedAdtype = selectedAdtypes.value[index];
  const houseId = props.noAdHouses[index].houseId;

  console.log("House ID: ", houseId, "Adtype Price: ", selectedAdtype?.adPrice, "Index: ", index);


  if (selectedAdtype) {
    emit("selected-house-adtype-id", 
        { houseId: houseId, adtypeId: selectedAdtype.adtypeId });
  }
};
</script>

<template>
  <div>
    <div v-if="!isDataLoaded" class="text-center py-6 text-gray-500">
      數據加載中...
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
            v-for="(noAdHouse, index) in props.noAdHouses"
            :key="index"
            class="text-center"
          >
            <td class="px-4 py-3">{{ noAdHouse.houseTitle }}</td>
            <td class="px-4 py-3">
              <button
                class="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                查看
              </button>
            </td>
            <td class="px-4 py-3">
              <select
                @change="getHouseAndAdtypeInfo(index)"
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
              >
                新增
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
