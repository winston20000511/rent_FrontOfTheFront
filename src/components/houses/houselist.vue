<template>
  <div class="house-list-container">
    <!-- 標題 -->
    <h2 class="title">房屋管理系統</h2>

    <!-- 重要：將 ConfirmDialog 標籤放在頂層 -->
    <ConfirmDialog />

    <!-- 搜尋欄與新增房屋按鈕 -->
    <div class="action-bar">
      <Button label="新增房屋" icon="pi pi-plus" class="p-button-success action-button large-button"
        @click="showCreateForm = true" />
      <div class="search-bar">
        <span class="p-input-icon-left">
          <i class="pi pi-search search-icon"></i>
          <InputText v-model="filters['global'].value" placeholder="搜尋房屋..." class="search-input" />
        </span>
      </div>
    </div>

    <!-- 房屋列表 -->
    <DataTable :value="houses" responsiveLayout="scroll" :paginator="true" :rows="5" class="custom-table"
      :filters="filters" filterDisplay="row" :sortField="sortField" :sortOrder="sortOrder">
      <!-- 房屋圖片 -->
      <Column header="圖片" style="width: 150px">
        <template #body="slotProps">
          <div class="image-container">
            <img v-if="slotProps.data.images && slotProps.data.images.length > 0" :src="slotProps.data.images[0]"
            alt="House Image"
            class="image-preview"
            />
            <span v-else>無圖片</span>
          </div>
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

      <!-- 狀態欄 -->
      <Column header="狀態" style="width: 150px">
        <template #body="slotProps">
          <span class="status-column">
            {{ slotProps.data.status === 0 ? "審核中" : "啟用中" }}
          </span>
        </template>
      </Column>

      <!-- 操作 -->
      <Column header="操作" style="width: 250px">
        <template #body="slotProps">
          <Button icon="pi pi-eye" class="p-button-rounded p-button-text p-button-info action-button large-button"
            @click="
              showHouseView = true;
            selectedHouseId = slotProps.data.houseId;
            console.log('Selected House ID:', selectedHouseId);
            " />
          <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-warning action-button large-button"
            @click="
              showEditForm = true;
            selectedHouseId = slotProps.data.houseId;
            " />
          <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger action-button large-button"
            @click="confirmDelete(slotProps.data.houseId)" />
        </template>
      </Column>
    </DataTable>

    <!-- 編輯房屋表單彈窗 -->
    <Dialog v-model:visible="showEditForm" :modal="true" :dismissableMask="false" header="編輯房屋資訊" class="dialog-theme">
      <div class="dialog-container">
        <HouseUpdate :houseId="selectedHouseId" @close="showEditForm = false" />
      </div>
    </Dialog>

    <!-- 查看房屋表單彈窗 -->
    <Dialog v-model:visible="showHouseView" :modal="true" :dismissableMask="true" header="查看房屋資訊" class="dialog-theme">
      <div class="dialog-container">
        <HouseView :houseId="selectedHouseId" @close="showHouseView = false" />
      </div>
    </Dialog>

    <!-- 新增房屋表單彈窗 -->
    <Dialog v-model:visible="showCreateForm" :modal="true" :dismissableMask="false" header="新增房屋" class="dialog-theme">
      <div class="dialog-container">
        <HouseCreate @close="showCreateForm = false" />
      </div>
    </Dialog>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";

import HouseCreate from "./HouseCreate.vue";
import HouseUpdate from "./HouseUpdate.vue";
import HouseView from "@/View/HouseView.vue";
import { ConfirmDialog } from "primevue";


export default {
  components: {
    InputText,
    Button,
    DataTable,
    Column,
    Dialog,
    ConfirmDialog,
    HouseCreate,
    HouseView,
    HouseUpdate,
  },
  data() {
    return {
      houses: [], // 從資料庫取得後端資料
      filters: { global: { value: null, matchMode: "contains" } },
      sortField: null,
      sortOrder: null,
      baseUrl: "http://localhost:8080/api/houses",
      showEditForm: false, // 控制「編輯房屋」彈窗
      showHouseView: false, // 控制「查看房屋」彈窗
      showCreateForm: false, // 控制「新增房屋」彈窗
      selectedHouseId: null, // 當前選擇的房屋ID
    };
  },
  methods: {
    confirmDelete(houseId) {
      this.$confirm.require({
        message: "您確定要下架這個房屋嗎？",
        header: "確認刪除",
        icon: "pi pi-exclamation-triangle",
        accept: () => this.deleteHouse(houseId)
      });
    },
    async deleteHouse(houseId) {
      try {
        const response = await fetch(`${this.baseUrl}/${houseId}/status`, {
          method: "PUT",
          headers: {
            Authorization: `${localStorage.getItem("jwt")}`,
          },
        });
        if (!response.ok) {
          throw new Error("無法下架房屋");
        }
        alert("房屋已成功下架");
        this.loadHouses(); // 重新加載房屋列表
      } catch (error) {
        alert("操作失敗，請稍後再試");
      }
    },
    async loadHouses() {
      try {
        const response = await fetch(`${this.baseUrl}/houses`, {
          headers: this.getAuthHeaders(),
        });
        const houseIds = await response.json();

        // 獲取每個房屋的詳細資料和圖片
        const housePromises = houseIds.map(async (id) => {
          const houseId = id.houseId || id;

          // 1. 取得房屋詳細資料
          const detailsResponse = await fetch(
            `${this.baseUrl}/details/${houseId}`,
            {
              headers: this.getAuthHeaders(),
            }
          );
          const details = await detailsResponse.json();

          // 2. 取得房屋圖片
          const photosResponse = await fetch(
            `${this.baseUrl}/getPhotos/${houseId}`,
            {
              headers: this.getAuthHeaders(),
            }
          );
          const images = await photosResponse.json();

          // 確保圖片正確綁定
          return {
            ...details,
            images: images.map(
              (img) => `data:image/jpeg;base64,${img.base64}` // 構建圖片 URL
            ),
          };
        });

        this.houses = await Promise.all(housePromises); // 更新房屋列表
      } catch (error) {
        console.error("加載房屋列表失敗:", error);
      }
    },

    getAuthHeaders() {
      return { Authorization: `${localStorage.getItem("jwt")}` };
    },
  },
  mounted() {
    // 頁面掛載時，自動請求房屋資料
    this.loadHouses();
  },
};
</script>

<style scoped>
/* 容器樣式 */
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

/* 操作區樣式 */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.action-button {
  margin-right: 10px;
  font-size: 1.2rem;
  padding: 12px 20px;
}

.large-button {
  font-size: 1.5rem;
  padding: 15px 25px;
}

/* 搜尋欄樣式 */
.search-bar {
  display: flex;
  align-items: center;
}

.search-icon {
  margin-right: 12px;
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

.custom-table ::v-deep(.p-datatable-thead > tr > th) {
  background-color: #0891b2;
  color: #ffffff;
  text-align: center;
  font-weight: bold;
}

.custom-table ::v-deep(.p-datatable-tbody > tr:hover) {
  background-color: #e0f7fa;
}

.custom-table ::v-deep(.p-paginator) {
  background-color: #e0f7fa;
  border-top: 1px solid #bae6fd;
}

/* 圖片預覽樣式 */
.image-container {
  width: 100px;
  height: 100px;
  overflow: hidden;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持圖片比例，裁切超出部分 */
  border-radius: 4px;
}

/* 對話框樣式 */
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

/* 增強的按鈕樣式 */
.p-button-success {
  background-color: #34d399;
  border-color: #34d399;
}

.p-button-success:hover {
  background-color: #059669;
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

.p-button-info {
  background-color: #60a5fa;
  border-color: #60a5fa;
}

.p-button-info:hover {
  background-color: #3b82f6;
}
</style>
