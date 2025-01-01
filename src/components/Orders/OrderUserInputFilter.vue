<script>
    export default {
        data() {
            return {
                selectedFilterType: "none",
                userInput: "", // 儲存使用者輸入的內容
                showInputBox: false,
                placeholder: "",
            };
        },
        methods: {
            getPlaceholder() {
                switch (this.selectedFilterType) {
                    case "orderid":
                        return "請輸入訂單編號";
                    case "housetitle":
                        return "請輸入房屋標題";
                    default:
                        return "";
                }
            },

            onSelectedFilterTypeChange() {
                this.userInput = ""; // 重置輸入框的內容
                this.placeholder = this.getPlaceholder();
                this.showInputBox = this.selectedFilterType !== "none";
                this.$emit("filter-change", "inputcondition", this.selectedFilterType);
            },

            onInputEnterClick(){
                // console.log("輸入的值: ", this.userInput);
                this.$emit("input-update", this.userInput);
            }
        },
    };
</script>

<template>
    <div class="flex items-center">
        <label for="filter-type" class="text-sm font-medium text-gray-600">
            篩選方式：
        </label>
        <select 
            name="inputcondition"
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
                <input 
                    type="text" 
                    class="ml-2 px-3 py-2 text-sm border border-gray-300 rounded-lg" 
                    v-model="userInput" 
                    :placeholder="placeholder" 
                    @keypress.enter="onInputEnterClick"
                />
            </label>
        </div>
    </div>
</template>