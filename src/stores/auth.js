// 建立一個登入狀態的 Store
import { defineStore } from 'pinia';
import api from '@/api/api'; // 引入我們的 API 配置檔案

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false, // 是否登入
    userProfile: null, // 用戶資料，存儲所有的用戶資料
    profilePicture: null, // 會員頭像 URL
  }),
  actions: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      if (token) {
        this.isLoggedIn = true;
        this.fetchUserProfile();
      }
    },
    async fetchUserProfile() {
      try {
        const response = await api.get('/user/profile');
        // 假設後端返回的資料包含完整的用戶資訊，我們儲存整個用戶資料
        this.userProfile = response.data; 
        // 將 profilePic 儲存到 profilePicture 屬性
        this.profilePicture = response.data.profilePic;
      } catch (error) {
        console.error('取得用戶資料失敗:', error);
      }
    },
    logout() {
      localStorage.removeItem('jwt'); // 移除 jwt
      this.isLoggedIn = false; // 更新狀態為未登入
      this.userProfile = null; // 清空用戶資料
      this.profilePicture = null; // 清空頭像 URL
    }
  },
});