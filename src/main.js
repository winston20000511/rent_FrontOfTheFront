import "./assets/main.css";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import axios from 'axios';
import Button from "primevue/button";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const app = createApp(App)
app.config.globalProperties.$axios = axios;
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.use(createPinia())
app.use(router)
app.mount('#app')

// 預設BASEURL
axios.defaults.baseURL = 'http://localhost:8080';
