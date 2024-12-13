import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import LoginPage from './components/User/LoginPage.vue';


const app = createApp(App)
app.use(LoginPage)
app.use(createPinia())
app.use(router)

app.mount('#app')