<script setup>
import { onMounted, ref, toRef } from 'vue';
import HomeCardList from '@/components/Home/HomeCardList.vue';
import HomeMap from '@/components/Home/HomeMap.vue';
import HomeOption from '@/components/Home/HomeOption.vue';

let adsUrl = 'http://localhost:8080/api/ads'
let token = localStorage.getItem('jwt');
const props = defineProps({
  markers: Object
});
const emits = defineEmits(['add-marker'])
const markers = toRef(props,'markers')
const flipped = ref(false);
const cardFrontRef = ref(null)
const cardBackRef = ref(null)
const options = ref({})

onMounted(()=>{
  showAdsMarker();
})


const updateMarker = (locations,status) => {
  emits('add-marker',locations,status)
};

const updateFlipped = () =>{
  flipped.value = !flipped.value;
  if (flipped.value){
    cardFrontRef.value.style.backfaceVisibility='hidden';
    cardBackRef.value.style.backfaceVisibility='visible'
  }else{
    cardFrontRef.value.style.backfaceVisibility='visible';
    cardBackRef.value.style.backfaceVisibility='hidden'
  }
}
const updateOption = (userOptions)=>{
  options.value = userOptions
}

const showAdsMarker = async () => {
  const response = await fetch(adsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `${token}`
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const data = await response.json();
  console.log(data);
  updateMarker(data,0);

}

</script>

<template>
  <!-- <div class="filter">
    <HomeFilter @add-marker="addMarker"></HomeFilter>
  </div> -->

  <main>
    <!-- <button @click="flipped = !flipped">翻轉卡片</button> -->
    <div class="main-left" :class="{ flipped: flipped }">
      <div class="card">
        <div class="card-front" ref="cardFrontRef">
          <HomeMap @update-marker="updateMarker" @update-flipped="updateFlipped" :markers="markers"></HomeMap>
        </div>
        <div class="card-back" ref="cardBackRef">
          <HomeOption @update-flipped="updateFlipped" @update-option="updateOption"></HomeOption>
        </div>
      </div>
    </div>
    <div class="main-right">
      <HomeCardList :markers="markers"></HomeCardList>
    </div>
  </main>


</template>

<style scoped>
/* .filter {
  display: flex;
  width: 100%;
  height: 10vh;
  border-bottom: 1px solid lightgray;
} */

main {
  position: relative;
  width: 100%;
  height: 76vh;
  display: flex;
  background-color: rgb(235, 235, 235);
}

.main-left {
  position: relative;
  width: 45%;
  z-index: 1;
}
.card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.main-left.flipped .card {
  transform: rotateY(180deg);
}

.card-front{
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  /* display: flex;
  justify-content: center;
  align-items: center; */
  /* font-size: 20px; */
  /* color: #fff; */
  border-radius: 8px;
}

.card-front {
  /* background-color: #007bff; */
}

.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  /* display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px; */
  /* color: #fff; */
  border-radius: 8px;
  /* background-color: white; */
  transform: rotateY(180deg);
}


.main-right {
  width: 55%;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 2;
}

</style>
