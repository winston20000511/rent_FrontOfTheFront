import { defineStore } from "pinia";
import axios from "axios"; 

export const useCart = defineStore("cart", {
  state: () => ({
    userId: null,
    cartId: null,
    cartItems: [],
    paymentMethod: null,
  }),

  actions: {

    // 載入購物車
    async loadCart() {
      try {
        const response = await axios.post("/api/cart/list");
        this.cartItems = response.data;
        this.cartId = this.cartItems[0].cartId
      
        console.log("Pinia gets cart items: ", response.data, " cart id: ", this.cartId );
      } catch (error) {
        console.error("無法取得購物車內容: ", error);
      }
    },

    // 將商品加入購物車
    async addToCart(adId) {
      console.log("cartStore add to cart: ", adId);

      if (!Array.isArray(this.cartItems)) {
        console.error("cartItems 不是一個陣列，重新初始化為空陣列");
        this.cartItems = []; 
      }

      const existingItem = this.cartItems.find(item => item.adId === adId);

      if (!existingItem) {
        try {
          const response = await axios.post("/api/cart/additem", adId, {
            headers: { 'Content-Type': 'application/json' }
          });

          const success = response.data;

          console.log("Success: ", success);

          if (success) {
            this.cartItems.push(adId);
          } else {
            console.error("新增商品到購物車失敗");
          }
        } catch (error) {
          console.error("無法新增商品到購物車: ", error);
        }
      } else {
        alert('該商品已在購物車中');
      }
    },

    // 從購物車移除商品
    async removeFromCart(adId) {
      const existingItem = this.cartItems.find(item => item.adId === adId);

      if (existingItem) {
        try {
          const response = await axios.delete("/api/cart/deleteitem", {
            data: adId,
            headers: { 'Content-Type': 'application/json' }
          });

          const success = response.data;

          console.log("Success: ", success);

          if (success) {
            this.cartItems = this.cartItems.filter(item => item.adId !== adId);
          } else {
            console.error("從購物車移除商品失敗");
          }

        } catch (error) {
          console.error("無法從購物車移除商品: ", error);
        }
      } else {
        console.log("商品不在購物車中");
      }
    },

    // 清空購物車
    clearCart() {
      // 加axios
      this.cartItems = [];
      this.paymentMethod = null;
      console.log("購物車已清空");
    },

    // 設定付款方式
    setPaymentMethod(method){
      this.paymentMethod = method;
      console.log("pinia中的付款方式設定: ", this.paymentMethod);
    }
  },
});
