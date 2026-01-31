<template>
  <AppLayout>
    <v-container class="py-12">
      <div class="mx-auto" style="max-width: 1000px;">
        <div class="text-center mb-8">
          <h1 class="text-h4 text-md-h3 font-weight-bold">{{ t.interests.title }}</h1>
          <p class="text-body-1 text-medium-emphasis mt-2">{{ t.interests.subtitle }}</p>
        </div>

        <div v-if="saved" class="d-flex justify-center">
          <v-card max-width="400" class="text-center pa-8">
            <v-icon color="primary" size="64" class="mb-4">mdi-check-circle</v-icon>
            <h2 class="text-h5 font-weight-bold">{{ t.interests.successTitle }}</h2>
            <p class="text-body-2 text-medium-emphasis mt-2">{{ t.interests.successMessage }}</p>
          </v-card>
        </div>

        <template v-else>
          <v-row>
            <v-col v-for="sport in sports" :key="sport.id" cols="12" sm="6" lg="4">
              <v-card
                variant="outlined"
                class="h-100 cursor-pointer sport-card"
                :class="{ 'selected': isSelected(sport.id) }"
                @click="toggleSport(sport.id)"
              >
                <v-card-text class="pa-5">
                  <div class="d-flex align-center justify-space-between mb-4">
                    <span class="text-subtitle-1 font-weight-bold">{{ getSportName(sport.nameKey) }}</span>
                    <div 
                      class="checkbox-circle"
                      :class="{ 'checked': isSelected(sport.id) }"
                    >
                      <v-icon v-if="isSelected(sport.id)" size="14" color="white">mdi-check</v-icon>
                    </div>
                  </div>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    {{ sport.description }}
                  </p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <div class="d-flex flex-column align-center mt-8">
            <p class="text-body-2 text-medium-emphasis mb-4" v-if="selectedSports.length">
              {{ selectedSports.length }} {{ t.interests.selected }}
            </p>
            <v-btn
              color="primary"
              size="large"
              min-width="200"
              rounded="pill"
              :loading="loading"
              :disabled="!selectedSports.length"
              @click="handleSave"
            >
              {{ loading ? t.interests.saving : t.interests.saveInterests }}
            </v-btn>
          </div>
        </template>
      </div>
    </v-container>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
  { id: 4, nameKey: 'cycling', description: 'Tour de France, Giro d\'Italia, and more' },
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
  await new Promise(r => setTimeout(r, 1500))
  loading.value = false
  saved.value = true
  setTimeout(() => router.push({ name: 'home' }), 2000)
}
</script>

<style scoped>
.cursor-pointer { cursor: pointer; }

.sport-card { 
  transition: all 0.2s ease;
  border-color: rgba(160, 160, 184, 0.2) !important;
}

.sport-card:hover { 
  border-color: rgba(168, 85, 247, 0.5) !important; 
}

.sport-card.selected { 
  border-color: #A855F7 !important;
  background: rgba(168, 85, 247, 0.05) !important;
  box-shadow: 0 0 0 1px #A855F7 !important;
}

.checkbox-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid rgba(160, 160, 184, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.checkbox-circle.checked {
  background: #A855F7;
  border-color: #A855F7;
}
</style>
