<script setup>
    import AdPageTitle from '@/components/Ads/AdPageTitle.vue';
    import AdPaymentStatusFilter from '@/components/Ads/AdPaymentStatusFilter.vue';
    import AdPaidDateFilter from '@/components/Ads/AdPaidDateFilter.vue';
    import AdUserInputFilter from '@/components/Ads/AdUserInputFilter.vue';
    import AddAdButton from '@/components/Ads/AddAdButton.vue';
    import CheckCartListButton from '@/components/Ads/CheckCartListButton.vue';
    import AdList from '@/components/Ads/AdList.vue';
    import NoAdHouseList from '@/components/Ads/NoAdHouseList.vue';
    import AdPopUpMessage from '@/components/Ads/AdPopUpMessage.vue';
    import Overlay from '@/components/Ads/Overlay.vue';
    import AdDetailModal from '@/components/Ads/AdDetailModal.vue';
    import CartList from '@/components/Ads/CartList.vue';
</script>

<template>

    <AdPageTitle/>

    <div class="flex flex-wrap items-center space-x-6 mt-4 mb-6 px-6">
        <div class="flex items-center space-x-6 flex-grow">
            <AdPaymentStatusFilter/>
            <AdPaidDateFilter/>
        </div>

        <div class="flex items-center justify-end w-full sm:w-auto">
            <AddAdButton/>
        </div>
    </div>
    
    <div class="flex flex-wrap items-center space-x-6 mt-4 mb-6 px-6">
        <div class="flex items-center space-x-6 flex-grow">
            <AdUserInputFilter/>
        </div>

        <div class="flex items-center justify-end w-full sm:w-auto">
            <CheckCartListButton/>
        </div>
    </div>

    <main class="m-3">
        <div id="view-box" class="border border-gray-400 py-2 px-2 rounded-md">
            <AdList/>
            <NoAdHouseList/>
        </div>
    </main>

    <Overlay/>
    <AdPopUpMessage/>
    <AdDetailModal/>

    <CartList/>

</template>

<style scoped>
    @import url("https://npmcdn.com/flatpickr/dist/themes/dark.css");
    @import url("https://cdn.jsdelivr.net/npm/tailwindcss@^2.2.19/dist/tailwind.min.css");
    @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");
    @import url("https://fonts.googleapis.com");
    @import url("https://fonts.gstatic.com");
    @import url("https://fonts.googleapis.com/css2?family=Pacifico&display=swap");

    @import url("/src/assets/adAndOrderFront.css");

</style>