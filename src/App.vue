<script setup>
import { RouterLink, RouterView } from 'vue-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import HouseCreate from './components/houses/HouseCreate.vue';



</script>

<template>
  <HouseCreate/>
  <RouterView></RouterView>
</template>

<style scoped>
/* 這裡可以添加你自定義的樣式 */

</style>
