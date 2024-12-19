<script>
import ProgressSpinner from "primevue/progressspinner";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import HouseView from "@/View/HouseView.vue";

export default {
  name: "CollectHouses",
  components: {
    ProgressSpinner,
    DataTable,
    Column,
    Button,
    InputText,
    Message,
    HouseView,
  },
  data() {
    return {
      userId: 1,
      houseIds: [],
      houses: [],
      loading: false,
      showView: false, // 控制彈窗顯示
      selectedHouseId: null, // 選中的房屋 ID
      filters: {
        global: { value: null, matchMode: "contains" },
      },
      baseUrl: "http://localhost:8080/api/houses",
    };
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem("jwt");
      return { Authorization: `${token}` };
    },
    async fetchHouseIds() {
      const response = await fetch(`${this.baseUrl}/collect/${this.userId}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });
      if (response.ok) this.houseIds = await response.json();
    },
    async fetchHouseDetails(houseId) {
      const response = await fetch(`${this.baseUrl}/details/${houseId}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });
      return response.ok ? await response.json() : null;
    },
    async fetchHousePhotos(houseId) {
      const response = await fetch(`${this.baseUrl}/getPhotos/${houseId}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });
      const base64Images = response.ok ? await response.json() : [];
      return base64Images.map((base64) => `data:image/jpeg;base64,${base64}`);
    },
    async deleteHouse(houseId) {
      await fetch(`${this.baseUrl}/collect/delete/${this.userId}/${houseId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      this.houses = this.houses.filter((house) => house.houseId !== houseId);
    },
    openHouseView(houseId) {
      this.selectedHouseId = String(houseId);
      this.showView = true;
    },
    closeHouseView() {
      this.showView = false;
    },
    async loadHouses() {
      this.loading = true;
      await this.fetchHouseIds();
      const housePromises = this.houseIds.map(async (id) => {
        const details = await this.fetchHouseDetails(id);
        const images = await this.fetchHousePhotos(id);
        return { ...details, images, houseId: id };
      });
      this.houses = await Promise.all(housePromises);
      this.loading = false;
    },
  },
  mounted() {
    this.loadHouses();
  },
};
</script>

<template>
  <div>
    <!-- 標題 -->
    <h2>我的收藏房屋</h2>

    <!-- 搜尋欄 -->
    <div class="search-bar">
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText
          v-model="filters['global'].value"
          placeholder="搜尋房屋..."
        />
      </span>
    </div>

    <!-- 加載中 -->
    <div v-if="loading" class="loading">
      <ProgressSpinner />
    </div>

    <!-- 收藏列表 -->
    <div v-else>
      <div v-if="houses.length > 0">
        <DataTable
          :value="houses"
          responsiveLayout="scroll"
          :paginator="true"
          :rows="5"
          :rowsPerPageOptions="[5, 10, 20]"
          v-model:filters="filters"
          filterDisplay="menu"
          class="custom-table"
        >
          <!-- 圖片 -->
          <Column header="圖片" style="width: 150px;">
            <template #body="slotProps">
              <img
                v-if="slotProps.data.images.length > 0"
                :src="slotProps.data.images[0]"
                alt="House Image"
                width="100"
                height="70"
              />
              <span v-else>無圖片</span>
            </template>
          </Column>

          <!-- 標題 -->
          <Column field="title" header="房屋名稱" :sortable="true" style="width: 200px;" />

          <!-- 地址 -->
          <Column field="address" header="地址" :sortable="true" style="width: 200px;" />

          <!-- 價格 -->
          <Column field="price" header="價格" :sortable="true" style="width: 150px;">
            <template #body="slotProps">
              {{ slotProps.data.price ? `$${slotProps.data.price}` : "未提供價格" }}
            </template>
          </Column>

          <!-- 操作 -->
          <Column header="操作" style="width: 200px;">
            <template #body="slotProps">
              <!-- 刪除按鈕 -->
              <Button
                icon="pi pi-trash"
                label="刪除"
                class="p-button-danger p-mr-2"
                @click="deleteHouse(slotProps.data.houseId)"
              />
              <!-- 查看房屋按鈕 -->
              <Button
                icon="pi pi-eye"
                label="查看"
                class="p-button-secondary"
                @click="openHouseView(slotProps.data.houseId)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
      <div v-else>
        <Message severity="info" :closable="false">暫無收藏的房屋</Message>
      </div>
    </div>

    <!-- 房屋詳細頁面 (彈窗) -->
    <HouseView
      v-if="showView"
      :houseId="selectedHouseId"
      :visible="showView"
      @close="closeHouseView"
    />
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333; /* 標題字體顏色 */
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

img {
  border-radius: 5px;
}

.custom-table ::v-deep(.p-datatable) {
  background-color: #f9f9f9; /* 表格背景顏色 */
  color: #000; /* 表格內文字顏色設為黑色 */
}

.custom-table ::v-deep(.p-datatable-thead > tr > th) {
  background-color: #f0f0f0; /* 表頭背景顏色 */
  color: #000; /* 表頭文字顏色設為黑色 */
  text-align: center;
  font-weight: bold; /* 表頭字體加粗 */
}

.custom-table ::v-deep(.p-datatable-tbody > tr) {
  background-color: #ffffff; /* 表格每列的背景顏色 */
  color: #000; /* 表格列中文字設為黑色 */
}

.custom-table ::v-deep(.p-datatable-tbody > tr:hover) {
  background-color: #e6f7ff; /* 滑鼠懸停時的背景顏色 */
}
</style>
