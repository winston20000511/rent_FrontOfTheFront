<script>
export default {
    props: {
        modelValue: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            input: this.modelValue,
        };
    },
    
    methods: {

    },
    watch: {
        input(newInput) {
            this.$emit("update:modelValue", newInput); 
        },
    },
};
</script>

<template>
    <div class="flex items-center">
        <label class="text-sm font-medium text-gray-600">
            房屋標題：
            <input
                class="ml-2 px-3 py-2 text-sm text-center border border-gray-300 rounded-lg"
                placeholder="請輸入欲查詢的房屋標題" 
                v-model="input"/>
        </label>
    </div>
</template>

<style scoped></style>
