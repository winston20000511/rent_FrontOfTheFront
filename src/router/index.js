import { createRouter, createWebHistory } from 'vue-router';
import MemberCenter from '../views/MemberCenter.vue';

const routes = [
  {
    path: '/member-center',
    name: 'MemberCenter',
    component: MemberCenter
  },
  // 在這裡設定其他路由
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;