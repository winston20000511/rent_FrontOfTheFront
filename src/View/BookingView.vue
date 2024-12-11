<script setup>
import 'bootstrap/dist/css/bootstrap.min.css';
import BookingSlot from '@/components/BookingSlot.vue';
import { ref } from 'vue';


const BASE_URL = import.meta.env.VITE_APIURL


</script>

<template>
    <div class="container">
      <h2>預約頁面</h2>
      <BookingSlot/>
    </div>
</template>

<style lang="css" scoped>
  .modal .fade{
    background-color: aquamarine;
  }

  h2{
    color: red;
  }
</style>