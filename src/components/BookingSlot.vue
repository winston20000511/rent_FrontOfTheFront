<script setup>
import { ref, onMounted } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'


const BASE_URL = import.meta.env.VITE_APIURL

const houseId = 1;  //此由父層傳遞近來

// 初始設置：最小和最大日期範圍
const minDate = ref(null);
const maxDate = ref(null);

// 用來存儲選擇的日期和時間
const selectedDate = ref(null);
const selectedTime = ref('');

// 模擬可用的時間段（可以根據需求來動態更新）
const timeSlots = ref([]);


const load = async () => {
    const response = await fetch(`${BASE_URL}/booking/list?houseId=1`);
    const data = await response.json();
    console.log(data);

    minDate.value = new Date(data.fromDate);
    maxDate.value = new Date(data.toDate);

    const weekDays = data.weekDay;


    const startTime = data.fromTime;
    const endTime = data.toTime;
    const duration = data.duration;

    generateTimeSlots(startTime, endTime, duration);
}

// 產生時間段
const generateTimeSlots = (startTime, endTime, duration) => {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const times = [];

    while (start <= end) {
        times.push(start.toTimeString().substring(0, 5));
        start.setMinutes(start.getMinutes() + duration);
    }

    timeSlots.value = times;
};

const isDateAllowed = {
  customPredictor: (date) => {
    const dayOfWeek = date.getDay(); // 取得星期幾 (0 = 週日, 1 = 週一, ...)
    
    // 根據 `weekDay` 字符串判斷對應星期是否開放
    const isOpen = weekDays.value[dayOfWeek] === '1'; // 檢查對應位置的字符，是否為 '1' 表示開放
    return isOpen;
  }
};

// 當選擇日期後觸發的邏輯
const onDateChange = (date) => {
    selectedDate.value = date;
    selectedTime.value = '';
};


onMounted(() => {
    load();

});

</script>

<template>

    <div class="booking-slot">
        <!-- 日期選擇 -->
        <label for="select-date">選擇日期:</label>
        <Datepicker
            id="select-date"
            v-model="selectedDate"
            :min-date="minDate"
            :max-date="maxDate"
            :filters="isDateAllowed"
            :inline="true"
            :enable-time-picker="false"
            @change="onDateChange"
            />

        <!-- 如果選擇了日期，顯示時間選擇 -->
        <div v-if="selectedDate">
            <label for="select-time">選擇時間:</label>
            <select v-model="selectedTime">
                <option value="" disabled>請選擇時間</option>
                <option v-for="time in timeSlots" :key="time" :value="time">
                    {{ time }}
                </option>
            </select>
        </div>
    </div>

</template>

<style lang="css" scoped>
.booking-slot {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

select {
    padding: 5px;
}

input[type="date"] {
    padding: 5px;
}
</style>