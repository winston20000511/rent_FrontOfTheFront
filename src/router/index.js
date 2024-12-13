import IndexView from '@/views/HomeView.vue';
import MemberCenter from '@/components/memberCenter.vue';
import { createRouter, createWebHistory } from 'vue-router';
import MemberCenter from '@/components/memberCenter.vue';
import LoginPage from '@/components/LoginPage.vue'; // 引入 LoginPage 組件
import ForgotPassword from '@/components/ForgotPassword.vue'; // 引入 ForgotPassword 組件
import EditUserPage from "@/components/EditUserPage.vue";
const routes = [
  {
    path: '/',
    name: 'home',
    component: IndexView
  },
  {
    path: '/login', // 登入頁面的路徑設定
    name: 'LoginPage',
    component: LoginPage // 使用 LoginPage 組件
  },
  {
    path: '/forgot-password', // 忘記密碼頁面的路徑設定
    name: 'ForgotPassword',
    component: ForgotPassword // 使用 ForgotPassword 組件
  },
  {
    path: "/edit-user",
    name: "EditUser",
    component: EditUserPage,
  },
  // 其他路由可以在這裡添加
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
