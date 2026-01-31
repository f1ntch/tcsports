import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/globals.css'

// Apply saved theme before first paint
try {
  if (typeof document !== 'undefined' && localStorage.getItem('tc-sports-theme') === 'dark') {
    document.documentElement.classList.add('dark')
  }
} catch {}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

