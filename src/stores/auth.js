// 建立一個登入狀態的 Store
import { defineStore } from 'pinia';
import api from '@/api/api'; // 引入我們的 API 配置檔案

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false, // 是否登入
    userProfile: null, // 用戶資料
    profilePicture: null, // 會員頭像 URL
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
        this.userProfile = response.data.profilePic; // 儲存用戶資料
        this.profilePicture = response.data.profilePic; // 儲存頭像 URL
      } catch (error) {
        console.error('取得用戶資料失敗:', error);
      }
    },
    logout() {
      localStorage.removeItem('jwt_token'); // 移除 token
      this.isLoggedIn = false; // 更新狀態為未登入
      this.userProfile = null; // 清空用戶資料
      this.profilePicture = null; // 清空頭像 URL
    }
  },
});
