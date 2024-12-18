<script setup>
import { toRef, watch } from 'vue';
import HousePhotos from '../houses/housePhotos.vue';

    
    const props = defineProps({
        markers: Object
    })

    const markers = toRef(props,'markers')

</script>

<template>
<div class="container py-4 px-4 bg-body custom-shadow">
  <div class="row gy-4">
    <div v-for="list in markers.searchList" class="col-12 col-md-6" >
        <div class="card card-shadow" style="width: 100%;">
            <img src="/src/assets/img/view1.jpg" class="card-img-top" alt="...">
            <p class="card-text">{{"NT$" + list.price}}</p>
            <p class="card-text">{{list.address}}</p>
        </div>
    </div>
 </div>
</div>
</template>

<style scoped>
.custom-shadow {
    position: relative;
    margin: 0px 0px 0px 5px;
    box-shadow: -5px 0px 5px -3px rgba(0, 0, 0, 0.4) ; /* 浅灰色阴影 */
}
.card-shadow {
    position: relative;
    box-shadow: -5px 5px 5px -3px rgba(0, 0, 0, 0.4) ; /* 浅灰色阴影 */
}
</style>
