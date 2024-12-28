<script setup>
  
  const props = defineProps({
    detail: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmits();

  const closeDetail = () => {
    emit('close-detail');
  };
</script>


<template>
  <div class="fixed inset-0 z-20 bg-gray-500/75 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg w-4/5 h-4/5 p-8">
      <div class="text-right">
        <button class="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600" @click="closeDetail">
          關閉
        </button>
      </div>

      <h3 class="text-2xl font-semibold text-gray-900 text-center">訂單內容</h3>

      <div class="m-4 overflow-auto h-[calc(100%-6rem)]">
        <table class="border border-gray-400 w-full">
          <thead class="border border-gray-400">
            <tr>
              <th class="bg-gray-100 text-center">訂單號碼</th>
              <td colspan="3" class="px-4 py-2">{{ detail.merchantTradNo }}</td>
            </tr>
            <tr>
              <th class="bg-gray-100 text-center">付款日期</th>
              <td colspan="3" class="px-4 py-2">{{ detail.merchantTradDate }}</td>
            </tr>
            <tr>
              <th class="bg-gray-100 text-center">訂單狀態</th>
              <td colspan="3" class="px-4 py-2">{{ detail.orderStatus }}</td>
            </tr>
            <tr>
              <th class="bg-gray-100 text-center">付款方式</th>
              <td colspan="3" class="px-4 py-2">{{ detail.choosePayment }}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th class="bg-gray-200 text-center">廣告編號</th>
              <th class="bg-gray-200 text-center">VIP方案</th>
              <th class="bg-gray-200 text-center">方案金額</th>
              <th class="bg-gray-200 text-center">房屋標題</th>
              <th class="bg-gray-200 text-center">折扣</th>
              <th class="bg-gray-200 text-center">小計</th>
            </tr>
            <tr v-for="(item, index) in detail.adIds" :key="index">
              <td class="px-4 py-2 text-center">{{ item }}</td>
              <td class="px-4 py-2 text-center">{{ detail.adtypes[index] }}</td>
              <td class="px-4 py-2 text-center">{{ detail.prices[index] }}</td>
              <td class="px-4 py-2 text-center">{{ detail.houseTitles[index] }}</td>
              <td class="px-4 py-2 text-center">discount</td>
              <td class="px-4 py-2 text-center">{{ detail.prices[index] }}</td>
            </tr>
            <tr>
              <td colspan="4"></td>
              <td class="py-1 text-center font-bold">總金額</td>
              <td class="py-1 text-center">{{ detail.totalAmount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
