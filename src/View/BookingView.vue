<script setup>
import BookingSlot from '@/components/Booking/BookingViewComponent.vue';
import { ref } from 'vue';


const BASE_URL = import.meta.env.VITE_APIURL

const emit = defineEmits(['closeView']);
const closeView = () => {
  emit('closeView');
};

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  houseId: {
    type: Number,
    required: true,
  },
});

</script>

<template>
  <div class="modal-overlay " @click="closeView" v-if="isVisible">
    <div class="modal-content mb-3" @click.stop>
      <button type="button" class="btn-close btn btn-primary" @click="closeView"></button>
      <div class="modal-header">
        <BookingSlot :houseId="houseId" />
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
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 0px 10px;
  width: 500px;
  overflow-y: auto;
  max-height: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
}

.btn-close {

  background-color: rgb(216, 209, 111);
  border-radius: 5rem;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  z-index: 1001;
  text-align: start
}
</style>