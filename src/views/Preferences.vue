<template>
  <AppLayout>
    <div class="container mx-auto max-w-[800px] px-4 py-12">
      <div class="mb-8">
        <h1 class="text-2xl font-bold md:text-3xl">{{ t.preferences.title }}</h1>
        <p class="mt-2 text-muted-foreground">{{ t.preferences.subtitle }}</p>
      </div>

      <div class="flex flex-col gap-6">
        <div class="rounded-xl border border-border bg-card p-6">
          <div class="mb-1 flex items-center gap-2">
            <Bell class="h-5 w-5 text-primary" />
            <h2 class="text-lg font-semibold">{{ t.preferences.notifications }}</h2>
          </div>
          <p class="mb-4 text-sm text-muted-foreground">{{ t.preferences.notificationsDesc }}</p>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">{{ t.preferences.emailNotifications }}</p>
                <p class="text-xs text-muted-foreground">{{ t.preferences.emailNotificationsDesc }}</p>
              </div>
              <button
                type="button"
                role="switch"
                class="relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                :class="prefs.emailNotifications ? 'bg-primary' : 'bg-input'"
                @click="prefs.emailNotifications = !prefs.emailNotifications"
              >
                <span
                  class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform"
                  :class="prefs.emailNotifications ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">{{ t.preferences.pushNotifications }}</p>
                <p class="text-xs text-muted-foreground">{{ t.preferences.pushNotificationsDesc }}</p>
              </div>
              <button
                type="button"
                role="switch"
                class="relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                :class="prefs.pushNotifications ? 'bg-primary' : 'bg-input'"
                @click="prefs.pushNotifications = !prefs.pushNotifications"
              >
                <span
                  class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform"
                  :class="prefs.pushNotifications ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">{{ t.preferences.breakingNews }}</p>
                <p class="text-xs text-muted-foreground">{{ t.preferences.breakingNewsDesc }}</p>
              </div>
              <button
                type="button"
                role="switch"
                class="relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                :class="prefs.breakingNews ? 'bg-primary' : 'bg-input'"
                @click="prefs.breakingNews = !prefs.breakingNews"
              >
                <span
                  class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform"
                  :class="prefs.breakingNews ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">{{ t.preferences.weeklyDigest }}</p>
                <p class="text-xs text-muted-foreground">{{ t.preferences.weeklyDigestDesc }}</p>
              </div>
              <button
                type="button"
                role="switch"
                class="relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                :class="prefs.weeklyDigest ? 'bg-primary' : 'bg-input'"
                @click="prefs.weeklyDigest = !prefs.weeklyDigest"
              >
                <span
                  class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform"
                  :class="prefs.weeklyDigest ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-border bg-card p-6">
          <div class="mb-1 flex items-center gap-2">
            <Newspaper class="h-5 w-5 text-primary" />
            <h2 class="text-lg font-semibold">{{ t.preferences.content }}</h2>
          </div>
          <p class="mb-4 text-sm text-muted-foreground">{{ t.preferences.contentDesc }}</p>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <p class="font-medium">{{ t.preferences.articlesPerPage }}</p>
              <select
                v-model="prefs.articlesPerPage"
                class="h-9 max-w-[100px] rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">{{ t.preferences.autoPlayVideos }}</p>
                <p class="text-xs text-muted-foreground">{{ t.preferences.autoPlayVideosDesc }}</p>
              </div>
              <button
                type="button"
                role="switch"
                class="relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                :class="prefs.autoPlayVideos ? 'bg-primary' : 'bg-input'"
                @click="prefs.autoPlayVideos = !prefs.autoPlayVideos"
              >
                <span
                  class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform"
                  :class="prefs.autoPlayVideos ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">{{ t.preferences.showLiveScores }}</p>
                <p class="text-xs text-muted-foreground">{{ t.preferences.showLiveScoresDesc }}</p>
              </div>
              <button
                type="button"
                role="switch"
                class="relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                :class="prefs.showScores ? 'bg-primary' : 'bg-input'"
                @click="prefs.showScores = !prefs.showScores"
              >
                <span
                  class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform"
                  :class="prefs.showScores ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-border bg-card p-6">
          <div class="mb-1 flex items-center gap-2">
            <Globe class="h-5 w-5 text-primary" />
            <h2 class="text-lg font-semibold">{{ t.preferences.privacy }}</h2>
          </div>
          <p class="mb-4 text-sm text-muted-foreground">{{ t.preferences.privacyDesc }}</p>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">{{ t.preferences.shareActivity }}</p>
                <p class="text-xs text-muted-foreground">{{ t.preferences.shareActivityDesc }}</p>
              </div>
              <button
                type="button"
                role="switch"
                class="relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                :class="prefs.shareActivity ? 'bg-primary' : 'bg-input'"
                @click="prefs.shareActivity = !prefs.shareActivity"
              >
                <span
                  class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform"
                  :class="prefs.shareActivity ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">{{ t.preferences.personalizedAds }}</p>
                <p class="text-xs text-muted-foreground">{{ t.preferences.personalizedAdsDesc }}</p>
              </div>
              <button
                type="button"
                role="switch"
                class="relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                :class="prefs.personalizedAds ? 'bg-primary' : 'bg-input'"
                @click="prefs.personalizedAds = !prefs.personalizedAds"
              >
                <span
                  class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform"
                  :class="prefs.personalizedAds ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="button"
            class="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            :disabled="saving"
            @click="handleSave"
          >
            <Check v-if="saved" class="h-4 w-4" />
            <Save v-else class="h-4 w-4" />
            {{ saved ? t.preferences.successTitle : t.preferences.savePreferences }}
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Bell, Newspaper, Globe, Check, Save } from 'lucide-vue-next'
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
  await new Promise((r) => setTimeout(r, 1000))
  saving.value = false
  saved.value = true
  setTimeout(() => (saved.value = false), 3000)
}
</script>
