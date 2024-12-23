import { defineStore } from 'pinia'
export const useOption = defineStore('option', {
    state: () => ({
      shareOptions: {}, // 共用的狀態
    }),
    actions: {
      updateData(userOption) {
        this.shareOptions = userOption; // 更新狀態
        console.log(JSON.stringify(this.shareOptions))
      },
    },
  });