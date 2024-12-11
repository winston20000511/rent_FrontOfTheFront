  <script setup>
  import { ref } from 'vue';
  // import 'bootstrap/dist/css/bootstrap.min.css';
  // import 'bootstrap/dist/js/bootstrap.min.js';
  // import 'bootstrap-icons/font/bootstrap-icons.min.css';
  import BookingView from './BookingView.vue';

  const showBookingView = ref(false);
  const loadBookingView = () => {
    showBookingView.value = true;
  };

  </script>

  <template>
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
      看房子
    </button>

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">我是房子</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>


          <div class="modal-body">
            <button type="button" class="btn btn-primary" @click="loadBookingView">預約看房
            </button>
            <BookingView v-if="showBookingView" />
          </div>


          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>


  </template>

<style scoped>
</style>