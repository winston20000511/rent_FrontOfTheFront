<template>

    <div class="flex items-center">
        <label for="order-status-filter" class="text-sm font-medium text-gray-600">
        訂單狀態：
        </label>
        <select 
            name="status"
            class="condition-filter ml-2 px-3 py-2 text-sm border border-gray-300 rounded-lg"
            v-model="selectedStatus"
            @change="onStatusFilterChange"
        >
            <option value="all">所有狀態</option>
            <option value="active">一般訂單</option>
            <option value="cancelled">已取消</option>
            <option value="cancelling">取消中</option>
        </select>
    </div>

</template>

<script>
    export default{
        data(){
            return{
                selectedStatus: "all", // 預設值
            };
        },
        methods:{
            onStatusFilterChange(){
                this.$emit("filter-change", "status", this.selectedStatus);
            }
        },
    };
</script>


<style scoped></style>