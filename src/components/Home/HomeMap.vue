<script setup>
import { ref, onMounted } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

const map = ref(null); // 地圖容器

onMounted(() => {
  // Google Maps API 加載器
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, 
    version: 'weekly',
  });

  loader.load().then(() => {
    // 初始化地圖
    map.value = new google.maps.Map(document.querySelector('.map-container'), {
      center: { lat: 23.023535, lng: 120.222776 }, // 設置地圖中心
      zoom: 13, // 設置縮放級別
    });
  });
});
</script>
<template>
  <div>
    <div ref="map" class="map-container"></div>
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 76vh;
}
</style>