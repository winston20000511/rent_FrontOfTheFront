import { defineStore } from "pinia";

let token = localStorage.getItem('jwt');

export const useCart = defineStore("cart", {
    state: () => ({
      
    }),
});