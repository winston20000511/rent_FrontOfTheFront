import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import MemberCenter from '@/components/User/memberCenter.vue';
import EditUserPage from '@/components/User/EditUserPage.vue';
// import ForgotPassword from '@/components/User/ForgotPassword.vue';
// import LoginForm from '@/components/User/LoginForm.vue';
import Login from '@/components/UserAuth/Login.vue';
import register from '@/components/UserAuth/Register.vue';
import ForgotPWD from '@/components/UserAuth/ForgotPassword.vue';


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/register', 
    name: 'register',
    component: register 
  },
  {
    path: '/login', 
    name: 'login',
    component: Login}
    ,
  {
    path: '/forgot-password', 
    name: 'forgotPassword',
    component: ForgotPWD 
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
  }
  // 其他路由可以在這裡添加
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});


router.beforeEach((to, from, next) => {
  const jwtToken = localStorage.getItem("jwtToken");
  if (to.matched.some((record) => record.meta.requiresAuth) && !jwtToken) {
    next({ name: "Login" });
  } else {
    next();
  }
});
export default router;
