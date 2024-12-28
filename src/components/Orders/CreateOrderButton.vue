
<template>

    <button @click="addAd" 
        type="button" 
        class="bg-green-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300"
    >
        為物件申請 VIP 服務
    </button>
    
</template>


<script>
    export default {
    data() {
      return {

      };
    },
    methods: {
        addAd(){
            this.$emit("click-create-btn");
            // window.location.href = "/advertisements/mylist?action=addAd";
        }
    }
  };
</script>

<style scoped></style>