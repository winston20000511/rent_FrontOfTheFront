<script setup>
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js'
import BookingSlot from '@/components/Booking/BookingSlot.vue';
import { ref, defineEmits } from 'vue';

const houseId = 1; //由上一層提供,目前寫死

const BASE_URL = import.meta.env.VITE_APIURL

const emit = defineEmits(['closeView']);
const closeView = () => {
  emit('closeView');
};

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  }
});

</script>

<template>
  <div class="modal-overlay" @click="closeView" v-if="isVisible">
    <div class="modal-content" @click.stop>
      <button type="button" class="btn-close" @click="closeView"></button>
      <div class="modal-header">
        <BookingSlot :houseId="houseId"/>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
h2 {
  color: red;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 500px;
  /* Adjust width as needed */
}

.modal-header {
  display: flex;
  justify-content: space-between;
}
.btn-close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
} 
</style>