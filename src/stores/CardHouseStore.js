import { defineStore } from 'pinia'
export const useExampleStore = defineStore('exampleStore', {
    state: () => ({
      sharedData: '', // 共用的狀態
    }),
    actions: {
      updateData(newData) {
        this.sharedData = newData; // 更新狀態
      },
    },
  });