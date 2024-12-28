<script setup>

    const emit = defineEmits(["toggle-cart"]);

    const toggleCart = () =>{
        emit("toggle-cart");
    }

</script>

<template>

    <div class="flex justify-end w-full sm:w-auto">
        <button
          type="button"
          class="bg-green-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300" @click="toggleCart">
          查看申請清單
        </button>
    </div>

</template>

<style scoped> </style>
