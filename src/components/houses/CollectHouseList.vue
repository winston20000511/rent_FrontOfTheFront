<template>
  <div>
    <!-- 標題 -->
    <h2 class="title">我的房屋列表</h2>

    <!-- 搜尋欄與新增房屋按鈕 -->
    <div class="action-bar">
      <!-- 新增房屋按鈕 -->
      <Button
        label="新增房屋"
        icon="pi pi-plus"
        class="add-house-button"
        @click="openCreateForm"
      />
      <!-- 搜尋欄 -->
      <div class="search-bar">
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText
            v-model="filters['global'].value"
            placeholder="搜尋房屋..."
            class="search-input"
          />
        </span>
      </div>
    </div>

    <!-- 房屋列表 -->
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
          <img
            v-if="slotProps.data.images && slotProps.data.images.length > 0"
            :src="slotProps.data.images[0]"
            alt="House Image"
            width="100"
            height="70"
            class="image-preview"
          />
          <span v-else>無圖片</span>
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
            label="查看"
            icon="pi pi-eye"
            class="prime-theme-button"
            @click="openHouseView(slotProps.data.houseId)"
          />
          <Button
            label="編輯"
            icon="pi pi-pencil"
            class="prime-theme-button"
            @click="openEditForm(slotProps.data.houseId)"
          />
          <Button
            label="刪除"
            icon="pi pi-trash"
            class="prime-theme-button"
            @click="deleteHouse(slotProps.data.houseId)"
          />
        </template>
      </Column>
    </DataTable>

    <!-- 編輯房屋表單彈窗 -->
    <Dialog v-model:visible="showEditForm" :modal="true" header="編輯房屋資訊" class="dialog-theme">
      <HouseUpdate :houseId="selectedHouseId" @close="closeEditForm" />
    </Dialog>

    <!-- 查看房屋表單彈窗 -->
    <Dialog v-model:visible="showHouseView" :modal="true" header="查看房屋資訊" class="dialog-theme">
      <HouseView :houseId="selectedHouseId" @close="closeHouseView" />
    </Dialog>

    <!-- 新增房屋表單彈窗 -->
    <Dialog v-model:visible="showCreateForm" :modal="true" header="新增房屋" class="dialog-theme">
      <HouseCreate @close="closeCreateForm" />
    </Dialog>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import HouseUpdate from "@/components/houses/HouseUpdate.vue";
import HouseCreate from "@/components/houses/HouseCreate.vue";
import HouseView from "@/View/HouseView.vue";

export default {
  components: {
    InputText,
    Button,
    DataTable,
    Column,
    Dialog,
    HouseUpdate,
    HouseView,
    HouseCreate,
  },
  data() {
    return {
      houses: [],
      filters: { global: { value: null, matchMode: "contains" } },
      sortField: null,
      sortOrder: null,
      baseUrl: "http://localhost:8080/api/houses",
      showEditForm: false,
      showHouseView: false,
      showCreateForm: false,
      selectedHouseId: null,
    };
  },
  computed: {
    filteredHouses() {
      const searchTerm = this.filters['global'].value?.toLowerCase() || '';
      return this.houses.filter(house =>
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
        const response = await fetch(`${this.baseUrl}/houses`, {
          headers: this.getAuthHeaders(),
        });
        const houseIds = await response.json();

        const housePromises = houseIds.map(async (id) => {
          const houseId = id.houseId || id;
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
    },
    openEditForm(houseId) {
      this.selectedHouseId = houseId;
      this.showEditForm = true;
    },
    closeEditForm() {
      this.showEditForm = false;
    },
    openHouseView(houseId) {
      this.selectedHouseId = houseId;
      this.showHouseView = true;
    },
    closeHouseView() {
      this.showHouseView = false;
    },
    openCreateForm() {
      this.showCreateForm = true;
    },
    closeCreateForm() {
      this.showCreateForm = false;
    },
    async deleteHouse(houseId) {
      try {
        await fetch(`${this.baseUrl}/delete/${houseId}`, {
          method: "DELETE",
          headers: this.getAuthHeaders(),
        });
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
/* 標題樣式 */
.title {
  text-align: center;
  margin-bottom: 20px;
  color: #495057;
  font-size: 1.75em;
  font-weight: bold;
}

/* 搜尋欄與按鈕行樣式 */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

/* 新增房屋按鈕樣式 */
.add-house-button {
  display: flex;
  align-items: center;
  background-color: #28a745;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 0.9em;
  cursor: pointer;
}

.add-house-button:hover {
  background-color: #218838;
}

/* 搜尋欄樣式 */
.search-bar {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
}

/* 表格樣式 */
.custom-table {
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.custom-table.prime-theme ::v-deep(.p-datatable) {
  background-color: #f8f9fa;
  color: #495057;
  border-radius: 8px;
}

.custom-table.prime-theme ::v-deep(.p-datatable-thead > tr > th) {
  background-color: #6c757d;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  border: none;
}

.custom-table.prime-theme ::v-deep(.p-datatable-tbody > tr) {
  background-color: #ffffff;
  color: #495057;
}

.custom-table.prime-theme ::v-deep(.p-datatable-tbody > tr:hover) {
  background-color: #e9ecef;
}

/* 分頁器樣式 */
.custom-table.prime-theme ::v-deep(.p-paginator) {
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
}

.custom-table.prime-theme ::v-deep(.p-paginator .p-paginator-pages .p-highlight) {
  background-color: #6c757d;
  color: #ffffff;
}

.custom-table.prime-theme ::v-deep(.p-paginator .p-paginator-element) {
  color: #495057;
}

.custom-table.prime-theme ::v-deep(.p-paginator .p-paginator-element:hover) {
  background-color: #e9ecef;
}

/* 按鈕樣式 */
.prime-theme-button {
  display: flex;
  align-items: center;
  border: none;
  background-color: #007bff;
  color: #ffffff;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 0.9em;
  cursor: pointer;
}

.prime-theme-button i {
  margin-right: 8px;
}

.prime-theme-button:hover {
  background-color: #0056b3;
}

/* 圖片預覽樣式 */
.image-preview {
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 對話框樣式 */
.dialog-theme {
  border-radius: 10px;
  overflow: hidden;
}
</style>
