<template>
  <AppLayout>
    <div class="container mx-auto max-w-[700px] px-4 py-12">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold md:text-3xl">{{ t.profile.title }}</h1>
        <p class="mt-2 text-muted-foreground">{{ t.profile.subtitle }}</p>
      </div>

      <div class="flex flex-col gap-6">
        <div class="rounded-xl border border-border bg-card p-6">
          <div class="mb-1 flex items-center gap-2">
            <User class="h-5 w-5" />
            <h2 class="text-lg font-semibold">{{ t.profile.accountInfo }}</h2>
          </div>
          <p class="mb-4 text-sm text-muted-foreground">{{ t.profile.accountInfoDesc }}</p>
            <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-xs text-muted-foreground">{{ t.profile.fullName }}</p>
              <p class="font-medium">{{ user.fullName }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">{{ t.profile.email }}</p>
              <p class="font-medium">{{ user.email }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-border bg-card p-6">
          <div class="mb-1 flex items-center gap-2">
            <Lock class="h-5 w-5" />
            <h2 class="text-lg font-semibold">{{ t.profile.changePassword }}</h2>
          </div>
          <p class="mb-4 text-sm text-muted-foreground">{{ t.profile.changePasswordDesc }}</p>

          <form @submit.prevent="handleChangePassword" class="space-y-4">
            <div v-if="error" class="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {{ error }}
            </div>
            <div v-if="success" class="flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary">
              <Check class="h-4 w-4" />
              {{ t.profile.successMessage }}
            </div>

            <div class="space-y-2">
              <label for="current-pw" class="text-sm font-medium">{{ t.profile.currentPassword }}</label>
              <div class="relative">
                <input
                  id="current-pw"
                  v-model="currentPassword"
                  :type="showCurrent ? 'text' : 'password'"
                  class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-9 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  :placeholder="t.profile.currentPasswordPlaceholder"
                />
                <button
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:bg-accent"
                  @click="showCurrent = !showCurrent"
                >
                  <Eye v-if="!showCurrent" class="h-4 w-4" />
                  <EyeOff v-else class="h-4 w-4" />
                </button>
              </div>
            </div>
            <div class="space-y-2">
              <label for="new-pw" class="text-sm font-medium">{{ t.profile.newPassword }}</label>
              <div class="relative">
                <input
                  id="new-pw"
                  v-model="newPassword"
                  :type="showNew ? 'text' : 'password'"
                  class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-9 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  :placeholder="t.profile.newPasswordPlaceholder"
                />
                <button
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:bg-accent"
                  @click="showNew = !showNew"
                >
                  <Eye v-if="!showNew" class="h-4 w-4" />
                  <EyeOff v-else class="h-4 w-4" />
                </button>
              </div>
            </div>
            <div class="space-y-2">
              <label for="confirm-pw" class="text-sm font-medium">{{ t.profile.confirmNewPassword }}</label>
              <div class="relative">
                <input
                  id="confirm-pw"
                  v-model="confirmPassword"
                  :type="showConfirm ? 'text' : 'password'"
                  class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-9 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  :placeholder="t.profile.confirmNewPasswordPlaceholder"
                />
                <button
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:bg-accent"
                  @click="showConfirm = !showConfirm"
                >
                  <Eye v-if="!showConfirm" class="h-4 w-4" />
                  <EyeOff v-else class="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              class="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              :disabled="loading"
            >
              <span v-if="loading" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              {{ loading ? t.profile.updating : t.profile.updatePassword }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { User, Lock, Check, Eye, EyeOff } from 'lucide-vue-next'
import AppLayout from '@/components/AppLayout.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const { t } = useLanguage()
const auth = useAuthStore()

const user = computed(() => ({
  email: auth.user?.email || 'Not logged in',
  fullName: auth.user?.user_metadata?.full_name || auth.user?.email?.split('@')[0] || 'User',
}))

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleChangePassword = async () => {
  if (!newPassword.value || !confirmPassword.value) return
  if (newPassword.value.length < 8) {
    error.value = t.value.profile?.passwordMinLength || 'Password must be at least 8 characters'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    error.value = t.value.profile?.passwordsNoMatch || 'Passwords do not match'
    return
  }

  error.value = ''
  success.value = false
  loading.value = true

  try {
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword.value
    })
    
    if (updateError) throw updateError
    
    success.value = true
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    setTimeout(() => (success.value = false), 3000)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
