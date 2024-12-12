<script setup>
import { ref, onMounted, computed } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const BASE_URL = import.meta.env.VITE_APIURL

const someAction = async () => {
    console.log('提交預約');
};


const houseId = 1;  //此由父層傳遞近來
const weekDays = ref('');
const minDate = ref(null);
const maxDate = ref(null);
const selectedDate = ref(null);
const selectedTime = ref('');
const timeSlots = ref([]);
const currentSection = ref(1);

let startTime; 
let endTime; 
let duration; 

const excludedTimes = ref([
    '2024-12-12T12:00:00', // 需要排除的时间点
    '2024-12-13T13:00:00', // 示例：另一个排除的时间点
]); 

const load = async () => {
    const response = await fetch(`${BASE_URL}/booking/list?houseId=1`);
    const data = await response.json();
    console.log(data);

    minDate.value = new Date(data.fromDate);
    maxDate.value = new Date(data.toDate);

    weekDays.value = data.weekDay;

    startTime = data.fromTime;
    endTime = data.toTime;
    duration = data.duration;

}

// 當選擇日期後觸發的邏輯
const onDateChange = (date) => {
    
    if (date) {
        // 格式化日期为 YYYY-MM-DD
        selectedDate.value = date.toISOString().split('T')[0]; // 获取 ISO 字符串并提取日期部分
        selectedTime.value = ''; // 清空时间
        generateTimeSlots(startTime, endTime, duration);
    } else {
        selectedDate.value = null;
        selectedTime.value = '';
    }
};

// 產生時間段
const generateTimeSlots = (startTime, endTime, duration) => {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const times = [];

    while (start <= end) {
        const timeString = start.toTimeString().substring(0, 5);
        const fullDateTimeString = `${selectedDate.value}T${timeString}:00`;
        // 检查当前生成的时间是否在排除列表中
        if (!excludedTimes.value.includes(fullDateTimeString)) {
            times.push(timeString);
        }
        start.setMinutes(start.getMinutes() + duration);
    }

    timeSlots.value = times;
};

const isDateAllowed = (date) => {
    const day = date.getDay();
    const convertedDay = (day === 0) ? 6 : (day - 1);
    const isDisabled = weekDays.value.charAt(convertedDay) === '0';
    return !isDisabled;
};
const disabledWeekDays = computed(() => {
    const disabledDays = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        if (!isDateAllowed(date)) {
            disabledDays.push(i);
        }
    }
    return disabledDays;
});





const goNextSection = () => {
    if (selectedDate.value && selectedTime.value) {
        currentSection.value += 1;
    }
}

onMounted(() => {
    load();

});

</script>

<template>

    <div class="booking-slot container">
        <!-- section 1 -->
        <section v-if="currentSection === 1">
            <Datepicker id="select-date" 
                locale="zh" 
                format="yyyy-MM-dd"
                v-model="selectedDate" 
                :min-date="minDate" 
                :max-date="maxDate"
                :disabled-week-days="disabledWeekDays" 
                inline 
                auto-apply
                :enable-time-picker="false" 
                @update:modelValue="onDateChange" />

            <div v-if="!selectedDate">請先選擇日期</div>
            <div v-if="selectedDate">
                <label for="select-time">選擇時間:</label>
                <select v-model="selectedTime">
                    <option value="" disabled>請選擇時間</option>
                    <option v-for="time in timeSlots" :key="time" :value="time">
                        {{ time }}
                    </option>
                </select>
            </div>
            <button :disabled="!selectedDate || !selectedTime"  class="btn btn-primary" @click="goNextSection">下一步</button>
        </section>
        <!-- section 2 -->
        <section v-if="currentSection === 2">
            <div >{{ selectedDate }}　{{ selectedTime }}</div>
            
            <button class="btn btn-info" type="button" @click="someAction" >完成預約</button>
            <button @click="currentSection--">上一步</button>
        </section>
    </div>

</template>

<style lang="css" scoped>
.booking-slot {
    display: flex;
    flex-direction: column;
     gap: 10px;
}



input[type="date"] {
    padding: 10px;
}
</style>