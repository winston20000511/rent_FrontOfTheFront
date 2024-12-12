<script>
    export {};
</script>

<template lang="">

    <div id="success-modal" class="fixed inset-0 z-10 bg-gray-500/75 flex items-center justify-center hidden">
        <div class="bg-white rounded-lg shadow-lg w-3/4">
            <div class="m-4">
                <h3 id="success-message" class="text-2xl font-semibold m-4 text-gray-900 text-center">
                    提示訊息
                </h3>
                <div class="text-right mt-10">
                    <button
                        id="close-sucess-modal"
                        type="button"
                        class="modal-btn px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-400">
                        關閉
                    </button>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>

</style>
