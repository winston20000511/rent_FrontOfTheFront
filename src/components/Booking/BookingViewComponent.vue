<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import BookingAgreement from './bookingAgreement.vue';

const BASE_URL = import.meta.env.VITE_APIURL

const props = defineProps({
    houseId: {
        type: Number,
        required: true
    }
});

const isAgreed = ref(false);
const weekDays = ref('');
const minDate = ref(null);
const maxDate = ref(null);
const selectedDate = ref(null);
const selectedTime = ref('');
const timeSlots = ref([]);
const excludedTimes = ref([]);
const currentSection = ref(1);
const message = ref('');
const responseStatus = ref(null);
const responseMsg = ref('');
const loading = ref(false);

let startTime;
let endTime;
let duration;

const load = async () => {
    const response = await fetch(`${BASE_URL}/booking/list?houseId=${props.houseId}`);
    const data = await response.json();
    console.log(data);

    const currentDate = new Date();
    const fromDate = new Date(data.fromDate + 'T00:00:00');
    minDate.value = fromDate < currentDate ? currentDate + 1 : fromDate + 1;    //如起始日較小，則使用當下日期
    maxDate.value = new Date(data.toDate + 'T00:00:00');

    weekDays.value = data.weekDay;

    excludedTimes.value = data.excludedTime;

    startTime = data.fromTime;
    endTime = data.toTime;
    duration = data.duration;

}

const sendBooking = async () => {
    const bookingData = {
        houseId: props.houseId,
        userId: 20,
        bookingDate: selectedDate.value,
        bookingTime: selectedTime.value,
        message: message.value
    }
    loading.value = true;

    try {
        const response = await fetch(`${BASE_URL}/booking/host`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();

        responseStatus.value = data.status;
        responseMsg.value = data.message;
        goNextSection();

    } catch (error) {
        console.error('Error:', error);
        console.error('BookingSlot.vue sendBooking fail');
    } finally {
        loading.value = false;
    }

};

// 當選擇日期時
const onDateChange = (date) => {
    if (date) {
        selectedDate.value = date;
        selectedTime.value = '';
        generateTimeSlots(startTime, endTime, duration);

        nextTick(() => {
            const contentTime = document.querySelector('#content-time');
            if (contentTime) {
                contentTime.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        })

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

// section換頁
const goNextSection = () => {
    if (selectedDate.value && selectedTime.value) {
        currentSection.value += 1;
    }
}

// 設置所選時間
const selectTime = (time) => {
    selectedTime.value = time + ':00';

    // move to footer
    nextTick(() => {
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
                    <div v-if="!selectedDate" class="form-control">💡　先選擇日期</div>
                    <div v-if="selectedDate">

                        <div class="time-slot-container form-control">
                            <button v-for="time in timeSlots" :key="time" class="time-slot-btn"
                                :class="{ 'selected': selectedTime === time + ':00' }" @click="selectTime(time)">
                                {{ time }}
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <footer class="row">
                <hr class="w-100" />
                <div class="col"></div>
                <button :disabled="!selectedDate || !selectedTime" class="btn btn-primary col" @click="goNextSection"
                    id="nextButton">下一步</button>
            </footer>

        </section>
        <!-- section 2 -->
        <section v-if="currentSection === 2">
            <header class="header">
                <h2>確認您的看房時間</h2>
            </header>
            <hr class="w-100" />
            <div class="content mb-3">
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
                    <label for="message" class="form-label ">可填寫留言</label>
                    <textarea id="message" class="form-control" v-model="message" rows="4" style="resize: none;"
                        placeholder="輸入對房東的留言..."></textarea>
                </div>

                <BookingAgreement v-model:isAgreed="isAgreed" />

                <!-- 發送預約按鈕 -->
                <div class="d-flex justify-content-end">
                    <button class="btn btn-info w-100" type="button" @click="sendBooking"
                        :disabled="!isAgreed || loading">
                        <span v-if="loading" class="spinner-grow spinner-border-sm" role="status"
                            aria-hidden="true"></span>
                        {{ loading ? '發送中...' : '發送預約' }}</button>
                </div>
            </div>
            <hr class="w-100" />
            <footer class="footer row">
                <button class="btn btn-primary col" @click="currentSection--">上一步</button>
                <div class=" col"></div>

            </footer>
        </section>

        <!-- section 3 -->
        <section v-if="currentSection === 3">
            <header class="header">
                <h2>發送狀態</h2>
            </header>
            <div class="content">
                <div v-if="responseStatus === 'success'" class="alert alert-success">
                    {{ responseMsg }}
                </div>
                <div v-if="responseStatus === 'danger'" class="alert alert-danger">
                    {{ responseMsg }}
                </div>
            </div>
            <footer v-if="responseStatus === 'success'">💡 等待房東回覆</footer>
            <footer v-if="responseStatus === 'danger'">💡 請重新選擇</footer>
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



section {
    margin: 10px;
}

.header {
    background-color: white;
    padding: 10px 10px;
    text-align: center;
    border-radius: 5px;
    position: sticky;
    top: 0;
    z-index: 1;

}

.content {
    overflow-y: hidden;
    flex-grow: 1;
    text-align: center;
    font-weight: bold;
}

.footer {
    background-color: white;
}

.time-slot-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    /* 自動填充，最小寬度100px */
    gap: 10px;
    /* 按鈕之間的間距 */
}

.time-slot-btn {
    padding: 10px;
    border: 1px solid #007bff;
    background-color: #f8f9fa;
    cursor: pointer;
    text-align: center;
    border-radius: 5px;
}

.time-slot-btn:hover {
    background-color: #e2e6ea;
}

.time-slot-btn.selected {
    background-color: #007bff;
    color: white;
}
</style>