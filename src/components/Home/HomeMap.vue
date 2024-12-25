<script setup>
import { ref, onMounted, onUnmounted, watch, toRef, shallowRef } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
import { useHouseCard } from '@/stores/CardHouseStore';

const map = shallowRef(null); // 地圖容器
const mapMarkers = ref([]); //地圖標記
const canvas = shallowRef(null); //繪筆
const refbtnDraw = ref(null) //繪圖按鈕
const refbtnConfig = ref(null) //地圖設定
const isDrawingMode = ref(false); //按鈕切換繪圖模式

let drawUrl='http://localhost:8080/api/draw';
let isDrawing = false; //判斷是否正在繪圖
let context = null;
let points = []; //儲存 Canvas 路徑點
let polygon = null;


let token = localStorage.getItem('jwt');

const store = useHouseCard()
const emits = defineEmits(['update-marker' , 'update-flipped'])
const props = defineProps({
  markers: Object
})
const markers = toRef(props, 'markers');

//進行Google Map初始化
onMounted(() => {
    // Google Maps API 加載器
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, 
      version: 'weekly', // 使用 beta 或更新版本
      libraries: ['marker'], // 加載 'marker' 庫
    });

    loader.load().then((google) => {
      // 初始化地圖
      map.value = new google.maps.Map(document.querySelector('.map-container'), {
        center: { lat: 23.023535, lng: 120.222776 }, // 設置地圖中心
        zoom: 13, // 設置縮放級別
        mapId: "DEMO_MAP_ID",
        clickableIcons: false,
        streetViewControl: false,
        mapTypeControl: false,
      });
      //地圖按鈕在初始化完才顯示
      refbtnDraw.value.style.display = 'block'
      refbtnConfig.value.style.display = 'block'
      // 初始化 Canvas  
      const canvasElement = canvas.value;
      context = canvasElement.getContext('2d');

      //設置 Canvas 的大小和透明背景
      canvasElement.width = map.value.getDiv().offsetWidth;
      canvasElement.height = map.value.getDiv().offsetHeight;

      // 添加繪圖事件
      canvasElement.addEventListener('mousedown', startDrawing);
      canvasElement.addEventListener('mousemove', draw);
      canvasElement.addEventListener('mouseup', stopDrawing);
      canvasElement.addEventListener('mouseout', stopDrawing);


    });
  });
  onUnmounted(()=>{
      // canvasElement.removeEventListener('mousedown', startDrawing);
      // canvasElement.removeEventListener('mousemove', draw);
      // canvasElement.removeEventListener('mouseup', stopDrawing);
      // canvasElement.removeEventListener('mouseout', stopDrawing);
  })

  // =========================================標記功能=================================================================


  watch(markers, (newMarkers) => {
    
    const list = newMarkers.searchList;
    const origin = newMarkers.searchOrigin;
    const avgPrice = newMarkers.avgPrice;
    
    mapMarkers.value.forEach((marker) => marker.map = null);
    mapMarkers.value = [];

    list.forEach((marker) => {


      const buttonElement = document.createElement("button");
      buttonElement.className="btn-purple"
      buttonElement.innerHTML=`${(Number(marker.price)/1000).toFixed(1)}K`
      buttonElement.style.pointerEvents = "auto";

      var latlng = new google.maps.LatLng(marker.lat, marker.lng);
      var mapMark = new google.maps.marker.AdvancedMarkerElement({
        position: latlng,
        map: map.value,
        title: marker.street,
        content: buttonElement,
      });
      mapMarkers.value.push(mapMark);
    });

    const buttonOrigin = document.createElement("button");
    buttonOrigin.className="btn-yellow"
    buttonOrigin.innerHTML=`${(Number(origin.price)/1000).toFixed(1)}K`
    buttonOrigin.style.pointerEvents = "auto";
    var latlng = new google.maps.LatLng(origin.lat, origin.lng);
    var mapMark = new google.maps.marker.AdvancedMarkerElement({
        position: latlng,
        map: map.value,
        title: origin.street,
        content: buttonOrigin,
      });

      map.value.panTo(latlng);
      // map.value.setZoom(14);
      mapMarkers.value.push(mapMark);
  });

  // =========================================繪圖功能=================================================================
  // 開始繪圖
  function startDrawing(event) {
    isDrawing = true;
    points = [];
    if (polygon) {
        polygon.setMap(null); // 移除多邊形
        polygon = null;       // 清空變數
    }

    addPoint(event);
    const { offsetX, offsetY } = event;
    context.beginPath();
    context.moveTo(offsetX, offsetY);


  }

  // 繪製中
  function draw(event) {
    if (!isDrawing) return;

    const { offsetX, offsetY } = event;
    addPoint(event);
    context.lineTo(offsetX, offsetY);
    context.strokeStyle = 'rgba(0, 0, 255, 0.5)';
    context.lineWidth = 2;
    context.stroke();
  }

  // 停止繪圖
  function stopDrawing() {
    if (!isDrawing) return;
    
    isDrawing = false;
    context.closePath();
    convertToPolygon();

    isDrawingMode.value = !isDrawingMode.value;
    const canvasElement = canvas.value;
    canvasElement.style.pointerEvents = 'none';
    map.value.setOptions({
      draggable: true,
      gestureHandling: 'auto',
    });


  }

  //清除畫筆
  function clearCanvas(canvasElement) {
    const context = canvasElement.getContext('2d');
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
  } 

  //地圖設定頁面
  function showConfig(){
    // refbtnDraw.value.style.display='none';
    // refbtnConfig.value.style.display='none';
    emits('update-flipped')
  }

  //Draw模式切換
  function toggleDrawingMode(event){
    event.stopPropagation();
    isDrawingMode.value = !isDrawingMode.value;
    const canvasElement = canvas.value;
    if (isDrawingMode.value) {
      // 啟動繪圖模式
      canvasElement.style.pointerEvents = 'auto';
      map.value.setOptions({
        draggable: false,
        gestureHandling: 'none',
      });
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

  //XY轉成LatLng
  function pixelToLatLng(mapInstance, x, y) {
    return new Promise((resolve, reject) => {
      const overlay = new google.maps.OverlayView();
      overlay.onAdd = function () {
        const div = document.createElement('div');
        div.className = 'custom-overlay';
        this.getPanes().overlayLayer.appendChild(div); // 使用 overlayLayer 層
        this.div = div;
      };
      overlay.draw = function () {
        const projection = overlay.getProjection();
        if (projection) {
          const point = new google.maps.Point(x, y);
          
          // console.log(point);
          // console.log('LatLng:', projection.fromContainerPixelToLatLng(point));
          const latLng = projection.fromContainerPixelToLatLng(point);
          const latitude = latLng.lat();
          const lngitude = latLng.lng();

          resolve({lat: latitude , lng:lngitude});
          overlay.setMap(null); // 释放 OverlayView
        } else {
          reject(new Error('Projection is not available'));
        }
      };
      overlay.onRemove = function () {
        if (this.div) {
          this.div.parentNode.removeChild(this.div);
          this.div = null; // 釋放引用
        }
      };
      overlay.setMap(mapInstance); // 确保传入的 map 实例
    });
  }

  //XY陣列轉成LatLng陣列
  async function convertPointsToLatLng(map, points) {
    const latLngArray = await Promise.all(
      points.map((point) => pixelToLatLng(map, point.x, point.y))
    );
    return latLngArray;
  }

  //
  function drawPolygonOnMap(map, latLngPoints) {
    polygon= new google.maps.Polygon({
      paths: latLngPoints,
      strokeColor: '#0000FF',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#0000FF',
      fillOpacity: 0.05,
      map,
    });
  }

  //將繪製的圖案轉成多邊形
  async function convertToPolygon() {
    if (!points.length) return;
    forceRedrawMap(map.value)
    const latLngPoints = await convertPointsToLatLng(map.value, points);
    // console.log(latLngPoints);
    drawPolygonOnMap(map.value, latLngPoints);
    drawLatLngFetch(latLngPoints)
    const canvasElement = canvas.value;
    clearCanvas(canvasElement);
  }

  async function drawLatLngFetch(latLngPoints){
    const response = await fetch(drawUrl,{
      method:"POST",
      headers: {'Content-Type': 'application/json',
                    'authorization': `${token}`
            },
      body:JSON.stringify(latLngPoints)
    })

    if (!response.ok){
      throw new Error('Network response was not ok')
    }

    const data = await response.json();
    emits('update-marker',data)

  }

  function forceRedrawMap(mapInstance) {
    const center = mapInstance.getCenter();
    let count = 0;
    const interval = setInterval(() => {
      mapInstance.panBy(1, 1)
      mapInstance.panBy(-1, -1);; // 每次平移 100 像素
      count++;
      if (count >= 10) clearInterval(interval); // 平移 10 次後停止
    }, 20); // 每 200 毫秒平移一次
    mapInstance.setCenter(center); // 回到原中心
  }

</script>

<template>
  <div>
    <button class="btn btn-primary btnDraw" ref="refbtnDraw" @click="toggleDrawingMode">
      <i class="bi bi-pencil-fill"></i>
    </button>
    <button class="btn btn-primary btnConfig" ref="refbtnConfig" @click="showConfig">
      <i class="bi bi-exclamation-circle"></i>
    </button>
    <div ref="map" class="map-container" v-once></div>
    <canvas ref="canvas" class="drawing-canvas"></canvas>
  </div>
</template>

<style>
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
  pointer-events: none; /* 确保鼠标事件只针对 Canvas */
}
.custom-overlay {
  pointer-events: none; /* 確保事件穿透 */
  position: absolute;   /* 避免其他元素干擾 */
  z-index: 0;           /* 明確指定低層級 */
  opacity: 1;
}
.btnDraw{
  display: none;
  position: fixed; /* 改為 fixed */
  top: 60px; /* 距離視窗頂部 60px */
  left: calc(100% - 50px); /* 從右側固定 */
  z-index: 2;
}
.btnConfig{
  display: none;
  position: fixed; /* 改為 fixed */
  top: 110px; /* 距離視窗頂部 60px */
  left: calc(100% - 50px); /* 從右側固定 */
  z-index: 2;
}
.btn-purple {
    background-color: #9333EA; /* purple-500 */
    color: white;
    border-radius: 0.5rem; /* 圓角效果 */
    padding: 3px; /* 增加按鈕內邊距 */
    border: none; /* 去掉邊框 */
    transition: background-color 0.3s ease;
    width: 40px;
}

.btn-purple:hover {
    background-color: #5A189A; /* purple-700 */
}
.btn-yellow {
    background-color: #c2cf09; /* purple-500 */
    color: white;
    border-radius: 0.5rem; /* 圓角效果 */
    padding: 5px; /* 增加按鈕內邊距 */
    border: none; /* 去掉邊框 */
    transition: background-color 0.3s ease;
    width: 50px;
}

.btn-yellow:hover {
    background-color: #afb922; /* purple-700 */
}
</style>