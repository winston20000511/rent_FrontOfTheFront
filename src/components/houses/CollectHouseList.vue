<template>
  <div class="collect-list-container">
    <!-- 標題 -->
    <h2 class="title">我的收藏列表</h2>

    <!-- 搜尋欄 -->
    <div class="action-bar">
      <div class="search-bar">
        <span class="p-input-icon-left">
          <i class="pi pi-search search-icon"></i>
          <InputText v-model="filters['global'].value" placeholder="搜尋房屋..." class="search-input" />
        </span>
      </div>
    </div>

    <!-- 房屋列表 -->
    <DataTable :value="filteredHouses" responsiveLayout="scroll" :paginator="true" :rows="5"
      class="custom-table teal-theme" :filters="filters" filterDisplay="row" :sortField="sortField"
      :sortOrder="sortOrder" @sort="onSort">
      <!-- 房屋圖片 -->
      <Column header="圖片" style="width: 150px">
        <template #body="slotProps">
          <img v-if="slotProps.data.images && slotProps.data.images.length > 0" :src="slotProps.data.images[0]"
            alt="House Image" class="image-preview" width="100" height="70" />
          <span v-else>無圖片</span>
        </template>
      </Column>

      <!-- 房屋名稱 -->
      <Column field="title" header="房屋名稱" :sortable="true" style="width: 200px" />

      <!-- 地址 -->
      <Column field="address" header="地址" :sortable="true" style="width: 200px" />

      <!-- 價格 -->
      <Column field="price" header="價格" :sortable="true" style="width: 150px">
        <template #body="slotProps">
          {{ slotProps.data.price ? `$${slotProps.data.price}` : "未提供價格" }}
        </template>
      </Column>

      <!-- 操作 -->
      <Column header="操作" style="width: 250px">
        <template #body="slotProps">
          <Button label="查看" icon="pi pi-eye" class="teal-theme-button"
            @click="openHouseView(slotProps.data.houseId)" />
          <Button label="刪除" icon="pi pi-trash" class="teal-theme-button"
            @click="deleteHouse(slotProps.data.houseId)" />
        </template>
      </Column>
    </DataTable>

    <!-- 查看房屋表單彈窗 -->
    <Dialog v-model:visible="showHouseView" :modal="true" header="查看房屋資訊" class="dialog-theme">
      <HouseView :houseId="selectedHouseId" @close="closeHouseView" />
    </Dialog>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import HouseView from "@/View/HouseView.vue";

export default {
  name: "CollectList",
  components: {
    InputText,
    Button,
    DataTable,
    Column,
    Dialog,
    HouseView,
  },
  data() {
    return {
      houses: [], // 用來存放收藏的房屋資料 (含圖片)
      filters: { global: { value: null, matchMode: "contains" } },
      sortField: null,
      sortOrder: null,
      baseUrl: "http://localhost:8080/api/houses",
      showHouseView: false,
      selectedHouseId: null,
    };
  },
  computed: {
    // 前端搜尋功能
    filteredHouses() {
      const searchTerm = this.filters["global"].value?.toLowerCase() || "";
      return this.houses.filter((house) => {
        const titleMatch = house.title?.toLowerCase().includes(searchTerm);
        const addressMatch = house.address?.toLowerCase().includes(searchTerm);
        return titleMatch || addressMatch;
      });
    },
  },
  methods: {
    getAuthHeaders() {
      return { Authorization: `${localStorage.getItem("jwt")}` };
    },
    // 1) 載入收藏房屋
    async loadHouses() {
      try {
        const response = await fetch(`${this.baseUrl}/collect`, {
          headers: this.getAuthHeaders(),
        });
        const houseList = await response.json();

        if (!Array.isArray(houseList)) {
          throw new Error("無效的房屋列表數據");
        }

        const housePromises = houseList.map(async (house) => {
          const houseId = typeof house === "object" ? house.houseId : house; // 確保獲取有效的 houseId
          if (!houseId || typeof houseId !== "number") {
            throw new Error(`無效的 houseId: ${JSON.stringify(house)}`);
          }

          const detailsResponse = await fetch(
            `${this.baseUrl}/details/${houseId}`,
            {
              headers: this.getAuthHeaders(),
            }
          );
          const details = await detailsResponse.json();

          const photosResponse = await fetch(
            `${this.baseUrl}/getPhotos/${houseId}`,
            {
              headers: this.getAuthHeaders(),
            }
          );
          const images = await photosResponse.json();

          return {
            ...details,
            images: images.map((img) => `data:image/jpeg;base64,${img}`),
          };
        });

        this.houses = await Promise.all(housePromises);
      } catch (error) {
        console.error("加載房屋列表失敗:", error);
      }
    }
    ,

    // 2) 查看
    openHouseView(houseId) {
      this.selectedHouseId = houseId;
      this.showHouseView = true;
    },
    closeHouseView() {
      this.showHouseView = false;
    },

    // 3) 刪除收藏 (DELETE /collect/remove/{houseId}?houseId=xxx)
    async deleteHouse(houseId) {
      try {
        // 發送刪除收藏請求
        await fetch(
          `${this.baseUrl}/collect/remove/${houseId}`,
          {
            method: "DELETE",
            headers: this.getAuthHeaders(),
          }
        );
        // 前端刪除
        this.houses = this.houses.filter((h) => h.houseId !== houseId);
      } catch (error) {
        console.error("刪除房屋失敗:", error);
      }
    },

    // 4) 排序事件
    onSort(event) {
      this.sortField = event.sortField;
      this.sortOrder = event.sortOrder;
    },
  },
  mounted() {
    this.loadHouses();
  },
};
</script>

<style scoped>
/* 
  <<< TEAL 風格 >>>
  主要使用 #008080, #20B2AA, #40E0D0 這些 Teal/Turquoise 相關色系
*/

/* 容器樣式 */
.collect-list-container {
  padding: 20px;
  background-color: #e0f2f1;
  /* 淡綠 + Teal 背景 */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 標題樣式 */
.title {
  text-align: center;
  margin-bottom: 20px;
  color: #008080;
  /* 深一點的 Teal */
  font-size: 1.8em;
  font-weight: bold;
}

/* 操作區樣式 */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* 搜尋欄樣式 */
.search-bar {
  display: flex;
  align-items: center;
}

.search-icon {
  margin-right: 8px;
  color: #008080;
}

.search-input {
  width: 300px;
  border: 1px solid #a7dcd6;
  border-radius: 5px;
  padding: 8px;
  color: #333;
}

/* 表格樣式 */
.custom-table {
  margin-top: 10px;
  border: 1px solid #a7dcd6;
  border-radius: 5px;
  overflow: hidden;
}

.custom-table.teal-theme ::v-deep(.p-datatable-thead > tr > th) {
  background-color: #008080;
  color: #ffffff;
  text-align: center;
  font-weight: bold;
}

.custom-table.teal-theme ::v-deep(.p-datatable-tbody > tr:hover) {
  background-color: #b2dfdb;
  /* Teal 淡色 Hover */
}

.custom-table.teal-theme ::v-deep(.p-paginator) {
  background-color: #b2dfdb;
  border-top: 1px solid #a7dcd6;
}

/* 按鈕樣式 */
.teal-theme-button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: none;
  background-color: #008080;
  /* Teal */
  color: #ffffff;
  border-radius: 5px;
  padding: 6px 12px;
  font-size: 0.9em;
  cursor: pointer;
  margin-right: 5px;
}

.teal-theme-button:hover {
  background-color: #006666;
  /* 深一點 */
}

/* 圖片預覽樣式 */
.image-preview {
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  object-fit: cover;
}

/* 對話框樣式 */
.dialog-theme {
  border-radius: 10px;
  background-color: #b2dfdb;
  padding: 10px;
}

.dialog-theme ::v-deep(.p-dialog-header) {
  background-color: #008080;
  color: #ffffff;
}
</style>
