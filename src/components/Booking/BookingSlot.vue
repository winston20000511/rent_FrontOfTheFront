<script setup>
import { ref, onMounted, computed , defineProps} from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import BookingAgreement from './bookingAgreement.vue';


const BASE_URL = import.meta.env.VITE_APIURL

const someAction = async () => {
    console.log('提交預約');
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
        const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        selectedDate.value = utcDate.toISOString().split('T')[0];
        selectedTime.value = '';
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
            <header>
            <h2>選擇您想要看房的時間</h2>
            </header>
            <hr class="w-100"/>
            <Datepicker id="select-date" 
                locale="zh" 
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="selectedDate" 
                :min-date="minDate" 
                :max-date="maxDate"
                :disabled-week-days="disabledWeekDays" 
                inline 
                auto-apply
                :enable-time-picker="false" 
                @update:modelValue="onDateChange" />

            <div v-if="!selectedDate">💡先選擇日期</div>
            <div v-if="selectedDate">💡
                <select v-model="selectedTime">
                    <option value="" disabled>請選擇時間</option>
                    <option v-for="time in timeSlots" :key="time" :value="time">
                        {{ time }}
                    </option>
                </select>
            </div>
            <hr class="w-100"/>
            <footer>
                <button :disabled="!selectedDate || !selectedTime"  
                class="btn btn-primary" 
                @click="goNextSection">下一步</button>
            </footer>
        </section>
        <!-- section 2 -->
        <section v-if="currentSection === 2">
            <header>
                <h2>確認您的看房時間</h2>
            </header>
            <hr class="w-100"/>

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
                <textarea id="message" class="form-control" v-model="message" rows="4" style="resize: none;" placeholder="請輸入對房東的留言..."></textarea>
            </div>

            <BookingAgreement v-model:isAgreed="isAgreed" />

            <!-- 發送預約按鈕 -->
            <div class="d-flex justify-content-end">
                <button class="btn btn-info" type="button" @click="someAction" :disabled="!isAgreed">發送預約</button>
            </div>

            <hr class="w-100"/>
            <footer>
                <button class="btn btn-primary" @click="currentSection--">上一步</button>
            </footer>
        </section>
    </div>

</template>

<style lang="css" scoped>


</style>