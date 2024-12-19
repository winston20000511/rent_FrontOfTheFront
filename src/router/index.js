import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginPage from '@/components/User/LoginPage.vue';
import EditUserPage from '@/components/User/EditUserPage.vue';
import ForgotPassword from '@/components/User/ForgotPassword.vue';
import MemberCenter from '@/components/User/MemberCenter.vue';
import EditProfile from '@/components/User/EditProfile.vue';

const routes = [
  {
    path: '/', // 主框架頁面
    name: 'home',
    component: HomeView, // 主框架組件
  },
  {
    path: '/login', // 登入頁面路徑
    name: 'LoginPage',
    component: LoginPage, // 顯示 LoginPage
  },
  {
    path: '/forgot-password', // 忘記密碼頁面路徑
    name: 'ForgotPassword',
    component: ForgotPassword,
  },
  {
    path: '/edit-user', // 編輯用戶頁面路徑
    name: 'EditUser',
    component: EditUserPage,
  },
  {
    path: '/member-center', // 會員中心頁面路徑
    name: 'MemberCenter',
    component: MemberCenter, // 顯示 MemberCenter
    children: [ //我在 /member-center 路由下添加了一個 children 陣列，這樣當訪問 /member-center/edit-profile 時，會顯示 EditUserPage.vue。
      {
        path: 'edit-profile',  // 這是子路由，會在 MemberCenter 中顯示 EditProfile
        name: 'EditProfile',
        component: EditProfile
      },
      // 你可以在這裡添加更多子路由，根據需要加載其他頁面
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
