<script setup>
import BookingView from '@/View/BookingView.vue';
import { ref } from 'vue';

  const showBookingView = ref(false);
  const loadBookingView = () => {
    showBookingView.value = true;
  };
  const closeBookingView = () => {
    showBookingView.value = false;
  };
</script>

<template>
<div class="container py-4 px-4 bg-body custom-left-shadow">
  <div class="row gy-4">
    <div class="col-12 col-md-6">
        <div class="card" style="width: 18rem;">
            <img src="../../assets/view1.jpg" class="card-img-top" alt="...">
            <div class="card-body">
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>

                <div class="modal-body">
                    <button type="button" class="btn btn-primary" @click="loadBookingView">預約看房
                    </button>
                    <BookingView v-if="showBookingView" :isVisible="showBookingView"  @closeView="closeBookingView" />
                </div>

            </div>
        </div>
    </div>
    <div class="col-12 col-md-6">
        <div class="card" style="width: 18rem;">
            <img src="../../assets/view1.jpg" class="card-img-top" alt="...">
            <div class="card-body">
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
        </div>
    </div>
    <div class="col-12 col-md-6">
        <div class="card" style="width: 18rem;">
            <img src="../../assets/view1.jpg" class="card-img-top" alt="...">
            <div class="card-body">
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
        </div>
    </div>
    <div class="col-12 col-md-6">
        <div class="card" style="width: 18rem;">
            <img src="../../assets/view1.jpg" class="card-img-top" alt="...">
            <div class="card-body">
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
        </div>
    </div>
    <div class="col-12 col-md-6">
        <div class="card" style="width: 18rem;">
            <img src="../../assets/view1.jpg" class="card-img-top" alt="...">
            <div class="card-body">
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
        </div>
    </div>
    <div class="col-12 col-md-6">
        <div class="card" style="width: 18rem;">
            <img src="../../assets/view1.jpg" class="card-img-top" alt="...">
            <div class="card-body">
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
        </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.custom-left-shadow {
    position: relative;
    margin: 0px 0px 0px 5px;
    box-shadow: -5px 0px 5px -3px rgba(0, 0, 0, 0.4) ; /* 浅灰色阴影 */
}
</style>
