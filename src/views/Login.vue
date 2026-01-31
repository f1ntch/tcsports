<template>
  <AppLayout>
    <v-container class="fill-height d-flex align-center justify-center py-12">
      <v-card max-width="450" width="100%" class="pa-4 auth-card" variant="outlined">
        <v-card-text class="text-center pb-0">
          <span class="text-h3 font-weight-bold text-primary">,,,</span>
          <h1 class="text-h5 font-weight-bold mt-2">{{ t.login.title }}</h1>
          <p class="text-body-2 text-medium-emphasis mt-1">{{ t.login.subtitle }}</p>
        </v-card-text>

        <v-card-text>
          <v-form @submit.prevent="handleSubmit" ref="formRef">
            <v-text-field
              v-model="form.email"
              :label="t.login.email"
              prepend-inner-icon="mdi-email"
              type="email"
              variant="outlined"
              density="comfortable"
              :rules="[v => !!v || 'Required']"
              class="mb-2"
            />
            
            <v-text-field
              v-model="form.password"
              :label="t.login.password"
              prepend-inner-icon="mdi-lock"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              density="comfortable"
              :rules="[v => !!v || 'Required']"
              class="mb-4"
            />

            <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
              {{ error }}
            </v-alert>

            <v-btn type="submit" color="primary" block size="large" :loading="loading">
              {{ t.login.signIn }}
            </v-btn>
          </v-form>
        </v-card-text>

        <v-card-text class="text-center">
          <span class="text-body-2 text-medium-emphasis">{{ t.login.noAccount }}</span>
          <router-link :to="{ name: 'register' }" class="text-primary text-decoration-none font-weight-medium ml-1">
            {{ t.login.register }}
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

const form = reactive({
  email: '',
  password: '',
})

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

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

<style scoped>
.auth-card {
  border-color: rgba(160, 160, 184, 0.2) !important;
}
</style>
