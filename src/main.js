import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import LoginPage from './components/LoginPage.vue'

createApp(LoginPage).mount('#app')

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
