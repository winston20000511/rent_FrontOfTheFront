<template>
  <div class="house-list-container">
    <!-- 標題 -->
    <h2 class="title">我的收藏列表</h2>

    <!-- 搜尋欄 -->
    <div class="action-bar">
      <div class="search-bar">
        <span class="p-input-icon-left">
          <i class="pi pi-search search-icon" />
          <InputText
            v-model="filters['global'].value"
            placeholder="搜尋房屋..."
            class="search-input"
          />
        </span>
      </div>
    </div>

    <!-- 房屋列表 (DataTable) -->
    <DataTable
      :value="filteredHouses"
      responsiveLayout="scroll"
      :paginator="true"
      :rows="5"
      class="custom-table prime-theme"
      :filters="filters"
      filterDisplay="row"
      :sortField="sortField"
      :sortOrder="sortOrder"
      @sort="onSort"
    >
      <!-- 房屋圖片 -->
      <Column header="圖片" style="width: 150px">
        <template #body="slotProps">
          <div class="image-container">
            <img
              v-if="slotProps.data.images && slotProps.data.images.length > 0"
              :src="slotProps.data.images[0]"
              alt="House Image"
              class="image-preview"
            />
            <span v-else>無圖片</span>
          </div>
        </template>
      </Column>

      <!-- 房屋名稱 -->
      <Column
        field="title"
        header="房屋名稱"
        :sortable="true"
        style="width: 200px"
      />

      <!-- 地址 -->
      <Column
        field="address"
        header="地址"
        :sortable="true"
        style="width: 200px"
      />

      <!-- 價格 -->
      <Column field="price" header="價格" :sortable="true" style="width: 150px">
        <template #body="slotProps">
          {{ slotProps.data.price ? `$${slotProps.data.price}` : "未提供價格" }}
        </template>
      </Column>

      <!-- 操作 -->
      <Column header="操作" style="width: 250px">
        <template #body="slotProps">
          <Button
            icon="pi pi-eye"
            class="p-button-rounded p-button-text p-button-info action-button large-button"
            @click="openHouseView(slotProps.data.houseId)"
          />
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-text p-button-warning action-button large-button"
            @click="openEditForm(slotProps.data.houseId)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-text p-button-danger action-button large-button"
            @click="deleteHouse(slotProps.data.houseId)"
          />
        </template>
      </Column>
    </DataTable>

    <!-- 查看房屋表單彈窗 -->
    <Dialog
      v-model:visible="showHouseView"
      :modal="true"
      header="查看房屋資訊"
      class="dialog-theme"
    >
      <div class="dialog-container">
        <HouseView :houseId="selectedHouseId" @close="closeHouseView" />
      </div>
    </Dialog>

    <!-- (若有需要，也可新增編輯或新增功能的 Dialog，
         參考 HouseList.vue 的做法) -->
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import HouseView from "@/View/HouseView.vue";
// (若有需要編輯表單、新增表單，也可 import HouseUpdate, HouseCreate)

export default {
  name: "MyCollection",
  components: {
    InputText,
    Button,
    DataTable,
    Column,
    Dialog,
    HouseView,
    // HouseUpdate,
    // HouseCreate,
  },
  data() {
    return {
      houses: [],
      filters: { global: { value: null, matchMode: "contains" } },
      sortField: null,
      sortOrder: null,
      baseUrl: "http://localhost:8080/api/houses", // 根據實際情況
      showHouseView: false,
      selectedHouseId: null,
    };
  },
  computed: {
    // 依照 global search 進行篩選
    filteredHouses() {
      const searchTerm = this.filters["global"].value?.toLowerCase() || "";
      return this.houses.filter(
        (house) =>
          house.title.toLowerCase().includes(searchTerm) ||
          house.address.toLowerCase().includes(searchTerm)
      );
    },
  },
  methods: {
    getAuthHeaders() {
      return { Authorization: `${localStorage.getItem("jwt")}` };
    },
    async loadHouses() {
      try {
        // 1) 向後端拿「收藏的房屋 ID 列表」
        const response = await fetch(`${this.baseUrl}/collect`, {
          headers: this.getAuthHeaders(),
        });
        const houseIds = await response.json();

        // 2) 逐一取詳細資料 + 圖片
        const housePromises = houseIds.map(async (id) => {
          const houseId = id.houseId || id;

          // 2.1 細節
          const detailsResponse = await fetch(
            `${this.baseUrl}/details/${houseId}`,
            {
              headers: this.getAuthHeaders(),
            }
          );
          const details = await detailsResponse.json();

          // 2.2 圖片
          const photosResponse = await fetch(
            `${this.baseUrl}/getPhotos/${houseId}`,
            {
              headers: this.getAuthHeaders(),
            }
          );
          const images = await photosResponse.json();

          return {
            ...details,
            // 轉成 data URL
            images: images.map((img) => `data:image/jpeg;base64,${img}`),
          };
        });

        // 等待所有 Promise 完成後更新列表
        this.houses = await Promise.all(housePromises);
      } catch (error) {
        console.error("加載房屋列表失敗:", error);
      }
    },
    // 查看詳情
    openHouseView(houseId) {
      this.selectedHouseId = houseId;
      this.showHouseView = true;
    },
    closeHouseView() {
      this.showHouseView = false;
    },
    // 編輯表單
    openEditForm(houseId) {
      console.log("TODO: open edit form, houseId=", houseId);
      // this.showEditForm = true;
      // this.selectedHouseId = houseId;
    },
    // 刪除收藏
    async deleteHouse(houseId) {
      try {
        await fetch(`${this.baseUrl}/collect/remove/${houseId}`, {
          method: "DELETE",
          headers: this.getAuthHeaders(),
        });
        // 前端同步移除
        this.houses = this.houses.filter((house) => house.houseId !== houseId);
      } catch (error) {
        console.error("刪除房屋失敗:", error);
      }
    },
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
.house-list-container {
  padding: 20px;
  background-color: #f0f9ff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 標題樣式 */
.title {
  text-align: center;
  margin-bottom: 20px;
  color: #065f73;
  font-size: 1.8em;
  font-weight: bold;
}

/* 操作區 (搜尋欄) */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.search-bar {
  display: flex;
  align-items: center;
}
.search-icon {
  margin-right: 8px;
}
.search-input {
  width: 300px;
  border: 1px solid #bae6fd;
  border-radius: 5px;
  padding: 8px;
}

/* 表格樣式 */
.custom-table {
  margin-top: 10px;
  border: 1px solid #cbe7f3;
  border-radius: 5px;
  overflow: hidden;
}
.custom-table.prime-theme ::v-deep(.p-datatable-thead > tr > th) {
  background-color: #0891b2;
  color: #ffffff;
  text-align: center;
  font-weight: bold;
}
.custom-table.prime-theme ::v-deep(.p-datatable-tbody > tr:hover) {
  background-color: #e0f7fa;
}
.custom-table.prime-theme ::v-deep(.p-paginator) {
  background-color: #e0f7fa;
  border-top: 1px solid #bae6fd;
}

/* 圖片容器 */
.image-container {
  width: 100px;
  height: 70px;
  overflow: hidden;
}
.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* 動作按鈕 */
.action-button {
  margin-right: 10px;
  font-size: 1.2rem;
  padding: 12px 20px;
}
.large-button {
  font-size: 1.5rem;
  padding: 15px 25px;
}
.p-button-info {
  background-color: #60a5fa;
  border-color: #60a5fa;
}
.p-button-info:hover {
  background-color: #3b82f6;
}
.p-button-danger {
  background-color: #f87171;
  border-color: #f87171;
}
.p-button-danger:hover {
  background-color: #dc2626;
}
.p-button-warning {
  background-color: #fbbf24;
  border-color: #fbbf24;
}
.p-button-warning:hover {
  background-color: #d97706;
}

/* 對話框 */
.dialog-theme {
  border-radius: 10px;
  background-color: #e3f2fd;
  padding: 10px;
}
.dialog-container {
  background-color: #ffffff;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.dialog-theme ::v-deep(.p-dialog-header) {
  background-color: #0891b2;
  color: #ffffff;
}
.dialog-theme ::v-deep(.p-dialog-content) {
  padding: 20px;
}
.dialog-theme ::v-deep(.p-dialog-footer) {
  display: flex;
  justify-content: flex-end;
}
</style>
