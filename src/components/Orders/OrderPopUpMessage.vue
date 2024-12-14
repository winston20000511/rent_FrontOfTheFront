
<template>

  <div class="fixed inset-0 z-10 bg-gray-500/75 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg w-3/4">

      <div class="m-4">
        
        <h3 class="text-2xl font-semibold m-4 text-gray-900 text-center">
          {{messageTitle}}
        </h3>

        <p class="text-center text-gray-700 mb-6">
          {{ message }}
        </p>
        
        <div class="text-right mt-10">
          <button @click="closeMessage" type="button" class="px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-400">
            關閉
          </button>
        </div>

      </div>

    </div>
  </div>

</template>

<script>
    export default{
      props: [
        "messageTitle", 
        "message",
        "showMessage",
      ],

      methods: {
        
        closeMessage(){
          this.$emit("close-message");
        }
      },

      watch: {
        messageTitle(newMessageTitle){
          console.log('Received message title in popup:', newMessageTitle);
        },

        message(newMessage){
          console.log('Received message in popup:', newMessage);
        }
      }
    };
</script>


<style scoped>

</style>