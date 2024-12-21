<script setup>
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  onMounted(() => {
    setTimeout(() => {
      router.push("/orders");
    }, 3000);
  });
  </script>

<template>
  
    <div class="text-xl mb-3 text-center border-b border-black py-2">
      訂單確認
    </div>

      <div class="flex items-center mr-64 ml-64 mt-10">
        <div class="flex flex-col items-center">
            <div class="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"></div>
            <div class="mt-2 text-sm text-gray-600">確認</div>
        </div>
        <div class="flex-1 h-0.5 bg-gray-200 -mt-6"></div>
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"></div>
          <div class="mt-2 text-sm text-gray-600">付款</div>
        </div>
        <div class="flex-1 h-0.5 bg-gray-200 -mt-6"></div>
        <div class="flex flex-col items-center">
          
          <div class="w-8 h-8 flex items-center justify-center bg-gray-100 border-2 border-blue-300 rounded-full">
            <div class="w-3 h-3 rounded-full bg-blue-400"></div>
          </div>
          <div class="mt-2 text-sm text-gray-600">完成</div>
          
        </div>
      </div>

      <div class="my-8 px-6 py-3 text-center border-b-2 border-blue-400 text-lg font-medium">
        step3. 付款完成
      </div>

      <div class="text-center"> 三秒後將自動跳轉至訂單一覽表 </div>

  
  </template>
  
  <style scoped>
  </style>
  