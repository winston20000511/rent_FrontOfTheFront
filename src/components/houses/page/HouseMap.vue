<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  houseId: {
    type: Number,
    required: true,
  },
});

const mapRef = ref(null);
const houseLocation = ref({ latitude: 0, longitude: 0 });
const mapData = ref(null);

onMounted(async () => {
  try {
    // 從後端一次性獲取經緯度和地圖數據
    const response = await fetch(`http://localhost:8080/api/houses/${props.houseId}/map-data`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    });
    if (!response.ok) throw new Error("無法獲取地圖數據");
    const data = await response.json();

    // 提取經緯度和地圖數據
    houseLocation.value = data.location;
    mapData.value = data.mapData;

    // 初始化 Google Maps
    const map = new google.maps.Map(mapRef.value, {
      center: { lat: houseLocation.value.latitude, lng: houseLocation.value.longitude },
      zoom: 15,
    });

    // 添加標記
    new google.maps.Marker({
      position: { lat: houseLocation.value.latitude, lng: houseLocation.value.longitude },
      map: map,
    });

    // console.log("Google Maps API 返回數據:", mapData.value);
  } catch (error) {
    console.error("初始化地圖失敗:", error);
  }
});
</script>

<template>
  <div>
    <div ref="mapRef" style="width: 100%; height: 400px;"></div>
  </div>
</template>
