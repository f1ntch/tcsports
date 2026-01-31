import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#A855F7',
          'primary-darken-1': '#9333EA',
          secondary: '#1E1E2E',
          surface: '#1A1A2E',
          background: '#0D0D14',
          'surface-variant': '#252538',
          'on-surface-variant': '#A0A0B8',
          error: '#FF5252',
          success: '#4CAF50',
        }
      },
      light: {
        colors: {
          primary: '#9333EA',
          'primary-darken-1': '#7C3AED',
          secondary: '#f5f5f5',
          surface: '#ffffff',
          background: '#fafafa',
          error: '#D32F2F',
          success: '#388E3C',
        }
      }
    }
  },
  defaults: {
    VCard: {
      elevation: 0,
      rounded: 'lg',
    },
    VBtn: {
      elevation: 0,
    },
    VChip: {
      elevation: 0,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
  }
})
