import { defineStore } from 'pinia'
export const useOption = defineStore('option', {
    state: () => ({
      shareOptions: {}, // 共用的狀態
    }),
    actions: {
      updateData(userOption) {
        this.shareOptions = userOption; // 更新狀態
      },
      initializeData() {
        this.shareOptions = {
          err: '',
          minPrice: 0,
          maxPrice: 0,
          pet: true,
          parkingSpace: true,
          elevator: true,
          balcony: true,
          shortTerm: true,
          cooking: true,
          waterDispenser: true,
          fee: true,
          gender: 2,
          genderBoy: true,
          genderGirl: true,
          house: true,
          independentHouse: true,
          rentHouse: true,
          shareHouse: true,
          houseType: '透天,獨立套房,分租套房,雅房',
          priority: 'a',
          sort: 'desc'
        };
      },
    },
  });