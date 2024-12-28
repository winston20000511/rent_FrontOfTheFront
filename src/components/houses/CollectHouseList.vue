<template>
  <div>
    <!-- 搜尋欄 -->
    <div>
      <label for="search" class="form-label">搜尋標題或ID</label>
      <input
        type="text"
        id="search"
        class="form-control"
        v-model="searchValue"
        @input="filterHouses"
        placeholder="請輸入搜尋條件"
      />
    </div>

    
    <!-- easy-data-table 顯示資料 -->
    <easy-data-table
      :headers="headers"
      :items="houses"
      :search-value="searchValue"
      :rows-per-page="10"
      theme-color="#1d90ff"
      class="customize-table"
      :buttons-pagination="true"
    >
      <template #item-operation="{ item }">
        <div class="operation-wrapper">
          <button @click="deleteItem(item)" class="btn btn-danger">刪除</button>
        </div>
      </template>
    </easy-data-table>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Vue3EasyDataTable from 'vue3-easy-data-table';
import "vue3-easy-data-table/dist/style.css";
const EasyDataTable = Vue3EasyDataTable;

export default {
  components: {
    EasyDataTable,
  },
  data() {
    return {
      baseAddress: "http://localhost:8080",  // API 基本地址
      headers: [
        { text: "標題", value: "title", sortable: true, fixed: true },
        { text: "坪數", value: "size", sortable: true },
        { text: "地址", value: "address", sortable: true },
        { text: "租金", value: "price", sortable: true },
        { text: "操作", value: "operation" },
      ],
      houses: [],  // 儲存房屋資料
      searchValue: "",  // 搜索關鍵字
    };
  },
  methods: {
    // 根據關鍵字篩選房屋資料
    async filterHouses() {
      const request = {
        HouseID: isNaN(Number(this.searchValue)) || this.searchValue === "" ? -1 : Number(this.searchValue),
        Title: this.searchValue,
      };

      const url = new URL(`${this.baseAddress}/api/houses/details`);
      url.searchParams.append("HouseID", request.HouseID);
      url.searchParams.append("Title", request.Title);

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.houses = data;  // 更新房屋資料
      } catch (error) {
        console.error("獲取資料時發生錯誤:", error);
        alert("獲取資料時發生錯誤，請稍後再試。");
      }
    },

    // 刪除房屋資料
    async deleteItem(item) {
      const confirmation = confirm("確定要刪除嗎?");
      if (confirmation) {
        try {
          const response = await fetch(
            `${this.baseAddress}/api/houses/deleteCollecthouse/${item.HouseID}`,
            { method: "DELETE" }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const message = await response.text();
          alert(message);
          this.filterHouses();  // 刪除後重新加載資料
        } catch (error) {
          console.error("刪除時發生錯誤:", error);
          alert("刪除時發生錯誤，請稍後再試。");
        }
      }
    },
  },
  mounted() {
    this.filterHouses();  // 在組件掛載時自動載入資料
  },
};
</script>

<style scoped>
.customize-table th,
.customize-table td,
.customize-table .pagination,
.customize-table .buttons-pagination .page-item,
.customize-table .buttons-pagination .page-link {
  font-size: 15px;
}
</style>