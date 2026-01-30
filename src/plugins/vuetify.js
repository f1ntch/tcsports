import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#00DC82',
          secondary: '#1a1a2e',
          surface: '#0f0f1a',
          background: '#050510'
        }
      }
    }
  }
})

