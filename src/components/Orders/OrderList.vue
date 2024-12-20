<script setup>
  
  let token = localStorage.getItem('jwt');

  const props = defineProps({
    orders: {
      type: Array,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  });

  const emit = defineEmits(["close-message", "pageChange", "orderCancelResult", "detail", "order-cancel-result"]);

  const changePage = (page) => {
    if (page >= 1 && page <= props.totalPages) {
      emit('pageChange', page);
    }
  };

  const check = async (merchantTradNo) => {
    try {
      const url = "http://localhost:8080/api/orders/merchantTradNo"
      const response = await fetch(url,{
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `${token}` },
        body: merchantTradNo
      })

      const data = await response.json();
      emit('detail', data);
    } catch (error) {
      console.error('系統錯誤: ', error);
    }
  };

  const cancel = async (merchantTradNo) => {
    const userConfirmed = window.confirm('確定要申請取消訂單嗎？');
    if (userConfirmed) {
      try {
        const url = "http://localhost:8080/api/orders/merchantTradNo";
        const response = await fetch(url,{
          method: "PUT",
          headers: { "Content-Type": "application/json", authorization: `${token}` },
          body: merchantTradNo,
        });

        const data = response.json();
        
        emit('order-cancel-result', {
          success: data,
          merchantTradNo,
          messageTitle: data ? '已提出取消申請' : '未成功訂單取消，請稍後再試',
          message: data ? '請待服務人員確認，方能取消訂單' : '或請聯繫客服人員',
        });

      } catch (error) {
        console.error('伺服器錯誤: ', error);
        emit('order-cancel-result', {
          success: false,
          merchantTradNo,
          messageTitle: '系統錯誤，取消訂單失敗',
          message: '請稍後再試',
        });
      }
    } else {
      emit('order-cancel-result', {
        success: false,
        merchantTradNo,
        messageTitle: '尚未取消訂單',
        message: '',
      });
    }
  };

</script>

<template>
  <div class="border border-gray-400 py-2 px-2 rounded-md">
    <table class="table-auto w-full border-collapse border border-gray-300">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-center text-sm font-medium text-gray-600">訂單編號</th>
          <th class="px-4 py-2 text-center text-sm font-medium text-gray-600">下單時間</th>
          <th class="px-4 py-2 text-center text-sm font-medium text-gray-600">訂單狀態</th>
          <th class="px-4 py-2 text-center text-sm font-medium text-gray-600">訂單金額</th>
          <th class="px-4 py-2 text-center text-sm font-medium text-gray-600">物件內容</th>
          <th class="px-4 py-2 text-center text-sm font-medium text-gray-600"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(order, index) in orders" :key="index" class="border-b hover:bg-gray-50">
          <td class="px-4 py-3 text-sm text-gray-700 text-center">{{ order.merchantTradNo }}</td>
          <td class="px-4 py-3 text-sm text-center text-gray-700">{{ order.merchantTradDate }}</td>
          <td class="px-4 py-3 text-sm text-center text-gray-700">
            <span v-if="order.orderStatus === '一般訂單'" class="inline-block px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">{{ order.orderStatus }}</span>
            <span v-if="order.orderStatus === '已取消'" class="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{{ order.orderStatus }}</span>
            <span v-if="order.orderStatus === '取消中'" class="inline-block px-2 py-1 text-xs font-medium rounded-full bg-pink-100 text-pink-800">{{ order.orderStatus }}</span>
          </td>
          <td class="px-4 py-3 text-sm text-center text-gray-700">{{ order.totalAmount }}</td>
          <td class="px-4 py-3 text-sm text-center text-gray-700">
            <ul>
              <li v-for="(title, index) in order.houseTitles" :key="index">{{ title.length > 6 ? title.substring(0, 6) + '...' : title }}</li>
            </ul>
          </td>
          <td class="px-4 py-3 text-center">
            <button class="px-3 py-1 mr-1 text-sm text-blue-600 bg-blue-100 rounded hover:bg-blue-200" @click="check(order.merchantTradNo)">詳細</button>
            <button v-if="order.orderStatus === '一般訂單'" class="px-3 py-1 text-sm text-red-600 bg-red-100 rounded hover:bg-red-200" @click="cancel(order.merchantTradNo)">取消</button>
            <button v-else class="px-3 py-1 text-sm text-gray-400 border rounded" style="cursor: default;" disabled>取消</button>
          </td>
        </tr>
        <tr v-if="orders.length === 0">
          <td colspan="6" class="px-4 py-3 text-center text-gray-500">無符合條件的訂單</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 分頁 -->
  <div class="flex justify-center mt-4">
    <nav aria-label="Page navigation">
      <ul class="pagination inline-flex items-center space-x-2">
        <li>
          <button class="px-3 py-1 border rounded cursor-pointer" :class="{'cursor-not-allowed opacity-50' : currentPage === 1}" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
            <i class="fa-solid fa-angles-left"></i>
          </button>
        </li>
        <button v-for="page in totalPages" :key="page" class="px-3 py-1 border rounded cursor-pointer" :class="page === currentPage ? 'bg-blue-500 text-white' : 'text-blue-500 border-gray-300'" :disabled="currentPage === page" @click="changePage(page)">
          {{ page }}
        </button>
        <li>
          <button class="px-3 py-1 border rounded cursor-pointer" :class="{'cursor-not-allowed opacity-50' : currentPage === totalPages}" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
            <i class="fa-solid fa-angles-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
