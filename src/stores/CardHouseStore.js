import { defineStore } from 'pinia'
export const useHouseCard = defineStore('houseCard', {
    state: () => ({
      shareMarkers: [], // 共用的狀態
    }),
    actions: {
      updateData(newData) {
        this.shareMarkers = newData; // 更新狀態
      },
    },
  });