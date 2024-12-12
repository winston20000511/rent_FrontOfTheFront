<script>
    export {};
</script>

<template lang="">

    <div id="ad-detail-modal" class="fixed inset-0 z-20 bg-gray-500/75 flex items-center justify-center hidden">
        <div class="bg-white rounded-lg shadow-lg w-4/5 h-4/5 p-8">
            <div class="text-right">
                <button id="edit-ad-btn" class="m-1 px-3 py-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                    編輯
                </button>

                <button id="close-ad-modal-btn" class="m-1 px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600">
                    關閉
                </button>
            </div>

            <div>
                <h3 class="text-2xl font-semibold text-gray-900 text-center">廣告內容</h3>
                <div class="m-4 overflow-auto h-[calc(100%-6rem)]">
                    <table class="border border-gray-400 w-full">
                        <tbody class="px-10"></tbody>
                    </table>
                </div>
            </div>
            
        </div>
    </div>

</template>

<style scoped></style>
