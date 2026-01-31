<template>
  <AppLayout>
    <v-container class="py-12" style="max-width: 700px;">
      <div class="text-center mb-8">
        <h1 class="text-h4 font-weight-bold">{{ t.profile.title }}</h1>
        <p class="text-body-1 text-medium-emphasis mt-2">{{ t.profile.subtitle }}</p>
      </div>

      <div class="d-flex flex-column ga-6">
        <v-card variant="outlined" class="profile-card">
          <v-card-title class="d-flex align-center ga-2">
            <v-icon>mdi-account</v-icon>
            {{ t.profile.accountInfo }}
          </v-card-title>
          <v-card-subtitle>{{ t.profile.accountInfoDesc }}</v-card-subtitle>
          <v-card-text class="pt-4">
            <v-row>
              <v-col cols="12" sm="6">
                <div class="text-caption text-medium-emphasis">{{ t.profile.fullName }}</div>
                <div class="font-weight-medium">{{ mockUser.fullName }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-medium-emphasis">{{ t.profile.email }}</div>
                <div class="font-weight-medium">{{ mockUser.email }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card variant="outlined" class="profile-card">
          <v-card-title class="d-flex align-center ga-2">
            <v-icon>mdi-lock</v-icon>
            {{ t.profile.changePassword }}
          </v-card-title>
          <v-card-subtitle>{{ t.profile.changePasswordDesc }}</v-card-subtitle>
          <v-card-text class="pt-4">
            <v-form @submit.prevent="handleChangePassword" ref="formRef">
              <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
                {{ error }}
              </v-alert>

              <v-alert v-if="success" type="success" variant="tonal" class="mb-4">
                <v-icon start>mdi-check</v-icon>
                {{ t.profile.successMessage }}
              </v-alert>

              <v-text-field
                v-model="currentPassword"
                :label="t.profile.currentPassword"
                :placeholder="t.profile.currentPasswordPlaceholder"
                :type="showCurrent ? 'text' : 'password'"
                :append-inner-icon="showCurrent ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showCurrent = !showCurrent"
                variant="outlined"
                density="comfortable"
                :rules="[v => !!v || 'Required']"
                class="mb-2"
              />

              <v-text-field
                v-model="newPassword"
                :label="t.profile.newPassword"
                :placeholder="t.profile.newPasswordPlaceholder"
                :type="showNew ? 'text' : 'password'"
                :append-inner-icon="showNew ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showNew = !showNew"
                variant="outlined"
                density="comfortable"
                :rules="[v => !!v || 'Required', v => v.length >= 8 || t.profile.passwordMinLength]"
                class="mb-2"
              />

              <v-text-field
                v-model="confirmPassword"
                :label="t.profile.confirmNewPassword"
                :placeholder="t.profile.confirmNewPasswordPlaceholder"
                :type="showConfirm ? 'text' : 'password'"
                :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showConfirm = !showConfirm"
                variant="outlined"
                density="comfortable"
                :rules="[v => v === newPassword || t.profile.passwordsNoMatch]"
                class="mb-4"
              />

              <v-btn type="submit" color="primary" block :loading="loading">
                {{ loading ? t.profile.updating : t.profile.updatePassword }}
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </div>
    </v-container>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

const mockUser = {
  email: 'user@example.com',
  fullName: 'John Doe',
}

const formRef = ref(null)
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
  const { valid } = await formRef.value.validate()
  if (!valid) return

  error.value = ''
  success.value = false
  loading.value = true

  await new Promise(r => setTimeout(r, 1000))

  loading.value = false
  success.value = true
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''

  setTimeout(() => success.value = false, 3000)
}
</script>

<style scoped>
.profile-card {
  border-color: rgba(160, 160, 184, 0.2) !important;
}
</style>

