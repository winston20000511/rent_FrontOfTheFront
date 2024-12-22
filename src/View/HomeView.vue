<script setup>
import { ref, toRef } from 'vue';
import HomeCardList from '@/components/Home/HomeCardList.vue';
import HomeFilter from '@/components/Home/HomeFilter.vue';
import HomeMap from '@/components/Home/HomeMap.vue';
import { useHouseCard } from '@/stores/CardHouseStore';

const store = useHouseCard();
const props = defineProps({
  markers: Object
});

const markers = toRef(props,'markers')

const addMarker = (locations) => {
  markers.value = locations;
  store.updateData(markers.value.searchList);
};
</script>

<template>
  <!-- <div class="filter">
    <HomeFilter @add-marker="addMarker"></HomeFilter>
  </div> -->

  <main>
    <div class="main-left">
      <HomeMap @add-marker="addMarker" :markers="markers"></HomeMap>
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
  /* height: 76vh; */
  display: flex;
  background-color: rgb(235, 235, 235);
}

.main-left {
  position: relative;
  width: 45%;
  z-index: 1;
}

.main-right {
  width: 55%;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 2;
}
</style>
