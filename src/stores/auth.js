//建立一個登入狀態的 Store
import { defineStore } from 'pinia';
import api from '@/api/api'; // 引入我們的 API 配置檔案

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false, // 是否登入
    userProfile: null, // 用戶資料
  }),
  actions: {
    checkLoginStatus() {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        this.isLoggedIn = true;
        this.fetchUserProfile();
      }
    },
    async fetchUserProfile() {
      try {
        const response = await api.get('/user/profile');
        this.userProfile = response.data.profilePic;
      } catch (error) {
        console.error('取得用戶資料失敗:', error);
      }
    },
    signOut() {
      localStorage.removeItem('jwt_token');
      this.isLoggedIn = false;
      this.userProfile = null;
    },
  },
});
