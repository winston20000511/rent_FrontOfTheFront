import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import LoginPage from './components/User/LoginPage.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import axios from 'axios';

const app = createApp(App)
app.config.globalProperties.$axios = axios;
app.use(LoginPage)
app.use(createPinia())
app.use(router)
app.mount('#app')
// app.use(PrimeVue, {theme: {preset: Aura}});
app.use(PrimeVue, {unstyled: true});

// 預設BASEURL
axios.defaults.baseURL = 'http://localhost:8080';