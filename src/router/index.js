import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/View/HomeView.vue';
import MemberCenter from '@/components/User/memberCenter.vue'; // 更新了相對路徑
import EditUserPage from '@/components/User/EditUserPage.vue';
import ForgotPassword from '@/components/User/ForgotPassword.vue';
import LoginForm from '@/components/User/LoginForm.vue';
import MyOrders from '@/components/Orders/MyOrders.vue';
import OrderConfirmView from '@/View/OrderConfirmView.vue';
import AdtypeView from '@/View/AdtypeView.vue';
import OrderCompleteView from '@/View/OrderCompleteView.vue';
import EditProfile from '@/components/User/EditProfile.vue';
import Houselist from '@/components/houses/houselist.vue';
import CollectHouseList from '@/components/houses/CollectHouseList.vue';

const routes = [
  {
    path: '/', // 主框架頁面
    name: 'home',
    component: HomeView,
    props: (route) => ({ markers: route.params.markers || {} }),
  },
  {
    path: '/forgot-password', // 忘記密碼頁面
    name: 'ForgotPassword',
    component: ForgotPassword,
  },
  {
    path: '/edit-user', // 編輯用戶頁面
    name: 'EditUser',
    component: EditUserPage,
  },
  {
    path: '/member-center', // 會員中心
    name: 'MemberCenter',
    component: MemberCenter, // 對應你提供的路徑
    redirect: '/member-center/my-houses', // 默認跳轉到我的房屋
    children: [
      {
        path: 'edit-profile', // 修改會員資料
        name: 'EditProfile',
        component: EditProfile,
      },
      {
        path: 'my-houses', // 我的房屋
        name: 'MyHouses',
        component: Houselist,
      },
      {
        path: 'my-collections', // 我的收藏
        name: 'MyCollections',
        component: CollectHouseList,
      },
      {
        path: 'edit-user', // 編輯用戶
        name: 'EditUserChild',
        component: EditUserPage,
      },
    ],
  },
  {
    path: '/login', // 登入頁面
    name: 'LoginForm',
    component: LoginForm,
  },
  {
    path: '/orders', // 測試用
    name: 'Orders',
    component: MyOrders,
  },
  {
    path: '/adtype',
    name: 'AdTypes',
    component: AdtypeView,
  },
  {
    path: '/order-confirm',
    name: 'OrderConfirm',
    component: OrderConfirmView,
  },
  {
    path: '/order-complete',
    name: 'OrderComplete',
    component: OrderCompleteView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
