<script>
    export {};
</script>

<template lang="">

    <div class="flex items-center">
        <label for="payment-status-filter" class="text-sm font-medium text-gray-600">
            付款狀態：
        </label>
        <select id="payment-status-filter" name="paymentstatus" class="condition-filter ml-2 px-3 py-2 text-sm border border-gray-300 rounded-lg">
            <option value="all">所有狀態</option>
            <option value="paid">已付款</option>
            <option value="unpaid">未付款</option>
        </select>
    </div>
  
</template>

<style scoped></style>
