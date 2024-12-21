import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// 引入 Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// 引入 Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// 引入 Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css';

// 初始化應用程式
const app = createApp(App);

// 使用 Pinia 作為狀態管理
const pinia = createPinia();
app.use(pinia);

// 使用 Vue Router
app.use(router);

// 掛載應用程式
app.mount('#app');
