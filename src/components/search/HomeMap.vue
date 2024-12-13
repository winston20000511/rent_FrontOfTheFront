<script setup>
import { ref, onMounted } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

const map = ref(null); // 地圖容器
const canvas = ref(null);
const refbtnDraw = ref(null)
const isDrawingMode = ref(false);
let isDrawing = false;
let context = null;
let points = []; // 存储 Canvas 路径点

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

    map.value.addListener('idle',()=>{
      refbtnDraw.value.style.display='block';
      // google.maps.event.removeListener(idleListener);
    })
    console.log(map);
    // 初始化 Canvas
    const canvasElement = canvas.value;
    context = canvasElement.getContext('2d');

    // 设置 Canvas 的大小和透明背景
    canvasElement.width = map.value.getDiv().offsetWidth;
    canvasElement.height = map.value.getDiv().offsetHeight;

    // 添加绘图事件
    canvasElement.addEventListener('mousedown', startDrawing);
    canvasElement.addEventListener('mousemove', draw);
    canvasElement.addEventListener('mouseup', stopDrawing);
    canvasElement.addEventListener('mouseout', stopDrawing);
  });
});

  // 开始绘图
  function startDrawing(event) {
    isDrawing = true;
    points = [];
    addPoint(event);
    const { offsetX, offsetY } = event;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
  }

  // 绘制中
  function draw(event) {
    if (!isDrawing) return;

    const { offsetX, offsetY } = event;
    addPoint(event);
    context.lineTo(offsetX, offsetY);
    context.strokeStyle = 'rgba(0, 0, 255, 0.5)';
    context.lineWidth = 2;
    context.stroke();
  }

  // 停止绘图
  function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
    context.closePath();
    convertToPolygon();
  }

  //清除畫筆
  function clearCanvas(canvasElement) {
    const context = canvasElement.getContext('2d');
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
  } 

  //Draw模式切換
  function toggleDrawingMode(){
    console.log(map);
    isDrawingMode.value = !isDrawingMode.value;
    const canvasElement = canvas.value;
    if (isDrawingMode.value) {
      // 啟動繪圖模式
      canvasElement.style.pointerEvents = 'auto';
      map.value.setOptions({
        draggable: false,
        gestureHandling: 'none',
      });
      console.log(map);
    } else {
      // 關閉繪圖模式
      canvasElement.style.pointerEvents = 'none';
      map.value.setOptions({
        draggable: true,
        gestureHandling: 'auto',
      });
    }

  }

  function addPoint(event) {
    points.push({ x: event.offsetX, y: event.offsetY });
  }

  function pixelToLatLng(mapInstance, x, y) {
    return new Promise((resolve, reject) => {
      const overlay = new google.maps.OverlayView();
      overlay.onAdd = function () {};
      overlay.draw = function () {
        const projection = overlay.getProjection();
        if (projection) {
          const point = new google.maps.Point(x, y);
          
          // console.log(point);
          // console.log('LatLng:', projection.fromContainerPixelToLatLng(point));
          const latLng = projection.fromContainerPixelToLatLng(point);
          const latitude = latLng.lat();
          const lngitude = latLng.lng();
          // console.log('Converted LatLng:', {lat: latitude , lng: lngitude})

          resolve({lat: latitude , lng:lngitude});
          overlay.setMap(null); // 释放 OverlayView
        } else {
          reject(new Error('Projection is not available'));
        }
      };
      overlay.onRemove = function () {};
      overlay.setMap(mapInstance); // 确保传入的 map 实例
    });
  }

  async function convertPointsToLatLng(map, points) {
    const latLngArray = await Promise.all(
      points.map((point) => pixelToLatLng(map, point.x, point.y))
    );
    return latLngArray;
  }

  function drawPolygonOnMap(map, latLngPoints) {
    new google.maps.Polygon({
      paths: latLngPoints,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map,
    });
  }

  //將繪製的圖案轉成多邊形
  async function convertToPolygon() {
    if (!points.length) return;
    const latLngPoints = await convertPointsToLatLng(map.value, points);
    console.log(latLngPoints);
    drawPolygonOnMap(map.value, latLngPoints);
    const canvasElement = canvas.value;
    clearCanvas(canvasElement);
  }
</script>
<template>
  <div>
    <!-- <button @click="toggleDrawingMode">
      {{ isDrawingMode ? '退出绘图模式' : '启用绘图模式' }}
    </button> -->
    <button class="btn btn-outline-secondary btnDraw" ref="refbtnDraw" @click="toggleDrawingMode">
      {{ isDrawingMode ? '關閉繪圖模式' : '啟動繪圖模式' }}
    </button>
    <div ref="map" class="map-container"></div>
    <canvas ref="canvas" class="drawing-canvas"></canvas>
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 76vh;
  position: relative;
}
.drawing-canvas {
  width: 100%;
  height: 76vh;
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
  pointer-events: auto; /* 确保鼠标事件只针对 Canvas */
}
.btnDraw{
  display: block;
  position: absolute;
  top: 10px;
  left: 60%;
  z-index: 2;
}
</style>