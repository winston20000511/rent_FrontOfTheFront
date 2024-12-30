<script>
import { ref } from 'vue';

export default {
    setup(props, { emit }) {
        const selectedDateRange = ref('all'); // 預設條件

        const onDateFilterChange = () => {
            emit('filter-change', 'daterange', selectedDateRange.value);
        };

        return {
            selectedDateRange,
            onDateFilterChange
        };
    }
};
</script>

<template>

    <div class="flex items-center">
        <label for="payment-date-filter" class="text-sm font-medium text-gray-600">
            發布時間：
        </label>
        <select 
        name="daterange" class="ml-2 px-3 py-2 text-sm border border-gray-300 rounded-lg"
        v-model="selectedDateRange" 
        @change="onDateFilterChange">
            <option value="all">所有時間</option>
            <option value="week">最近一週</option>
            <option value="month">最近一個月</option>
            <option value="year">最近一年</option>
            <!-- <option value="user-set">自訂時間</option> -->
        </select>
        <!-- <input id="time-picker" class="ml-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hidden" placeholder="請輸入日期區間"/> -->
    </div>

</template>

<style scoped></style>