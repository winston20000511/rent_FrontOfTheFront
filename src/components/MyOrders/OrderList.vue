<script>
    export {};
</script>

<template>
    
    <div id="order-box" class="border border-gray-400 py-2 px-2 rounded-md">
        <table id="order-table" class="table-auto w-full border-collapse border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-center text-sm font-medium text-gray-600">
                訂單編號
              </th>
              <th class="px-4 py-2 text-center text-sm font-medium text-gray-600">
                下單時間
              </th>
              <th class="px-4 py-2 text-center text-sm font-medium text-gray-600">
                訂單狀態
              </th>
              <th class="px-4 py-2 text-center text-sm font-medium text-gray-600">
                訂單金額
              </th>
              <th class="px-4 py-2 text-center text-sm font-medium text-gray-600">
                物件內容
              </th>
              <th class="px-4 py-2 text-center text-sm font-medium text-gray-600">
              </th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
    </div>

    <!-- 分頁 -->
    <div class="flex justify-center mt-4">
        <nav aria-label="Page navigation">
          <ul id="pagination" class="inline-flex items-center space-x-2 pagination"></ul>
        </nav>
    </div>

</template>

<style scoped></style>