import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/View/HomeView.vue';
import MemberCenter from '@/components/User/memberCenter.vue';
import EditUserPage from '@/components/User/EditUserPage.vue';
import ForgotPassword from '@/components/User/ForgotPassword.vue';
import LoginPage from '@/components/User/LoginPage.vue';
import MyOrders from '@/components/Orders/MyOrders.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
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
    component: EditUserPage
  },
  {
    path:"/MemberCenter",
    name:"MemberCenter",
    component: MemberCenter
  },
  // 其他路由可以在這裡添加
  {
    path:"/orders",
    name:"orders",
    component: MyOrders,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
