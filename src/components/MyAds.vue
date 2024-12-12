<script setup>
    import AdPageTitle from './MyAds/AdPageTitle.vue';
    import AdPaymentStatusFilter from './MyAds/AdPaymentStatusFilter.vue';
    import AdPaidDateFilter from './MyAds/AdPaidDateFilter.vue';
    import AdUserInputFilter from './MyAds/AdUserInputFilter.vue';
    import AddAdButton from './MyAds/AddAdButton.vue';
    import CheckCartListButton from './MyAds/CheckCartListButton.vue';
    import AdList from './MyAds/AdList.vue';
    import NoAdHouseList from './MyAds/NoAdHouseList.vue';
    import AdPopUpMessage from './MyAds/AdPopUpMessage.vue';
    import Overlay from './MyAds/Overlay.vue';
    import AdDetailModal from './MyAds/AdDetailModal.vue';
    import CartList from './MyAds/CartList.vue';
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
    @import url(../assets/adAndOrderFront.css);
    @import url("https://npmcdn.com/flatpickr/dist/themes/dark.css");
    @import url("https://cdn.jsdelivr.net/npm/tailwindcss@^2.2.19/dist/tailwind.min.css");
    @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");
    @import url("https://fonts.googleapis.com");
    @import url("https://fonts.gstatic.com");
    @import url("https://fonts.googleapis.com/css2?family=Pacifico&display=swap")
</style>