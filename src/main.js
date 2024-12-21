import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import LoginPage from "./components/User/LoginPage.vue";
import axios from "axios";

import PrimeVue from "primevue/config";

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.use(LoginPage);
app.use(createPinia());
app.use(router);
app.use(PrimeVue);

app.mount("#app");


// 預設BASEURL
axios.defaults.baseURL = "http://localhost:8080";
