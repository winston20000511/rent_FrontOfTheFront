import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import axios from "axios";
import Button from "primevue/button";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(ToastService);
app.use(ConfirmationService);
app.component("Button", Button);
app.use(createPinia());
app.use(router);

app.mount("#app");

// 預設BASEURL
axios.defaults.baseURL = "http://localhost:8080";
