<template>
  <div class="collect-list-container">

    <h2 class="title">我的收藏列表</h2>

    <ConfirmDialog />

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
      :sortOrder="sortOrder" @sort="onSort" :loading="isLoading"
      loadingIcon="pi pi-spinner">
      <!-- 房屋圖片 -->
      <Column header="圖片" style="width: 150px">
        <template #body="slotProps">
          <div class="image-container">
            <img v-if="slotProps.data.images && slotProps.data.images.length > 0" :src="slotProps.data.images[0]"
              alt="House Image" class="image-preview" />
            <img v-else src="../../assets/no-image.png" alt="無圖片"></img>
          </div>
        </template>
      </Column>


      <Column field="title" header="房屋名稱" :sortable="true" style="width: 200px" />


      <Column field="address" header="地址" :sortable="true" style="width: 200px" />


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
            @click="confirmDelete(slotProps.data.houseId)" />
        </template>
      </Column>
    </DataTable>


    <Dialog v-model:visible="showHouseView" :modal="true" 
    :dismissableMask="true" header="查看房屋資訊" class="dialog-theme">
    <div class="dialog-container">
    <HouseView :houseId="selectedHouseId" @close="closeHouseView" />
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

import HouseView from "@/View/HouseView.vue";
import { ConfirmDialog } from "primevue";

export default {
  name: "CollectList",
  components: {
    InputText,
    Button,
    DataTable,
    Column,
    Dialog,
    ConfirmDialog,
    HouseView,
    
  },
  data() {
    return {
      houses: [],
      filters: { global: { value: null, matchMode: "contains" } },
      sortField: null,
      sortOrder: null,
      baseUrl: "http://localhost:8080/api/houses",
      showHouseView: false,
      selectedHouseId: null,
      isLoading: false,
    };
  },
  computed: {
    // 前端搜索功能
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

    // 加载收藏房屋数据
    async loadHouses() {
      this.isLoading = true;
      try {
        const response = await fetch(`${this.baseUrl}/collect`, {
          headers: this.getAuthHeaders(),
        });
        const houseList = await response.json();

        if (!Array.isArray(houseList)) {
          throw new Error("無效的房屋列表數據");
        }

        const housePromises = houseList.map(async (house) => {
          const houseId = typeof house === "object" ? house.houseId : house;
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
            images: images.map((img) => `data:image/jpeg;base64,${img.base64}`),
          };
        });

        this.houses = await Promise.all(housePromises);
      } catch (error) {
        console.error("加载收藏房屋失败:", error);
      }
      this.isLoading = false;
    },

    // 查看房屋信息
    openHouseView(houseId) {
      this.selectedHouseId = houseId;
      this.showHouseView = true;
    },
    closeHouseView() {
      this.showHouseView = false;

    },

    // 删除收藏
    async deleteHouse(houseId) {
      try {
        await fetch(`${this.baseUrl}/collect/remove/${houseId}`, {
          method: "DELETE",
          headers: this.getAuthHeaders(),
        });
        this.houses = this.houses.filter((h) => h.houseId !== houseId);
        this.loadHouses();
      } catch (error) {
        console.error("删除收藏失败:", error);
      }
    },

    confirmDelete(houseId) {
      this.$confirm.require({
        message: "您確定要移除這個收藏嗎？",
        header: "確認移除收藏",
        icon: "pi pi-exclamation-triangle",
        accept: () => this.deleteHouse(houseId),
      });
    },

    // 排序事件
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
.collect-list-container {
  padding: 20px;
  background-color: #e0f2f1;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 20px;
  color: #008080;
  font-size: 1.8em;
  font-weight: bold;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

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
}

.custom-table.teal-theme ::v-deep(.p-paginator) {
  background-color: #b2dfdb;
  border-top: 1px solid #a7dcd6;
}

.teal-theme-button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: none;
  background-color: #008080;
  color: #ffffff;
  border-radius: 5px;
  padding: 6px 12px;
  font-size: 0.9em;
  cursor: pointer;
  margin-right: 5px;
}

.teal-theme-button:hover {
  background-color: #006666;
}

.image-container {
  width: 100px;
  height: 100px;
  overflow: hidden;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.dialog-theme {
  border-radius: 10px;
  background-color: #b2dfdb;
  padding: 10px;
}

.dialog-theme ::v-deep(.p-dialog-header) {
  background-color: #008080;
  color: #ffffff;
}
.dialog-container {
  background-color: #ffffff;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
