import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'tc-sports-theme'

const isDark = ref(false)
let initialized = false

function apply() {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

function init() {
  if (initialized) return
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    isDark.value = stored === 'dark'
  } catch {
    isDark.value = false
  }
  apply()
  initialized = true
}

export function useTheme() {
  onMounted(init)

  const setTheme = (dark) => {
    isDark.value = !!dark
    try {
      localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
    } catch {}
    apply()
  }

  const toggle = () => {
    isDark.value = !isDark.value
    try {
      localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
    } catch {}
    apply()
  }

  return { isDark, toggle, setTheme, init }
}
