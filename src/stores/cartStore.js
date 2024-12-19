import { defineStore } from "pinia";
import axios from "axios"; 

export const useCart = defineStore("cart", {
  state: () => ({
    userId: null,
    cartId: null,
    cartItems: [],
    couponUsage: {},
    totalAmount: 0,
    itemDescription: "",
    productNames: "",
    choosePayment: null,
    thirdParty: null,
    couponNumber: 0,
  }),

  getters: {
    calculate(state) {
      const { totalPrice, discountAmount } = state.cartItems.reduce(
        (accumulator, item) => {
          const discount = state.couponUsage[item.adId] 
            ? Math.floor(item.adPrice * 0.1) 
            : 0;
          accumulator.totalPrice += item.adPrice - discount;
          accumulator.discountAmount += discount;
          return accumulator;
        },
        { totalPrice: 0, discountAmount: 0 }
      );
      console.log("discount: ", discountAmount);
      return { totalPrice, discountAmount };
    },

    generateProductNames(state){
      return state.cartItems.map((item) => item.adName).join(",");
    },

    generateItemDescription(state){
      return `${state.cartItems.length}件商品`;
    }
  },

  actions: {
    // 取得購物車畫面中的完整資料: 購物車內容 + 優惠券數量
    async initializeCart(){
      await this.loadCart();
      await this.getCouponNumber();
      this.updateItemDescription();
      this.updateProductNames();
    },

    // 載入購物車
    async loadCart() {
      try {
        const response = await axios.post("/api/cart/list");
        this.cartItems = response.data;
        this.cartId = this.cartItems[0].cartId;
      
        console.log("Pinia gets cart items: ", response.data, " cart id: ", this.cartId );
      } catch (error) {
        console.error("無法取得購物車內容: ", error);
      }
    },

    updateProductNames(){
      this.productNames = this.generateProductNames;
    },

    updateItemDescription(){
      this.itemDescription = this.generateItemDescription;
    },

    applyCouponToAd(adId){
      if(!this.couponUsage[adId]){
        this.couponUsage[adId] = 1;
      }else{
        console.error("該商品已使用優惠券");
      };

      this.updateTotalAmount();
    },

    removeCoupon(adId){
      if(this.couponUsage[adId]){
        delete this.couponUsage[adId];
      };
    },

    clearCouponUsage(){
      this.couponUsage = {};
    },

    // 將商品加入購物車
    async addToCart(adId) {
      console.log("cartStore add to cart: ", adId);

      if (!Array.isArray(this.cartItems)) {
        this.cartItems = []; 
      }

      const existingItem = this.cartItems.find(item => item.adId === adId);

      if (!existingItem) {
        try {
          const response = await axios.post("/api/cart/additem", adId, {
            headers: { 'Content-Type': 'application/json' }
          });

          const success = response.data;

          if (success) {
            this.cartItems.push(adId);
            alert("已將商品加入購物車");
            this.loadCart();
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
      this.thirdPartry = null;
    },

    async getCouponNumber(){
      // 前往資料庫撈資料
      const url = "/api/cart/coupon";
      const response = await axios.get(url);
      this.couponNumber = response.data;
    },

    // 使用優惠券，一次購物只能用一張
    minusOneCoupon(){
      // 檢查優惠券剩餘數量
      if(this.couponNumber === 0){
        alert("已無可使用的優惠券");
      }else{
        this.couponNumber--;
      }
    },

    addCoupon(number){
      this.couponNumber+=number;
    },

    applyCouponToItem(adId, couponDetails){
      const item = this.cartItems.find(item => item.adId === adId);
      if(item){
        item.couponApplied = couponDetails;
        console.log("已使用優惠券的商品: ", adId);
      };
    },

    // 提交訂單: 要驗證提交訂單
    async createOrder(){
      const orderData = {
        userId: this.userId,
        cartId: this.cartId,
        cartItems: this.cartItems.map(item =>({
          adId: item.adId,
          couponApplied: item.couponApplied,
        })),
        thirdPartry: this.thirdPartry,
      };

      try{
        const url = "/api/orders/create";
        const response = await axios.post(url, orderData);
        if(response.data.success){
          console.log("定單提交成功");
        }else{
          console.log("定單提交失敗");
        }
      }catch(error){
        console.error("提交訂單時發生錯誤: ", error);
      }
    }

  },
});
