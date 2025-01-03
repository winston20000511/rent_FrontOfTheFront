import "./assets/main.css";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import axios from 'axios';
import Button from "primevue/button"
import 'primeicons/primeicons.css';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmDialog from 'primevue/confirmdialog';
import ToastService from "primevue/toastservice";
import { VueReCaptcha } from "vue-recaptcha-v3";

const app = createApp(App)
app.config.globalProperties.$axios = axios;
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p', 
            darkModeSelector: false, 
            cssLayer: false, 
        }
    }
});

app.component('Button', Button);
app.use(createPinia())
app.use(ConfirmationService); // 註冊 ConfirmationService
app.use(ToastService);
app.component('ConfirmDialog', ConfirmDialog); 
app.use(VueReCaptcha, { siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY });
app.use(router)
app.mount('#app')

// 預設BASEURL
axios.defaults.baseURL = "http://localhost:8080";
