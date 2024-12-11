import IndexView from '@/views/HomeView.vue';
import MemberCenter from '@/components/memberCenter.vue';
import { createRouter, createWebHistory } from 'vue-router';


const routes = [
  {
    path: '/',
    name: 'home',
    component: IndexView
  },
  // 在這裡設定其他路由
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;