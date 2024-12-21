<script setup>
import { ref, watch, onMounted } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const bookingSlotForm = ref({
  fromDate: new Date().toISOString().split('T')[0],
  toDate: new Date().toISOString().split('T')[0],
  fromTime: '08:00',
  toTime: '20:00',
  weekDays: Array(7).fill(true), // 預設每週的天數為 false
  duration: ''
});

const dateOption = ref('');

const daysOfWeek = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
const durationOptions = [30, 60]; // 預約間隔時間選項


const updateBooking =  () => {
  const bookingRequest = {
    houseId: window.location.pathname.split('/').pop(),
    fromDate: bookingSlotForm.value.fromDate,
    toDate: bookingSlotForm.value.toDate,
    fromTime: `${bookingSlotForm.value.fromTime}:00`,
    toTime: `${bookingSlotForm.value.toTime}:00`,
    duration: bookingSlotForm.value.duration,
    weekDay: bookingSlotForm.value.weekDays.map(day => (day ? '1' : '0')).join('')
  };

};

const onDateChange = (newDate)=>{
    if(newDate > bookingSlotForm.value.toDate){
        bookingSlotForm.value.toDate = newDate;
    }
}
const onTimeChange = (newTime)=>{
    console.log(newTime);
    console.log(":::"+bookingSlotForm.value.toTime);
    if(newTime > bookingSlotForm.value.toTime){
        bookingSlotForm.value.toTime = newTime;
    }
    console.log(":::::::"+bookingSlotForm.value.toTime);

}




watch(dateOption,(newValue)=>{
    const today = new Date();
    bookingSlotForm.value.fromDate = today.toISOString().split('T')[0];
    if (newValue === 'month') {
    const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
    bookingSlotForm.value.toDate = nextMonth.toISOString().split('T')[0]; 
  } else if (newValue === 'three-months') {
    const nextThreeMonths = new Date(today.setMonth(today.getMonth() + 3));
    bookingSlotForm.value.toDate = nextThreeMonths.toISOString().split('T')[0];
  } else if (newValue === 'year') {
    const nextYear = new Date(today.setFullYear(today.getFullYear() + 1));
    bookingSlotForm.value.toDate = nextYear.toISOString().split('T')[0];
  } else if (newValue === 'six-months') {
    const nextSixMonths = new Date(today.setMonth(today.getMonth() + 6));
    bookingSlotForm.value.toDate = nextSixMonths.toISOString().split('T')[0];
  }
})


</script>

<template>

      <!-- 設定預約時段 -->
        <h3>設定看房日曆</h3>
        <div>
            <div class="row">
                <div class="col">
            <h5>日期</h5>
            <div class="shadow-sm">
                    <div class="row mb-2" style="margin: 0;">
                        <VueDatePicker class="p-1 col" v-model="bookingSlotForm.fromDate" 
                        locale="zh"
                        model-type="yyyy-MM-dd"
                        min-date= 'new Date()'
                        :enable-time-picker="false"     
                        auto-apply
                        @update:model-Value="onDateChange"
                        />
                        <VueDatePicker class="p-1 col" v-model="bookingSlotForm.toDate" 
                        locale="zh"
                        model-type="yyyy-MM-dd"
                        :min-date= 'bookingSlotForm.fromDate'
                        :enable-time-picker="false"     
                        auto-apply
                        />
                    
                    </div>
                    <div class=" row mb-2" style="margin: 0;">
                        <div class="p-1 col">
                                <span>快速選擇</span>
                            
                                <label class=" p-1" for="date-option-month">
                                    <input type="radio" id="date-option-month" value="month" v-model="dateOption"/>
                                    一個月
                                </label>

                                <label class="p-1" for="date-option-three-months">
                                    <input type="radio" id="date-option-three-months" value="three-months" v-model="dateOption"/>
                                    三個月
                                </label>
                                
                                <label class="p-1" for="date-option-six-months">
                                    <input type="radio" id="date-option-six-months" value="six-months" v-model="dateOption"/>
                                    半年
                                </label> 

                                <label class="p-1" for="date-option-year">
                                    <input type="radio" id="date-option-year" value="year" v-model="dateOption"/>
                                    一年
                                </label>
                            
                        </div>
                        
                    </div>
            </div>
        </div>
    <div class="col">
        <!-- 設定可看房時段 -->
            <h5>時段:</h5>
            <div class="row shadow-sm" style="margin: 0;">
                <VueDatePicker class="p-1 col" 
                    locale="zh"
                    v-model="bookingSlotForm.fromTime"
                    :enable-minutes="false"
                    time-picker
                    auto-apply
                    v-on:update:model-value="onTimeChange"
                    />
                    <VueDatePicker class="p-1 col" 
                    locale="zh"
                    v-model="bookingSlotForm.toTime"
                    :enable-minutes="false"
                    time-picker
                    auto-apply
                    />
            </div>
        </div>
        </div>

        <!-- 設定可看房的星期 -->
        <h5>星期</h5>
        <div class="d-flex mb-2 shadow-sm">
            <fieldset class="btn-group p-2" role="group">
            <label v-for="(day, index) in daysOfWeek" :key="index" class="p-1">
                <input type="checkbox" v-model="bookingSlotForm.weekDays[index]" />
                {{ day }}
            </label>
            </fieldset>
        </div>

        <!-- 設定看房時間 -->
        <h5>時間:</h5>
        <div class="shadow-sm">
            <select v-model="bookingSlotForm.duration" class="form-select">
            <option value="" disabled>選擇預約間隔</option>
            <option v-for="duration in durationOptions" :key="duration" :value="duration">{{ duration }}分鐘</option>
            </select>
        </div>
    </div>
</template>

<style lang="css" scoped>
    VueDatePicker{
        margin: 0 ;
    }
</style>