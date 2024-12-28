<script setup>
import { ref, onMounted, onUnmounted, watch, toRef, shallowRef, createApp } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
import HousePhotos from '../houses/housePhotos.vue';
import HouseView from '@/View/HouseView.vue';
import Dialog from "primevue/dialog";
import { useHouseCard } from '@/stores/CardHouseStore';

const map = shallowRef(null); // 地圖容器
const mapMarkers = ref([]); //地圖標記
const pbtns = ref([]); //儲存 按鈕
const ibtns = ref([]); //儲存 按鈕
const activeBtn = ref() //儲存目前按鈕
const canvas = shallowRef(null); //繪筆
const refbtnDraw = ref(null) //繪圖按鈕
const refbtnConfig = ref(null) //地圖設定
const isDrawingMode = ref(false); //按鈕切換繪圖模式

const showView = ref(false);
const selectedHouseId = ref(null);

let drawUrl='http://localhost:8080/api/draw';
let isDrawing = false; //判斷是否正在繪圖
let context = null;
let points = []; //儲存 Canvas 路徑點
let polygon = null;
let activeInfoWindow = null; // 用來存儲當前開啟的 InfoWindow


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
      libraries: ['marker','geometry'], // 加載 'marker' 庫
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

      const dateSpec = '1999-01-01T00:00:00';
      const sourceDate = new Date(marker.paidDate);
      const targetDate = new Date(dateSpec);

      const buttonElement = document.createElement("button");

      if (sourceDate > targetDate) {
        buttonElement.className ="btn-info"
        ibtns.value.push(buttonElement);
      } else {
        buttonElement.className="btn-purple"
        pbtns.value.push(buttonElement);
      }
      buttonElement.innerHTML=`${(Number(marker.price)/1000).toFixed(1)}K`
      buttonElement.style.pointerEvents = "auto";

      var latlng = new google.maps.LatLng(marker.lat, marker.lng);
      var mapMark = new google.maps.marker.AdvancedMarkerElement({
        position: latlng,
        map: map.value,
        title: marker.street,
        content: buttonElement,
      });

      
      
      const contentContainer = document.createElement('div');
      contentContainer.classList.add('card','custom-shadow','card-shadow');
      contentContainer.style.width='36em'
      
      contentContainer.addEventListener('click',()=>{
        openHouseView(Number(marker.houseid))
      })

      // 使用 Vue 渲染 InfoWindowContent 組件
      const app = createApp(HousePhotos, {
        houseId: marker.houseid,
      });
      app.mount(contentContainer);

      // 創建 InfoWindow 並嵌入渲染的 Vue 組件
      const infoWindow = new google.maps.InfoWindow({
        content: contentContainer,
      });

      const paragraph1 = document.createElement('p');
      paragraph1.textContent = `NT$ ${marker.price}`;
      paragraph1.style.fontSize='24px'
      paragraph1.style.fontWeight='bold'
      paragraph1.style.margin = '10px 0 0 20px'
      contentContainer.appendChild(paragraph1);

      const paragraph2 = document.createElement('p');
      paragraph2.textContent = marker.address;
      paragraph2.style.fontSize='18px'
      paragraph2.style.margin = '10px 0 10px 20px'
      contentContainer.appendChild(paragraph2);

      //<img src="${data.image}" alt="房屋圖片" style="max-width: 200px; margin-bottom: 10px;">
      // const infoWindow = new google.maps.InfoWindow({
      //     content: `
      //       <div style="text-align: center;">
              
      //         <p>${marker.houseTitle}</p>
      //       </div>
      //     `,
      //   });

        // 點擊標記顯示資訊窗口
        mapMark.addListener('click', () => {
          if (activeInfoWindow) {
            activeInfoWindow.close(); // 關閉當前開啟的 InfoWindow
            }
            infoWindow.open(map.value, mapMark);
            activeInfoWindow = infoWindow; // 記錄新打開的 InfoWindow
            // store.updateSeleted(marker);
            clearAllButtons(buttonElement)
            // activeBtn.value = buttonElement
            buttonElement.className ="btn-red"
        });
        
        map.value.addListener('click', () => {
          if (activeInfoWindow) {
            activeInfoWindow.close();
            activeInfoWindow = null; // 清除記錄
          }
        });

      mapMarkers.value.push(mapMark);
    });

    // const buttonOrigin = document.createElement("button");
    // buttonOrigin.className="btn-yellow"
    // buttonOrigin.innerHTML=`${(Number(avgPrice)/1000).toFixed(1)}K`
    // buttonOrigin.style.pointerEvents = "auto";
    var latlng = new google.maps.LatLng(origin.lat, origin.lng);
    // var mapMark = new google.maps.marker.AdvancedMarkerElement({
    //     position: latlng,
    //     map: map.value,
    //     title: origin.street,
    //     content: buttonOrigin,
    //   });

      map.value.panTo(latlng);
      // map.value.setZoom(14);
      // mapMarkers.value.push(mapMark);
  });

  function clearAllButtons(sourceBtn) {
    pbtns.value.forEach((btn) => {
      if (btn != sourceBtn) {
        btn.className='btn-purple'
      }
    });
    ibtns.value.forEach((btn) => {
      if (btn != sourceBtn) {
        btn.className='btn-info'
      }
    });

    // btns.value = []; // 清空按鈕陣列
  }

  // =========================================繪圖功能=================================================================
  // 開始繪圖
  function startDrawing(event) {
    isDrawing = true;
    clearPoint();

    addPoint(event);
    const { offsetX, offsetY } = event;
    context.beginPath();
    context.moveTo(offsetX, offsetY);


  }
  function clearPoint(){
    points = [];
    if (polygon) {
        polygon.setMap(null); // 移除多邊形
        polygon = null;       // 清空變數
    }
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
    google.maps.event.addListener(polygon, "click", (event) => {
      const latLng = event.latLng;
      // alert(`你點擊了多邊形，座標：${latLng.lat()}, ${latLng.lng()}`);
      if (activeInfoWindow) {
        activeInfoWindow.close();
        activeInfoWindow = null; // 清除記錄
      }
    });
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
    emits('update-marker',data,1)

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

  async function openHouseView(houseId) {
      selectedHouseId.value = Number(houseId);
      showView.value = true;
      
      try {
        // 增加點擊數
        await incrementClickCount(houseId);

        // 獲取最新點擊數

      } catch (error) {
        console.error("Error handling house view:", error);
      }
  }
  function closeHouseView() {
    showView.value = false;
  }

  async function incrementClickCount(houseId) {
    try {
      const response = await fetch(`http://localhost:8080/api/houses/${houseId}/incrementClick`, {
        method: "PUT",
        headers: {
          Authorization: localStorage.getItem("jwt"),
        },
      });
      if (!response.ok) {
        console.error(`Failed to increment click count for houseId: ${houseId}`);
      }
    } catch (error) {
      console.error("Error incrementing click count:", error);
    }
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

  <Dialog
    v-model:visible="showView"
    modal
    appendTo="body"
    :style="{ width: '80vw', maxWidth: '900px', height: '80vh', maxHeight: '90vh' }"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    header="房屋資訊"
    :closable="true"
    @hide="closeHouseView"
  >
    <HouseView :houseId="selectedHouseId" @close="closeHouseView" />
  </Dialog>
</template>

<style>
.map-container {
  width: 100%;
  height: 76vh;
  position: relative;
}
.custom-shadow {
  margin: 0 0 2px 2px;
  box-shadow: -5px 5px 5px -3px rgba(0, 0, 0, 0.4);
}
.card-shadow {
  box-shadow: -5px 5px 5px -3px rgba(0, 0, 0, 0.4);
}
.gm-style-iw-ch {
    padding: 0px;
}
.gm-style .gm-style-iw-c{
    padding: 0px;
}
.gm-style-iw-d{
    overflow: hidden !important; /* 關閉滾動條 */
    max-height: none !important; /* 確保內容高度無限制 */
}
.gm-style-iw button.gm-ui-hover-effect {
  display: none !important;
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
    background-color: #9333EA;
    color: white;
    border-radius: 0.5rem; /* 圓角效果 */
    padding: 3px; /* 增加按鈕內邊距 */
    border: none; /* 去掉邊框 */
    transition: background-color 0.3s ease;
    width: 40px;
}
.btn-info{
  background-color: #358bd5;
    color: white;
    border-radius: 0.5rem; /* 圓角效果 */
    padding: 3px; /* 增加按鈕內邊距 */
    border: none; /* 去掉邊框 */
    transition: background-color 0.3s ease;
    width: 40px;
}
.btn-red{
  background-color: #c64633;
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
.btn-info:hover {
    background-color: #1749d1; /* purple-700 */
}
.btn-red:hover {
    background-color: #f02d0a; /* purple-700 */
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