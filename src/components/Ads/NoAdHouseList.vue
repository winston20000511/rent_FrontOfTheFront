<script>
    export {};
</script>

<template>

    <div id="ad-add-table-box" class="hidden">
        <div class="px-4 py-2 text-sm font-bold text-yellow-600 bg-yellow-100 rounded m-3">
            請選擇想要升級為VIP的物件
        </div>
        <table class="table-auto w-full text-sm border border-gray-300 rounded-lg">
            <thead>
                <tr class="bg-green-400 text-white">
                <th class="px-4 py-3 text-left font-semibold">房屋標題</th>
                <th class="px-4 py-3 text-left font-semibold">查看房屋</th>
                <th class="px-4 py-3 text-left font-semibold">廣告方案</th>
                <th class="px-4 py-3 text-right font-semibold">廣告價格</th>
                <th class="px-4 py-3 text-center font-semibold">新增廣告</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td colspan="4"></td>
                <td class="px-4 py-4 text-center">
                    <button
                    type="button"
                    id="close-add"
                    class="px-4 py-2 text-white bg-gray-400 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300">
                    結束新增
                    </button>
                </td>
                </tr>
            </tbody>
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
