<script>
    export {};
</script>

<template>

    <div id="order-detail-modal" class="fixed inset-0 z-20 bg-gray-500/75 flex items-center justify-center hidden">
        <div class="bg-white rounded-lg shadow-lg w-4/5 h-4/5 p-8">
          
            <div class="text-right">
            <button id="close-modal-btn" class="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600">
                關閉
            </button>
          </div>

          <h3 class="text-2xl font-semibold text-gray-900 text-center">
            訂單內容
          </h3>

          <div class="m-4 overflow-auto h-[calc(100%-6rem)]">
            <table id="order-modal-table" class="border border-gray-400 w-full">
              <thead class="border border-gray-400">
                <tr></tr>
                <tr></tr>
                <tr></tr>
                <tr></tr>
              </thead>
              <tbody id="order-details-body" class="text-center"></tbody>
            </table>
          </div>

        </div>

    </div>

</template>

<style scoped></style>