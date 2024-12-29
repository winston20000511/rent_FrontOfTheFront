<script setup>
import { ref } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "search"]);

const input = ref(props.modelValue);

function handleKeyPress(){
    emit("update:modelValue", input.value); // Update parent value
    emit("search", input.value); // Trigger search
};
</script>

<template>
    <div class="flex items-center">
        <label class="text-sm font-medium text-gray-600">
            房屋標題：
            <input
                class="ml-2 px-3 py-2 text-sm text-center border border-gray-300 rounded-lg"
                placeholder="請輸入欲查詢的房屋標題" 
                v-model="input"
                @keypress.enter="handleKeyPress"
                />
        </label>
    </div>
</template>

<style scoped></style>
