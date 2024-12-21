import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/View/HomeView.vue';
import MemberCenter from '@/components/User/memberCenter.vue';
import EditUserPage from '@/components/User/EditUserPage.vue';
import ForgotPassword from '@/components/User/ForgotPassword.vue';
import LoginForm from '@/components/User/LoginForm.vue';
import HouseView from '@/View/HouseView.vue';
import MyOrders from '@/components/Orders/MyOrders.vue';
import MyAds from '@/components/Ads/MyAds.vue';
import OrderConfirmView from '@/View/OrderConfirmView.vue';
import AdtypeView from '@/View/AdtypeView.vue';
import NoAdHouseList from '@/components/Ads/NoAdHouseList.vue';
import OrderCompleteView from '@/View/OrderCompleteView.vue';

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
        path: 'edit-user', // 編輯用戶頁面路徑
        name: 'EditUser',
        component: EditUserPage,
      },
    ],
  },
  {
    path: '/login', // 登入頁面的路徑設定
    name: 'LoginForm',
    component: LoginForm}
    ,
  {
    path: '/forgot-password', // 忘記密碼頁面的路徑設定
    name: 'ForgotPassword',
    component: ForgotPassword // 使用 ForgotPassword 組件
  },
  {
    path:"/MemberCenter",
    name:"MemberCenter",
    component: MemberCenter
  },
  {
    path:"/HouseVue",
    name:"HouseVue",
    component:HouseView
  },
  // 其他路由可以在這裡添加
  {
    path:"/orders", // 開發用，之後會刪掉
    name:"orders",
    component: MyOrders,
  },
  {
    path:"/adtype",
    name:"adtypes",
    component: AdtypeView,
  },
  {
    path:"/order-confirm",
    name:"orderConfirm",
    component: OrderConfirmView,
  },
  {
    path:"/order-complete",
    name:"orderComplete",
    component: OrderCompleteView,
  },
  {
    path:"/ads",
    name:"ads",
    component: MyAds,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
