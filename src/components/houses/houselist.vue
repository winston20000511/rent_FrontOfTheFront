<template>
  <div>
    <!-- 標題 -->
    <h2>我的房屋列表</h2>

    <!-- 新增房屋按鈕 -->
    <div class="top-buttons">
      <Button
        label="新增房屋"
        icon="pi pi-plus"
        class="p-button-success"
        @click="openCreateForm"
      />
    </div>

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

    <!-- 房屋列表 -->
    <DataTable
      :value="houses"
      responsiveLayout="scroll"
      :paginator="true"
      :rows="5"
      class="custom-table"
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
            class="p-button-info p-mr-2"
            @click="openHouseView(slotProps.data.houseId)"
          />
          <Button
            label="編輯"
            icon="pi pi-pencil"
            class="p-button-primary p-mr-2"
            @click="openEditForm(slotProps.data.houseId)"
          />
          <Button
            label="刪除"
            icon="pi pi-trash"
            class="p-button-danger"
            @click="deleteHouse(slotProps.data.houseId)"
          />
        </template>
      </Column>
    </DataTable>

    <!-- 編輯房屋表單彈窗 -->
    <Dialog v-model:visible="showEditForm" :modal="true" header="編輯房屋資訊">
      <HouseUpdate :houseId="selectedHouseId" @close="closeEditForm" />
    </Dialog>

    <!-- 查看房屋表單彈窗 -->
    <Dialog v-model:visible="showHouseView" :modal="true" header="查看房屋資訊">
      <HouseView :houseId="selectedHouseId" @close="closeHouseView" />
    </Dialog>

    <!-- 新增房屋表單彈窗 -->
    <Dialog v-model:visible="showCreateForm" :modal="true" header="新增房屋">
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
      baseUrl: "http://localhost:8080/api/houses",
      showEditForm: false,
      showHouseView: false,
      showCreateForm: false,
      selectedHouseId: null,
    };
  },
  methods: {
    getAuthHeaders() {
      return { Authorization: `${localStorage.getItem("jwt")}` };
    },
    async loadHouses() {
      try {
        const response = await fetch(`${this.baseUrl}/user/1`, {
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
  },
  mounted() {
    this.loadHouses();
  },
};
</script>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: 20px;
}

.top-buttons {
  text-align: left;
  margin-bottom: 10px;
}

.search-bar {
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
}

.custom-table {
  margin-top: 20px;
}

/* 淺色系表格樣式 */
.custom-table ::v-deep(.p-datatable) {
  background-color: #f9f9f9;
  color: #000;
}

.custom-table ::v-deep(.p-datatable-thead > tr > th) {
  background-color: #e8e8e8;
  color: #000;
}

.custom-table ::v-deep(.p-datatable-tbody > tr) {
  background-color: #ffffff;
  color: #000;
}

.custom-table ::v-deep(.p-datatable-tbody > tr:hover) {
  background-color: #e6f7ff;
}
</style>
