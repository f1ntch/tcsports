<template>
  <AppLayout>
    <div class="flex flex-1 items-center justify-center px-4 py-12">
      <div class="w-full max-w-[450px] rounded-xl border border-border bg-card p-6 shadow-sm">
        <div class="text-center pb-4">
          <span class="text-4xl font-bold text-primary">,,,</span>
          <h1 class="mt-2 text-xl font-semibold">{{ t.login.title }}</h1>
          <p class="mt-1 text-sm text-muted-foreground">{{ t.login.subtitle }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <label for="login-email" class="text-sm font-medium leading-none">{{ t.login.email }}</label>
            <input
              id="login-email"
              v-model="form.email"
              type="email"
              required
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              :placeholder="t.login.email"
            />
          </div>
          <div class="space-y-2">
            <label for="login-password" class="text-sm font-medium leading-none">{{ t.login.password }}</label>
            <div class="relative">
              <input
                id="login-password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-9 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                :placeholder="t.login.password"
              />
              <button
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:bg-accent"
                @click="showPassword = !showPassword"
                aria-label="Toggle password visibility"
              >
                <Eye v-if="!showPassword" class="h-4 w-4" />
                <EyeOff v-else class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div v-if="error" class="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {{ error }}
          </div>

          <button
            type="submit"
            class="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            :disabled="loading"
          >
            <span v-if="loading" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            {{ t.login.signIn }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-muted-foreground">
          {{ t.login.noAccount }}
          <router-link :to="{ name: 'register' }" class="ml-1 font-medium text-primary hover:underline">
            {{ t.login.register }}
          </router-link>
        </p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff } from 'lucide-vue-next'
import AppLayout from '@/components/AppLayout.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const { t } = useLanguage()

const loading = ref(false)
const showPassword = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  password: '',
})

const handleSubmit = async () => {
  if (!form.email || !form.password) return

  error.value = ''
  loading.value = true

  try {
    await auth.signIn(form.email, form.password)
    router.push({ name: 'home' })
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
