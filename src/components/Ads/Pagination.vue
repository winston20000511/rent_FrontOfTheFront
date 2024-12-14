<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["pageChange"]);

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit("pageChange", page);
  }
};
</script>

<template>
  <div class="flex justify-center mt-4">
    <nav aria-label="Page navigation">
      <ul class="pagination inline-flex items-center space-x-2">
        <li>
          <button
            class="px-3 py-1 border rounded cursor-pointer"
            :class="{ 'cursor-not-allowed opacity-50': currentPage === 1 }"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            <i class="fa-solid fa-angles-left"></i>
          </button>
        </li>
        <button
          v-for="page in totalPages"
          :key="page"
          class="px-3 py-1 border rounded cursor-pointer"
          :class="
            page === currentPage
              ? 'bg-blue-500 text-white'
              : 'text-blue-500 border-gray-300'
          "
          :disabled="currentPage === page"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        <li>
          <button
            class="px-3 py-1 border rounded cursor-pointer"
            :class="{
              'cursor-not-allowed opacity-50': currentPage === totalPages,
            }"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            <i class="fa-solid fa-angles-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.pagination button {
  cursor: pointer;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
