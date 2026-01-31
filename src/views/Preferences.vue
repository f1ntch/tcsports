<template>
  <AppLayout>
    <v-container class="py-12" style="max-width: 800px;">
      <div class="mb-8">
        <h1 class="text-h4 font-weight-bold">{{ t.preferences.title }}</h1>
        <p class="text-body-1 text-medium-emphasis mt-2">{{ t.preferences.subtitle }}</p>
      </div>

      <div class="d-flex flex-column ga-6">
        <v-card variant="outlined" class="pref-card">
          <v-card-title class="d-flex align-center ga-2">
            <v-icon color="primary">mdi-bell</v-icon>
            {{ t.preferences.notifications }}
          </v-card-title>
          <v-card-subtitle>{{ t.preferences.notificationsDesc }}</v-card-subtitle>
          <v-card-text class="pt-4">
            <div class="d-flex flex-column ga-4">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="font-weight-medium">{{ t.preferences.emailNotifications }}</div>
                  <div class="text-caption text-medium-emphasis">{{ t.preferences.emailNotificationsDesc }}</div>
                </div>
                <v-switch v-model="prefs.emailNotifications" color="primary" hide-details density="compact" />
              </div>
              
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="font-weight-medium">{{ t.preferences.pushNotifications }}</div>
                  <div class="text-caption text-medium-emphasis">{{ t.preferences.pushNotificationsDesc }}</div>
                </div>
                <v-switch v-model="prefs.pushNotifications" color="primary" hide-details density="compact" />
              </div>
              
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="font-weight-medium">{{ t.preferences.breakingNews }}</div>
                  <div class="text-caption text-medium-emphasis">{{ t.preferences.breakingNewsDesc }}</div>
                </div>
                <v-switch v-model="prefs.breakingNews" color="primary" hide-details density="compact" />
              </div>
              
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="font-weight-medium">{{ t.preferences.weeklyDigest }}</div>
                  <div class="text-caption text-medium-emphasis">{{ t.preferences.weeklyDigestDesc }}</div>
                </div>
                <v-switch v-model="prefs.weeklyDigest" color="primary" hide-details density="compact" />
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card variant="outlined" class="pref-card">
          <v-card-title class="d-flex align-center ga-2">
            <v-icon color="primary">mdi-newspaper</v-icon>
            {{ t.preferences.content }}
          </v-card-title>
          <v-card-subtitle>{{ t.preferences.contentDesc }}</v-card-subtitle>
          <v-card-text class="pt-4">
            <div class="d-flex flex-column ga-4">
              <div class="d-flex align-center justify-space-between">
                <div class="font-weight-medium">{{ t.preferences.articlesPerPage }}</div>
                <v-select
                  v-model="prefs.articlesPerPage"
                  :items="['5', '10', '20', '50']"
                  variant="outlined"
                  density="compact"
                  hide-details
                  style="max-width: 100px;"
                />
              </div>
              
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="font-weight-medium">{{ t.preferences.autoPlayVideos }}</div>
                  <div class="text-caption text-medium-emphasis">{{ t.preferences.autoPlayVideosDesc }}</div>
                </div>
                <v-switch v-model="prefs.autoPlayVideos" color="primary" hide-details density="compact" />
              </div>
              
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="font-weight-medium">{{ t.preferences.showLiveScores }}</div>
                  <div class="text-caption text-medium-emphasis">{{ t.preferences.showLiveScoresDesc }}</div>
                </div>
                <v-switch v-model="prefs.showScores" color="primary" hide-details density="compact" />
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card variant="outlined" class="pref-card">
          <v-card-title class="d-flex align-center ga-2">
            <v-icon color="primary">mdi-earth</v-icon>
            {{ t.preferences.privacy }}
          </v-card-title>
          <v-card-subtitle>{{ t.preferences.privacyDesc }}</v-card-subtitle>
          <v-card-text class="pt-4">
            <div class="d-flex flex-column ga-4">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="font-weight-medium">{{ t.preferences.shareActivity }}</div>
                  <div class="text-caption text-medium-emphasis">{{ t.preferences.shareActivityDesc }}</div>
                </div>
                <v-switch v-model="prefs.shareActivity" color="primary" hide-details density="compact" />
              </div>
              
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="font-weight-medium">{{ t.preferences.personalizedAds }}</div>
                  <div class="text-caption text-medium-emphasis">{{ t.preferences.personalizedAdsDesc }}</div>
                </div>
                <v-switch v-model="prefs.personalizedAds" color="primary" hide-details density="compact" />
              </div>
            </div>
          </v-card-text>
        </v-card>

        <div class="d-flex justify-end">
          <v-btn color="primary" min-width="140" @click="handleSave" :loading="saving">
            <v-icon start v-if="saved">mdi-check</v-icon>
            <v-icon start v-else>mdi-content-save</v-icon>
            {{ saved ? t.preferences.successTitle : t.preferences.savePreferences }}
          </v-btn>
        </div>
      </div>
    </v-container>
  </AppLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

const prefs = reactive({
  emailNotifications: true,
  pushNotifications: false,
  breakingNews: true,
  weeklyDigest: true,
  articlesPerPage: '10',
  autoPlayVideos: false,
  showScores: true,
  shareActivity: false,
  personalizedAds: false,
})

const saving = ref(false)
const saved = ref(false)

const handleSave = async () => {
  saving.value = true
  await new Promise(r => setTimeout(r, 1000))
  saving.value = false
  saved.value = true
  setTimeout(() => saved.value = false, 3000)
}
</script>

<style scoped>
.pref-card {
  border-color: rgba(160, 160, 184, 0.2) !important;
}
</style>

