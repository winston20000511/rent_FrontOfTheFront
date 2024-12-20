<script setup>
import { RouterLink, RouterView } from 'vue-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import HouseCreate from './components/houses/HouseCreate.vue';
import CollectHouseList from './components/houses/CollectHouseList.vue';
import HouseList from './components/houses/houselist.vue';




</script>

<template>
  <CollectHouseList></CollectHouseList>
  <HouseList></HouseList>
  <HouseCreate></HouseCreate>
  <RouterView></RouterView>
</template>

<style scoped>
/* 這裡可以添加你自定義的樣式 */

</style>
