import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginPage from '@/components/User/LoginPage.vue';
import EditUserPage from '@/components/User/EditUserPage.vue';
import ForgotPassword from '@/components/User/ForgotPassword.vue';
import ResetPassword from '@/components/User/ResetPassword.vue'; // 新增 ResetPassword 匯入
import MemberCenter from '@/components/User/MemberCenter.vue';
import EditProfile from '@/components/User/EditProfile.vue';
import DeactivateAccount from '@/components/User/DeactivateAccount.vue';

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
    path: '/reset-password', // 重設密碼頁面路徑
    name: 'ResetPassword',
    component: ResetPassword, // 顯示 ResetPassword
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
    children: [
      {
        path: 'edit-profile', // 子路由，顯示 EditProfile
        name: 'EditProfile',
        component: EditProfile,
      },
      {
        path: '/deactivate-account',
        name: 'DeactivateAccount',
        component: DeactivateAccount,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
