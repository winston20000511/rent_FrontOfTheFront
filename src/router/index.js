import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/View/HomeView.vue";
import MemberCenter from "@/components/User/memberCenter.vue";
import EditUserPage from "@/components/User/EditUserPage.vue";
import ForgotPassword from "@/components/User/ForgotPassword.vue";
import LoginForm from "@/components/User/LoginForm.vue";
import HouseView from "@/View/HouseView.vue";
import MyOrders from "@/components/Orders/MyOrders.vue";
import OrderConfirmView from "@/View/OrderConfirmView.vue";
import AdtypeView from "@/View/AdtypeView.vue";
import NoAdHouseList from "@/components/Ads/NoAdHouseList.vue";
import OrderCompleteView from "@/View/OrderCompleteView.vue";
import EditProfile from "@/components/User/EditProfile.vue";

const routes = [
  {
    path: "/", // 主框架頁面
    name: "home",
    component: HomeView, // 主框架組件
  },
  {
    path: "/forgot-password", // 忘記密碼頁面路徑
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/edit-user", // 編輯用戶頁面路徑
    name: "EditUser",
    component: EditUserPage,
  },
  {
    path: "/member-center", // 會員中心頁面路徑
    name: "MemberCenter",
    component: MemberCenter, // 顯示 MemberCenter
    children: [
      //我在 /member-center 路由下添加了一個 children 陣列，這樣當訪問 /member-center/edit-profile 時，會顯示 EditUserPage.vue。

      {
        path: "edit-user", // 編輯用戶頁面路徑
        name: "EditUser",
        component: EditUserPage,
      },
      {
        path: "edit-profile", // 這是子路由，會在 MemberCenter 中顯示 EditProfile
        name: "EditProfile",
        component: EditProfile,
      },
      // 你可以在這裡添加更多子路由，根據需要加載其他頁面
    ],
  },
  {
    path: "/login", // 登入頁面的路徑設定
    name: "LoginForm",
    component: LoginForm,
  },
  {
    path: "/forgot-password", // 忘記密碼頁面的路徑設定
    name: "ForgotPassword",
    component: ForgotPassword, // 使用 ForgotPassword 組件
  },
  {
    path: "/MemberCenter",
    name: "MemberCenter",
    component: MemberCenter,
  },
  {
    path: "/HouseVue",
    name: "HouseVue",
    component: HouseView,
  },
  // 其他路由可以在這裡添加
  {
    path: "/orders", // 開發用，之後會刪掉
    name: "orders",
    component: MyOrders,
  },
  {
    path: "/adtype",
    name: "adtypes",
    component: AdtypeView,
  },
  {
    path: "/order-confirm",
    name: "orderConfirm",
    component: OrderConfirmView,
  },
  {
    path: "/ads", // 開發用，之後刪掉
    name: "ads",
    component: MyAds,
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
    path: "/order-complete",
    name: "orderComplete",
    component: OrderCompleteView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
