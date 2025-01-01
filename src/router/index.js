import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/View/HomeView.vue";
import MemberCenter from "@/components/User/memberCenter.vue"; // 更新了相對路徑
import EditUserPage from "@/components/User/EditUserPage.vue";
import ForgotPassword from "@/components/User/ForgotPassword.vue";
import LoginForm from "@/components/User/LoginForm.vue";
import MyOrders from "@/components/Orders/MyOrders.vue";
import OrderConfirmView from "@/View/OrderConfirmView.vue";

import OrderCompleteView from "@/View/OrderCompleteView.vue";
import EditProfile from "@/components/User/EditProfile.vue";
import Houselist from "@/components/houses/houselist.vue";
import CollectHouseList from "@/components/houses/CollectHouseList.vue";
import BookingListByGuest from "@/components/Booking/BookingListByGuest.vue";
import BookingListByHost from "@/components/Booking/BookingListByHost.vue";
import ComplaintForm from "@/View/comp.vue";
import MyAdvertisements from "@/components/Ads/MyAdvertisements.vue";
import ResetPassword from "@/components/User/ResetPassword.vue"; // 新增 ResetPassword 匯入

import DeactivateAccount from "@/components/User/DeactivateAccount.vue";
import GoogleCallBack from "@/components/User/GoogleCallBack.vue";

const routes = [
  {
    path: "/", // 主框架頁面
    name: "home",
    component: HomeView,
    props: (route) => ({ markers: route.params.markers || {} }),
  },
  {
    path:"/callback",
    component: GoogleCallBack,
  },
  {
    path: "/forgot-password", // 忘記密碼頁面
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/reset-password", // 重設密碼頁面路徑
    name: "ResetPassword",
    component: ResetPassword, // 顯示 ResetPassword
  },
  {
    path: "/edit-user", // 編輯用戶頁面路徑
    name: "EditUser",
    component: EditUserPage,
  },
  {
    path: '/member-center', // 會員中心
    name: 'MemberCenter',
    redirect: '/member-center/my-houses', 
    component: MemberCenter, // 顯示 MemberCenter
    children: [
      {
        path: "edit-profile", // 子路由，顯示 EditProfile
        name: "EditProfile",
        component: EditProfile,
      },
      {
        path: "my-houses", // 我的房屋
        name: "MyHouses",
        component: Houselist,
      },
      {
        path: "my-collections", // 我的收藏
        name: "MyCollections",
        component: CollectHouseList,
      },
      {
        path: "edit-user", // 編輯用戶
        name: "EditUserChild",
        component: EditUserPage,
      },
      {
        path: "my-booking", // 用戶預約
        name: "BookingGuest",
        component: BookingListByGuest,
      },
      {
        path: "homeowner", // 房屋預約
        name: "BookingHost",
        component: BookingListByHost,
      },
      {
        path: 'my-advertisements', // 編輯用戶
        name: 'MyAdvertisements',
        component: MyAdvertisements,
      },
      {
        path: "my-orders", // 編輯用戶
        name: "MyOrders",
        component: MyOrders,
      },
      {
        path: '/deactivate-account',
        name: 'DeactivateAccount',
        component: DeactivateAccount,
      },
    ],
  },
  {
    path: "/login", // 登入頁面
    name: "LoginForm",
    component: LoginForm,
  },
  {
    path: "/order-confirm",
    name: "OrderConfirm",
    component: OrderConfirmView,
  },
  {
    path: "/order-complete",
    name: "OrderComplete",
    component: OrderCompleteView,
  },
  {
    path: "/booking/host", // 開發用，不一定刪掉
    name: "bookingbyhost",
    component: BookingListByHost,
  },
  {
    path: "/booking/guest", // 開發用，不一定刪掉
    name: "bookingbyguest",
    component: BookingListByGuest,
  },
  {
    path: "/suggest",
    name: "ComplaintForm",
    component: ComplaintForm,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
