<script>
    export {};
</script>

<template lang="">

    <div id="cart" class="fixed top-0 right-0 w-80 h-full bg-white shadow-lg transform hidden-right z-50 hidden">

        <div class="flex justify-between p-4 border-b">
            <h2 class="text-xl font-semibold">選購清單</h2>
            <button id="close-cart" class="text-xl font-bold text-gray-600 hover:text-gray-800 focus:outline-none">
                ×
            </button>
        </div>

        <div id="cart-list" class="p-4 space-y-4"></div>

        <div class="p-4 space-y-4">
            <p class="text-lg font-semibold">選擇付款方式</p>
            <div class="flex flex-col space-y-2">
                <label class="flex items-center">
                    <input type="radio" name="payment-method" value="linepay" class="mr-2" checked/>
                    <span class="text-gray-700"><img width="70px" src="../../assets/Line_pay_logo.svg.png"/></span>
                </label>
                
                <label class="flex items-center">
                    <input type="radio" name="payment-method" value="Credit" class="mr-2"/>
                        <span class="text-gray-700"><i class="fa-solid fa-credit-card"></i> 信用卡</span>
                    </label>
            </div>
        </div>

        <div class="p-4 text-right border-t">
          <button id="submit-btn" class="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700">
            前往結帳
          </button>
        </div>

    </div>

</template>

<style scoped> </style>
