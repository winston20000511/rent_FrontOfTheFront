<script setup>
import { ref, watch, onMounted } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'


const props = defineProps(['modelValue']); // 來自父組件的數據
const emit = defineEmits(['update:modelValue']); // 用於向父組件同步數據

const bookingForm = ref({});
const dateOption = ref('month');
const timeOption = ref('default');
const daysOfWeek = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
const durationOptions = [30, 60];

const datePickerProps = {
    locale: "zh",
    autoApply: true,
    clearable: false
};


// 設定 預約日曆 (初始預設)
const form = ref({
    minDate: new Date().toISOString().split('T')[0],
    maxDate: new Date().toISOString().split('T')[0],
    minTime: { hours: 8, minutes: 0 },
    maxTime: { hours: 17, minutes: 0 },
    week: Array(7).fill(true),
    duration: '30'
});

// 初始化
onMounted(() => {
    // 
    dateOption.value = 'three-months';
    const current = new Date(form.value.minDate);
    current.setMonth(current.getMonth() + 3);
    form.value.maxDate = current.toISOString().split('T')[0];

    updateBookingForm();
});

const formatTime = (time) => `${time.hours.toString().padStart(2, '0')}:00:00`;
const updateBookingForm = () => {
    bookingForm.value = {
        fromDate: form.value.minDate,
        toDate: form.value.maxDate,
        fromTime: formatTime(form.value.minTime),
        toTime: formatTime(form.value.maxTime),
        duration: form.value.duration,
        weekDay: form.value.week.map(day => (day ? '1' : '0')).join(''),
    };
    emit('update:modelValue', bookingForm.value);
};

const onDateOption = (newDate) => {
    dateOption.value = '';
}

const onTimeOption = (newDate) => {
    timeOption.value = '';
}

const onDateChangeAndOption = (newDate) => {
    if (newDate > form.value.maxDate) {
        form.value.maxDate = newDate;
    }
    dateOption.value = '';

}
const onTimeChangeAndOption = (newTime) => {
    if (newTime.hours >= form.value.maxTime.hours) {
        form.value.maxTime.hours = newTime.hours + 1;
    }
    timeOption.value = '';
}

watch(form, updateBookingForm, { deep: true });

watch(dateOption, (newValue) => {
    const current = new Date(form.value.minDate);
    if (newValue === 'month') current.setMonth(current.getMonth() + 1);
    if (newValue === 'three-months') current.setMonth(current.getMonth() + 3);
    if (newValue === 'six-months') current.setMonth(current.getMonth() + 6);
    if (newValue === 'year') current.setFullYear(current.getFullYear() + 1);
    form.value.maxDate = current.toISOString().split('T')[0];
});

watch(timeOption, (newValue) => {
    if (newValue === 'default') {
        form.value.minTime = { hours: 8, minutes: 0 };
        form.value.maxTime = { hours: 17, minutes: 0 };
    } else if (newValue === 'all') {
        form.value.minTime = { hours: 0, minutes: 0 };
        form.value.maxTime = { hours: 23, minutes: 59 };
    }
})


</script>

<template>
    <div class="accordion" id="accordionExample">

        <div class="accordion-item">

            <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse"
                    data-bs-target="#BookingSetting" aria-expanded="true" aria-controls="BookingSetting">
                    目前使用預設
                </button>
            </h2>

            <div class="collapse " id="BookingSetting" data-bs-parent="#accordionExample">
                <!-- 設定預約時段 -->
                <div class="booking-child">
                    <div class="align-items-center">
                        <h5 class="flex-shrink-0 p-2">日期</h5>
                        <div class="flex-grow-1 shadow-sm">
                            <div class="row align-items-center" style="margin: 0;">

                                <div class="col">
                                    <VueDatePicker class="p-1 col" v-model="form.minDate" locale="zh"
                                    model-type="yyyy-MM-dd" :min-date='new Date()' :enable-time-picker="false"
                                    v-bind="datePickerProps" @update:model-value="onDateChangeAndOption" />
                                </div>

                                    -

                                <div class="col">
                                    <VueDatePicker class="p-1 col" v-model="form.maxDate" locale="zh"
                                    model-type="yyyy-MM-dd" :min-date='form.minDate' :enable-time-picker="false"
                                    v-bind="datePickerProps" @update:model-value="onDateOption" />

                                    
                                </div>

                            </div>
                           
                            <div class="d-flex align-items-center">
                                <div class="p-1">
                                    <span>　</span>
                                    <label class="btn p-1" for="date-dateOption-month">
                                        <input type="radio" id="date-dateOption-month" value="month"
                                            v-model="dateOption" />
                                        一個月
                                    </label>
                                    <label class="btn p-1" for="date-dateOption-three-months">
                                        <input type="radio" id="date-dateOption-three-months" value="three-months"
                                            v-model="dateOption" />
                                        三個月
                                    </label>
                                    <label class="btn p-1" for="date-dateOption-six-months">
                                        <input type="radio" id="date-dateOption-six-months" value="six-months"
                                            v-model="dateOption" />
                                        半年
                                    </label>
                                    <label class="btn p-1" for="date-dateOption-year">
                                        <input type="radio" id="date-dateOption-year" value="year"
                                            v-model="dateOption" />
                                        一年
                                    </label>
                                </div>
                            </div>

                        </div>
                    </div>


                </div>

                <!-- 設定可看房時段 -->
                <div class="booking-child">
                    <div class="align-items-center">
                        <h5 class="flex-shrink-0 p-2">時段</h5>
                        <div class="flex-grow-1 shadow-sm ">
                            <div class="row mb-2 align-items-center " style="margin: 0;">
                                <VueDatePicker class="p-1 col" locale="zh" v-model="form.minTime"
                                    :enable-minutes="false" time-picker :max-time="{ hours: 22, minutes: 59 }"
                                    v-bind="datePickerProps" @update:model-value="onTimeChangeAndOption" />
                                -
                                <VueDatePicker class="p-1 col" locale="zh" v-model="form.maxTime"
                                    :enable-minutes="false" time-picker
                                    :min-time="{ hours: form.minTime?.hours ? form.minTime.hours + 1 : 8 }"
                                    :max-time="{ hours: 24 }" v-bind="datePickerProps"
                                    @update:model-value="onTimeOption" />
                            </div>
                            <div class="d-flex align-items-center">
                                <div class=" row mb-2" style="margin: 0;">
                                    <div class="p-1">
                                        <label class="btn p-1" for="date-timeOption-default">
                                            <input type="radio" id="date-timeOption-default" value="default"
                                                v-model="timeOption" />
                                            預設時段
                                        </label>
                                        <label class="btn p-1" for="date-timeOption-all">
                                            <input type="radio" id="date-timeOption-all" value="all"
                                                v-model="timeOption" />
                                            全天
                                        </label>
                                        <!-- {{ form.minTime.hours }} - {{ form.maxTime.hours }} -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- 設定可看房的星期 -->
                <div class="booking-child">
                    <div class="align-items-center">
                        <h5 class="flex-shrink-0 p-2">星期</h5>
                        <div class="flex-grow-1  mb-2 shadow-sm ">
                            <fieldset class="btn-group p-2" role="group">
                                <label v-for="(day, index) in daysOfWeek" :key="index" class="p-1">
                                    <input type="checkbox" v-model="form.week[index]" />
                                    {{ day }}
                                </label>
                            </fieldset>
                        </div>
                    </div>
                </div>

                <!-- 設定看房時間 -->
                <div class="booking-child">
                    <div class="align-items-center">
                        <h5 class="flex-shrink-0 p-2">間隔:</h5>
                        <div class="flex-grow-1  mb-2 shadow-sm">
                            <select v-model="form.duration" class="form-select">
                                <option value="" disabled>選擇預約間隔</option>
                                <option v-for="duration in durationOptions" :key="duration" :value="duration">{{
                                    duration }}分鐘
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>


        </div>

    </div>






</template>

<style lang="css" scoped></style>