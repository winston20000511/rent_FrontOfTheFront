import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  // 在這裡設定其他路由
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;