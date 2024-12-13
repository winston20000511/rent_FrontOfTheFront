import { createApp } from 'vue';
import App from './App.vue'
import router from './router'
// 引入 Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// 引入 Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// 引入 Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createPinia } from 'pinia'
import LoginPage from './components/User/LoginPage.vue';


const app = createApp(App)
app.use(LoginPage)
app.use(createPinia())
app.use(router)

app.mount('#app')
