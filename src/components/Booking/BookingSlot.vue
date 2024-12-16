<script setup>
import { ref, onMounted, computed, defineProps, nextTick } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import BookingAgreement from './bookingAgreement.vue';


const BASE_URL = import.meta.env.VITE_APIURL

const someAction = async () => {
    console.log("houseId: "+houseId.value);
};


const isAgreed = ref(false);
const props = defineProps({
    houseId: {
        type: Number,
        required: true
    }
});

// const houseId = 1;  //此由父層傳遞近來
const weekDays = ref('');
const minDate = ref(null);
const maxDate = ref(null);
const selectedDate = ref(null);
const selectedTime = ref('');
const timeSlots = ref([]);
const excludedTimes = ref([]);
const currentSection = ref(1);
const message = ref('');

let startTime;
let endTime;
let duration;

const load = async () => {
    const response = await fetch(`${BASE_URL}/booking/list?houseId=${props.houseId}`);
    const data = await response.json();
    console.log(data);

    minDate.value = new Date(data.fromDate + 'T00:00:00');
    maxDate.value = new Date(data.toDate + 'T00:00:00');

    weekDays.value = data.weekDay;

    excludedTimes.value = data.excludedTime;

    startTime = data.fromTime;
    endTime = data.toTime;
    duration = data.duration;

}

// 當選擇日期時
const onDateChange = (date) => {
    if (date) {
        // const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        // selectedDate.value = utcDate.toISOString().split('T')[0];
        selectedDate.value = date;
        selectedTime.value = '';
        generateTimeSlots(startTime, endTime, duration);

        // nextTick(()=>{
        //     const contentTime  = document.querySelector('#content-time');
        //     console.log(contentTime );
        //     if (contentTime ) {
        //         contentTime .scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        //     }
        // })
        nextTick(() => {
            const contentTime = document.querySelector('#content-time');
            const header = document.querySelector('.header'); // 獲取 header
            if (contentTime && header) {
                const headerHeight = header.offsetHeight; // 獲取 header 的高度
                const contentTimePosition = contentTime.getBoundingClientRect().top + window.scrollY; // 獲取 content-time 的位置
                window.scrollTo({
                    top: contentTimePosition - headerHeight, // 減去 header 高度
                    behavior: 'smooth' // 平滑滾動
                });
            }
        });

    } else {
        selectedDate.value = null;
        selectedTime.value = '';
    }
};

// 產生時間段
const  generateTimeSlots = (startTime, endTime, duration) => {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const times = [];

    while (start <= end) {
        const timeString = start.toTimeString().substring(0, 5);
        const fullDateTimeString = `${selectedDate.value} ${timeString}:00`;
        // 排除已被預約的時間
        if (!excludedTimes.value.includes(fullDateTimeString)) {
            times.push(timeString);
        }
        start.setMinutes(start.getMinutes() + duration);
    }
    timeSlots.value = times;

};


const disabledWeekDays = computed(() => {
    const disabledDays = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const day = date.getDay();
        const convertedDay = (day === 0) ? 6 : (day - 1);

        const isDateAllowed = weekDays.value.charAt(convertedDay) === '0';

        if (isDateAllowed) {
            disabledDays.push(i);
        }
    }
    return disabledDays;
});

// section換頁
const goNextSection = () => {
    if (selectedDate.value && selectedTime.value) {
        currentSection.value += 1;
    }
}

// 設置所選時間
const selectTime = (time) => {
    selectedTime.value = time; 

    nextTick(()=>{
        const footer = document.querySelector('.booking-slot');
        if (footer) {
            footer.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    })
    
};


// 可選日期增加顏色記號
const markers = computed(() => {
    const markerArray = [];
    let currentDate = new Date(minDate.value);

    while (currentDate <= maxDate.value) {
        const day = currentDate.getDay();

        // 檢查當前日期是否在禁用的星期幾中
        if (!disabledWeekDays.value.includes(day)) {
            markerArray.push({
                date: new Date(currentDate),
                type: 'line',
                color: '#007bff',
            });
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return markerArray;
});


onMounted(() => {
    load();
});
</script>

<template>

    <div class="booking-slot container" style="width: 100%;">
        <!-- section 1 -->
        <section v-if="currentSection === 1">
            <header class="header">
                <h2>選擇您想要看房的時間</h2>
            </header>
            
            <div class="content mb-3">
                <hr class="w-100" />
                <div class="mb-2">
                    
                    <Datepicker id="select-date" locale="zh" model-type="yyyy-MM-dd" v-model="selectedDate"
                        :min-date="minDate" :max-date="maxDate" :disabled-week-days="disabledWeekDays" inline auto-apply
                        :enable-time-picker="false" @update:modelValue="onDateChange" :markers="markers" />
                </div>
                <div class="mb-2" id="content-time">
                    <div v-if="!selectedDate" class="form-control" >💡　先選擇日期</div>
                    <div v-if="selectedDate">
                        
                        <!-- <select id="time-select" class="form-select" v-model="selectedTime">
                            <option value="" disabled>💡　選擇時間點　</option>
                            <option v-for="time in timeSlots" :key="time" :value="time">
                                <span class="d-block">{{ time }}</span>
                            </option>
                        </select>
                        <hr> -->
                        
                        <div class="time-slot-container form-control">
                            <button v-for="time in timeSlots" :key="time" class="time-slot-btn" 
                            :class="{ 'selected': selectedTime === time }" @click="selectTime(time)">
                                {{ time }}
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
            
            <footer class="row">
                <hr class="w-100" />
                <div class="col"></div>
                <button :disabled="!selectedDate || !selectedTime" class="btn btn-primary col"
                    @click="goNextSection" id="nextButton">下一步</button>
            </footer>

        </section>
        <!-- section 2 -->
        <section v-if="currentSection === 2">
            <header>
                <h2>確認您的看房時間</h2>
            </header>
            <hr class="w-100" />

            <div>
                <table class="table">
                    <thead>
                        <tr>
                            <th class="col-2">日期</th>
                            <th class="col-2">時間</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ selectedDate }}</td>
                            <td>{{ selectedTime }}</td>
                        </tr>
                    </tbody>

                </table>

            </div>
            <div class="mb-3">
                <label for="message" class="form-label">可填寫留言</label>
                <textarea id="message" class="form-control" v-model="message" rows="4" style="resize: none;"
                    placeholder="請輸入對房東的留言..."></textarea>
            </div>

            <BookingAgreement v-model:isAgreed="isAgreed" />

            <!-- 發送預約按鈕 -->
            <div class="d-flex justify-content-end">
                <button class="btn btn-info w-100" type="button" @click="someAction" :disabled="!isAgreed">發送預約</button>
            </div>

            <hr class="w-100" />
            <footer class="row">
                <button class="btn btn-primary col" @click="currentSection--">上一步</button>
                <div class=" col"></div>
                
            </footer>
        </section>
    </div>

</template>

<style lang="css" scoped>
.dp__flex_display {
    display: block;
}
.form-select {
    text-align: center; 
}
.form-control{
    text-align: center; 
}
.header {
    background-color: #f8f9fa; /* Header 背景色 */
    padding: 15px; /* Header 內邊距 */
    position: sticky; /* 使 header 固定 */
    top: 0; /* 距離頂部 */
    z-index: 1;
    
}

section{
    margin: 20px;
}

.footer {
    background-color: #f8f9fa; /* Footer 背景色 */
    padding: 10px; /* Footer 內邊距 */
}

.content {

    overflow-y:hidden; /* 垂直滾動 */
    flex-grow: 1; /* 填滿剩餘空間 */
}


.time-slot-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); /* 自動填充，最小寬度100px */
    gap: 10px; /* 按鈕之間的間距 */
}

.time-slot-btn {
    padding: 10px;
    border: 1px solid #007bff; /* 按鈕邊框 */
    background-color: #f8f9fa; /* 按鈕背景色 */
    cursor: pointer; /* 鼠標指針變化 */
    text-align: center; /* 文本居中 */
    border-radius: 5px; /* 圓角 */
}

.time-slot-btn:hover {
    background-color: #e2e6ea; /* 懸停效果 */
}

.time-slot-btn.selected {
    background-color: #007bff; /* 選擇後的背景顏色 */
    color: white; /* 選擇後的文字顏色 */
}
</style>