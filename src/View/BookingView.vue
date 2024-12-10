<script setup>
import { ref } from 'vue';
const BASE_URL = import.meta.env.VITE_APIURL

const bookingSlot = ref({});

const fetchBookingSlot = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/booking/list?houseId=1`);
    if (response.ok) {
      const responseText = await response.text();  // 使用 text() 查看返回的原始內容
      console.log(responseText);
      const datas = JSON.parse(responseText);  // 手動解析為 JSON
      bookingSlot.value = datas;
      console.log(bookingSlot.value);  // 打印更新後的值
    } else {
      console.error('API request failed with status:', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


fetchBookingSlot();

</script>

<template>
    <div>
        {{bookingSlot.houseId}}
    </div>
</template>

<style lang="css" scoped></style>