<template>
  <AppLayout>
    <div class="container mx-auto max-w-[1000px] px-4 py-12">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold md:text-3xl">{{ t.interests.title }}</h1>
        <p class="mt-2 text-muted-foreground">{{ t.interests.subtitle }}</p>
      </div>

      <div v-if="saved" class="flex justify-center">
        <div class="w-full max-w-[400px] rounded-xl border border-border bg-card p-8 text-center">
          <CheckCircle class="mx-auto mb-4 h-16 w-16 text-primary" />
          <h2 class="text-xl font-semibold">{{ t.interests.successTitle }}</h2>
          <p class="mt-2 text-sm text-muted-foreground">{{ t.interests.successMessage }}</p>
        </div>
      </div>

      <template v-else>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <button
            v-for="sport in sports"
            :key="sport.id"
            type="button"
            class="flex flex-col rounded-xl border bg-card p-5 text-left transition-colors hover:border-primary/50"
            :class="[
              isSelected(sport.id)
                ? 'border-primary bg-primary/5 shadow-[0_0_0_1px_var(--primary)]'
                : 'border-border',
            ]"
            @click="toggleSport(sport.id)"
          >
            <div class="mb-4 flex items-center justify-between">
              <span class="font-semibold">{{ getSportName(sport.nameKey) }}</span>
              <div
                class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                :class="isSelected(sport.id) ? 'border-primary bg-primary' : 'border-muted-foreground/30'"
              >
                <Check v-if="isSelected(sport.id)" class="h-3.5 w-3.5 text-primary-foreground" />
              </div>
            </div>
            <p class="text-sm text-muted-foreground">{{ sport.description }}</p>
          </button>
        </div>

        <div class="mt-8 flex flex-col items-center">
          <p v-if="selectedSports.length" class="mb-4 text-sm text-muted-foreground">
            {{ selectedSports.length }} {{ t.interests.selected }}
          </p>
          <button
            type="button"
            class="inline-flex min-w-[200px] items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            :disabled="!selectedSports.length || loading"
            @click="handleSave"
          >
            <span v-if="loading" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            {{ loading ? t.interests.saving : t.interests.saveInterests }}
          </button>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { CheckCircle, Check } from 'lucide-vue-next'
import AppLayout from '@/components/AppLayout.vue'
import { useLanguage } from '@/composables/useLanguage'

const router = useRouter()
const { t } = useLanguage()

const selectedSports = ref([])
const loading = ref(false)
const saved = ref(false)

const sports = [
  { id: 1, nameKey: 'football', description: 'Soccer leagues and tournaments worldwide' },
  { id: 2, nameKey: 'basketball', description: 'NBA, EuroLeague, and international basketball' },
  { id: 3, nameKey: 'tennis', description: 'Grand Slams, ATP, and WTA tours' },
  { id: 4, nameKey: 'cycling', description: "Tour de France, Giro d'Italia, and more" },
  { id: 5, nameKey: 'swimming', description: 'Olympics, World Championships, and swimming news' },
  { id: 6, nameKey: 'formula1', description: 'F1 races, teams, and drivers' },
  { id: 7, nameKey: 'golf', description: 'PGA Tour, majors, and golf news' },
  { id: 8, nameKey: 'rugby', description: 'Six Nations, World Cup, and rugby leagues' },
  { id: 9, nameKey: 'baseball', description: 'MLB and international baseball leagues' },
  { id: 10, nameKey: 'hockey', description: 'NHL and international ice hockey' },
  { id: 11, nameKey: 'volleyball', description: 'International volleyball and beach volleyball' },
  { id: 12, nameKey: 'boxing', description: 'Boxing matches, fighters, and news' },
]

const getSportName = (nameKey) => t.value.sports[nameKey] || nameKey

const isSelected = (id) => selectedSports.value.includes(id)

const toggleSport = (id) => {
  const idx = selectedSports.value.indexOf(id)
  if (idx >= 0) {
    selectedSports.value.splice(idx, 1)
  } else {
    selectedSports.value.push(id)
  }
}

const handleSave = async () => {
  if (!selectedSports.value.length) return
  loading.value = true
  await new Promise((r) => setTimeout(r, 1500))
  loading.value = false
  saved.value = true
  setTimeout(() => router.push({ name: 'home' }), 2000)
}
</script>
