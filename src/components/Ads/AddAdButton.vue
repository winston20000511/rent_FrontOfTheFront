<script setup>
    import { ref, watch, computed } from "vue";

    const props = defineProps({
    showAdList: {
        type: Boolean,
        required: true,
    },
    });

    const emit = defineEmits(["toggle-no-ad-houses"]);

    const buttonText = ref("為物件新增廣告+");
    const buttonClass = computed(() => {
    return buttonText.value === "結束新增服務"
        ? "bg-gray-500 hover:bg-gray-400 focus:ring-gray-300"
        : "bg-green-500 hover:bg-green-400 focus:ring-green-300";
    });

    function toggleNoAdHouses(){
      emit("toggle-no-ad-houses");
    };

    // watch(source, callback, options?)
    watch(
      () => props.showAdList,
      (newValue) => {buttonText.value = newValue ? "為物件新增廣告+" : "結束新增";},
      { immediate: true }
    ); 

</script>

<template>
  <button
    type="button"
    :class="buttonClass"
    class="text-white px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2"
    @click="toggleNoAdHouses"
  >
    {{ buttonText }}
  </button>
</template>

<style scoped></style>
