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
      const token = localStorage.getItem('jwt_token');
      if (token) {
        this.isLoggedIn = true;
        this.fetchUserProfile();
      }
    },
    async fetchUserProfile() {
      try {
        // 模擬後端返回的資料
        // 假設您尚未完成後端，這裡直接用固定的資料來模擬
        this.userProfile = {
          name: 'Demo User',
          email: 'demo@example.com',
        }; 
        // 設定模擬的頭像 URL
        this.profilePicture = http://localhost:8080/api/user/profile-pic; // 假設的頭像圖片路徑
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
