<template>
  <div class="min-h-screen bg-background text-foreground">
    <router-view />
    <Toaster position="top-right" :theme="isDark ? 'dark' : 'light'" richColors />
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from 'vue'
import { Toaster } from 'vue-sonner'

const isDark = ref(false)

onMounted(() => {
  try {
    const theme = localStorage.getItem('tc-sports-theme')
    isDark.value = theme === 'dark'
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  } catch {}
})

watchEffect(() => {
  isDark.value = document.documentElement.classList.contains('dark')
})
</script>
