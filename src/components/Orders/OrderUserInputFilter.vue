
<template>
    
    <div class="flex items-center">
        <label for="filter-type" class="text-sm font-medium text-gray-600">
            篩選方式：
        </label>
        <select 
            name="type"
            class="condition-filter ml-2 px-3 py-2 text-sm border border-gray-300 rounded-lg"
            v-model="selectedFilterType"
            @change="onSelectedFilterTypeChange"
        >
            <option value="none">不設條件</option>
            <option value="orderid">訂單編號</option>
            <option value="housetitle">房屋標題</option>
        </select>
        <div class="flex items-center px-4" v-if="showInputBox">
            <label class="text-sm font-medium text-gray-600">
                <input type="text" class="ml-2 px-3 py-2 text-sm border border-gray-300 rounded-lg" v-model="userInput" v-bind:placeholder="placeholder" 
                @input="onUserInputUpdate"/>
            </label>
        </div>
    </div>

</template>

<script>
    export default{
        props:["value", "page"], // 接收 parent component 的值
        data(){
            return{
                selectedFilterType : "none",
                showInputBox : false,
                placeholder : "",
                debounceTimeout: null,
            };
        },
        methods: {
            getPlaceholder(){
                switch(this.selectedFilterType){
                    case "orderid": return "請輸入訂單編號";
                    case "housetitle": return "請輸入房屋標題";
                    default: return "";
                }
            },
            onSelectedFilterTypeChange(){
                this.userInput = "";
                this.placeholder = this.getPlaceholder();
                this.showInputBox = this.selectedFilterType !== "none";
                this.$emit("filter-change", "type", this.selectedFilterType);
            },
            onUserInputUpdate(){
                this.$emit("input-update", this.userInput);
            },
        },
        watch:{
            // 要修重複觸發的bug
            userInput(input){
                clearTimeout(this.debounceTimeout);
                this.debounceTimeout = setTimeout(() => {
                    this.$parent.filters.page = 1; 
                    this.filters.userInput = input;
                }, 300); 
            },
        },
    };
</script>


<style scoped></style>