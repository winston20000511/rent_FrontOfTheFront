<template>
  <div>
    <header>
      <Navbar></Navbar>
    </header>

    <main>
<CollectHouseList></CollectHouseList>
    </main>

    <footer>
      <!-- 可以在这里添加页脚内容 -->
    </footer>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import Navbar from './components/navbar.vue';
import CollectHouseList from './components/houses/CollectHouseList.vue';
import HouseCreate from './components/houses/HouseCreate.vue';
</script>

<style scoped>
/* 在这里添加您的样式 */
</style>
