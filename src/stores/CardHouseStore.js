import { defineStore } from 'pinia'
export const useHouseCard = defineStore('houseCard', {
    state: () => ({
      shareMarkers: [], // 共用的狀態
      selectMarker: [],
    }),
    actions: {
      updateData(newData) {
        this.shareMarkers = newData; // 更新狀態
      },
      updateSeleted(newData) {
        this.selectMarker = newData; // 更新狀態
      },
    },
  });