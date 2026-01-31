<template>
  <AppLayout>
    <v-container class="fill-height d-flex align-center justify-center py-12">
      <v-card max-width="450" width="100%" class="pa-4 auth-card" variant="outlined">
        <v-card-text class="text-center pb-0">
          <span class="text-h3 font-weight-bold text-primary">,,,</span>
          <h1 class="text-h5 font-weight-bold mt-2">{{ t.register.title }}</h1>
          <p class="text-body-2 text-medium-emphasis mt-1">{{ t.register.subtitle }}</p>
        </v-card-text>

        <v-card-text v-if="success">
          <v-alert type="success" variant="tonal" class="text-center">
            <div class="font-weight-bold">{{ t.register.successTitle }}</div>
            <div class="text-body-2 mt-1">{{ t.register.successMessage }}</div>
          </v-alert>
        </v-card-text>

        <v-card-text v-else>
          <v-form @submit.prevent="handleSubmit" ref="formRef">
            <v-text-field
              v-model="form.fullName"
              :label="t.register.fullName"
              :placeholder="t.register.fullNamePlaceholder"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              density="comfortable"
              :rules="[v => !!v || 'Required']"
              class="mb-2"
            />
            
            <v-text-field
              v-model="form.email"
              :label="t.register.email"
              :placeholder="t.register.emailPlaceholder"
              prepend-inner-icon="mdi-email"
              type="email"
              variant="outlined"
              density="comfortable"
              :rules="[v => !!v || 'Required', v => /.+@.+\..+/.test(v) || 'Invalid email']"
              class="mb-2"
            />
            
            <v-text-field
              v-model="form.password"
              :label="t.register.password"
              :placeholder="t.register.passwordPlaceholder"
              prepend-inner-icon="mdi-lock"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              density="comfortable"
              :rules="[v => !!v || 'Required', v => v.length >= 8 || t.register.passwordMinLength]"
              class="mb-2"
            />
            
            <v-text-field
              v-model="form.confirmPassword"
              :label="t.register.confirmPassword"
              :placeholder="t.register.confirmPasswordPlaceholder"
              prepend-inner-icon="mdi-lock-check"
              type="password"
              variant="outlined"
              density="comfortable"
              :rules="[v => v === form.password || t.register.passwordsNoMatch]"
              class="mb-4"
            />

            <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
              {{ error }}
            </v-alert>

            <v-btn type="submit" color="primary" block size="large" :loading="loading">
              {{ loading ? t.register.creating : t.register.createAccount }}
            </v-btn>
          </v-form>
        </v-card-text>

        <v-card-text class="text-center">
          <span class="text-body-2 text-medium-emphasis">{{ t.register.haveAccount }}</span>
          <router-link :to="{ name: 'login' }" class="text-primary text-decoration-none font-weight-medium ml-1">
            {{ t.register.signIn }}
          </router-link>
        </v-card-text>
      </v-card>
    </v-container>
  </AppLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const { t } = useLanguage()

const formRef = ref(null)
const loading = ref(false)
const showPassword = ref(false)
const error = ref('')
const success = ref(false)

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  error.value = ''
  loading.value = true

  try {
    const result = await auth.signUp(form.email, form.password)
    success.value = true
    
    if (!result.needsEmailConfirmation) {
      setTimeout(() => router.push({ name: 'interests' }), 2000)
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-card {
  border-color: rgba(160, 160, 184, 0.2) !important;
}
</style>

