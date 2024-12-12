<script>
    export {};
</script>

<template lang="">

    <!--一覽表-->
    <div id="ads-table-box">
        <div class="px-4 py-2 text-sm font-bold text-yellow-600 bg-yellow-100 rounded m-3">
        <div>．VIP申請僅保留三天。如逾期未付款，視為取消申請。</div>
        <div>．加入訂單後，可前往查看訂單內容，並進行付費。</div>
        </div>

        <table class="table-auto w-full border-collapse border border-gray-300">
        <thead class="bg-gray-100">
            <tr>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600 text-center">
                房屋標題
            </th>
            <th class="px-4 py-2 text-center text-sm font-medium text-gray-600">
                發布時間
            </th>
            <th class="px-4 py-2 text-center text-sm font-medium text-gray-600">
                廣告狀態
            </th>
            <th class="px-4 py-2 text-center text-sm font-medium text-gray-600">
                付款狀態
            </th>
            <th class="px-4 py-2 text-center text-sm font-medium text-gray-600">
                剩餘時間
            </th>
            <th class="px-4 py-2 text-center text-sm font-medium text-gray-600"></th>
            </tr>
        </thead>
        <tbody></tbody>
        </table>

        <!-- 分頁 -->
        <div class="flex justify-center mt-4">
            <nav aria-label="Page navigation">
                <ul class="inline-flex items-center space-x-2 pagination"></ul>
            </nav>
        </div>
  </div>

</template>

<style scoped></style>
