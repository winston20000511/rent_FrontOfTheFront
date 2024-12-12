<script setup>
    import OrderPageTitle from './MyOrders/OrderPageTitle.vue';
    import OrderStatusFilter from './MyOrders/OrderStatusFilter.vue';
    import OrderDateFilter from './MyOrders/OrderDateFilter.vue';
    import OrderUserInputFilter from './MyOrders/OrderUserInputFilter.vue';
    import CreateOrderButton from './MyOrders/CreateOrderButton.vue';
    import OrderList from './MyOrders/OrderList.vue';
    import Overlay from './Ads/Overlay.vue';
    import OrderDetailModal from './MyOrders/OrderDetailModal.vue';
    import OrderPopUpMessage from './MyOrders/OrderPopUpMessage.vue';
</script>

<template>

    <OrderPageTitle/>

    <div class="flex flex-wrap items-center space-x-6 mt-4 mb-6 px-6">
        <OrderStatusFilter v-model="filters.status" @filter-change="changeFilter"/>
        <OrderDateFilter v-model="filters.dateRange" @filter-change="changeFilter"/>
        <OrderUserInputFilter v-model="filters.userInput" @filter-change="changeFilter"
        @input-update="updateInput"/>
    </div>
    
    <div class="w-full text-right px-4">
        <CreateOrderButton @click-create-btn="goToAddAd"/>
    </div>
    
    <main class="m-3">
        <OrderList :filter="filters"/>
    </main>

    <Overlay/>
    <OrderDetailModal/>
    <OrderPopUpMessage/>

</template>

<script>
    export default {
        data(){
            return{
                // 存放篩選條件
                filters:{
                    page: 1,
                    status: "all",
                    dateRange: "all",
                    type: "none",
                    userInput: "",
                },
            };
        },
        components: {
            CreateOrderButton,
            OrderStatusFilter,
            OrderDateFilter,
            OrderUserInputFilter,
            OrderList,
        },
        methods: {
            goToAddAd() {
                console.log("點到新增VIP服務的按鈕")
                // 轉址到 AD page
                // window.location.href = "/advertisements/mylist?action=addAd";
            },

            // 更新篩選條件
            changeFilter(filterName, filterValue){
                this.filters[filterName] = filterValue;
                this.filters.page = 1;
                this.filters.userInput = "";
                console.log("this filter: ", this.filters);
                this.filterOrders();
            },
            updateInput(input){
                console.log("parent input: ", input)
                this.filters.page = 1;
                this.filters.userInput = input;
                console.log("input change - filter: ", this.filters); // 用於檢查
            },
            async filterOrders(){
                console.log("變更的篩選條件: ", this.filters);
                
                /*
                try{
                    const response = await this.$axios.post("/api/orders/filter", this.filters);
                    const orders = await response.data;
                    console.log("訂單: ", orders);
                }catch(error){
                    console.log("發送請求時有錯誤: ", error);
                }
                */
                
            }
        }
    };
</script>

<style scoped>
    @import url(../assets/adAndOrderFront.css);
    @import url("https://npmcdn.com/flatpickr/dist/themes/dark.css");
    @import url("https://cdn.jsdelivr.net/npm/tailwindcss@^2.2.19/dist/tailwind.min.css");
    @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");
    @import url("https://fonts.googleapis.com");
    @import url("https://fonts.gstatic.com");
    @import url("https://fonts.googleapis.com/css2?family=Pacifico&display=swap")
</style>