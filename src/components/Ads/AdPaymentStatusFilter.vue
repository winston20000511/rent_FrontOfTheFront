<script>
import { ref } from 'vue';

export default {
    setup(props, { emit }) {
        const selectedStatus = ref('all'); // 預設條件

        const onPaymentStatusFilterChange = () => {
            emit('filter-change', 'paymentstatus', selectedStatus.value);
        };

        return {
            selectedStatus,
            onPaymentStatusFilterChange
        };
    }
};
</script>

<template>

    <div class="flex items-center">
        <label for="payment-status-filter" class="text-sm font-medium text-gray-600">
            付款狀態：
        </label>
        <select name="paymentstatus" class="ml-2 px-3 py-2 text-sm border border-gray-300 rounded-lg"
        v-model="selectedStatus"
        @change="onPaymentStatusFilterChange">
            <option value="all">所有狀態</option>
            <option value="paid">已付款</option>
            <option value="unpaid">未付款</option>
        </select>
    </div>
  
</template>

<style scoped></style>
