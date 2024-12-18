import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginPage from '@/components/User/LoginPage.vue';
import EditUserPage from '@/components/User/EditUserPage.vue';
import ForgotPassword from '@/components/User/ForgotPassword.vue';
import MemberCenter from '@/components/User/memberCenter.vue';


const routes = [
  {
    path: '/', // 主框架頁面
    component: HomeView, // 主框架組件
    children: [
      {
        path: '', // 預設子路由，對應首頁內容
        name: 'home',
        component: HomeView, // 預設顯示 HomeView
      },
      {
        path: '/login', // 登入頁面路徑
        name: 'LoginPage',
        component: LoginPage, // 顯示 LoginPage
      },
      {
        path: 'forgot-password', // 忘記密碼頁面路徑
        name: 'ForgotPassword',
        component: ForgotPassword,
      },
      {
        path: 'edit-user', // 編輯用戶頁面路徑
        name: 'EditUser',
        component: EditUserPage,
      },
      {
        path:'/member-center',
        name:'memberCenter',
        component: MemberCenter
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
