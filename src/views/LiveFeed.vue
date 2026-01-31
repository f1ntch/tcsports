<template>
  <AppLayout>
    <v-container class="py-8">
      <div class="mb-8">
        <h1 class="text-h4 font-weight-bold">{{ t.liveFeed.title }}</h1>
        <p class="text-body-1 text-medium-emphasis mt-2">{{ t.liveFeed.subtitle }}</p>
      </div>

      <div class="d-flex flex-column flex-sm-row ga-4 mb-8">
        <v-text-field
          v-model="searchQuery"
          :placeholder="t.liveFeed.searchPlaceholder"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          class="flex-grow-1"
        />
        <v-select
          v-model="selectedSport"
          :items="sportOptions"
          item-title="name"
          item-value="id"
          prepend-inner-icon="mdi-filter"
          variant="outlined"
          density="comfortable"
          hide-details
          style="max-width: 200px;"
        />
      </div>

      <template v-if="filteredArticles.length">
        <v-row>
          <v-col v-for="article in filteredArticles" :key="article.id" cols="12" sm="6" lg="4">
            <v-card
              :to="{ name: 'article', params: { id: article.id } }"
              class="h-100 article-card"
            >
              <v-img :src="article.imageUrl" height="200" cover class="position-relative">
                <div class="position-absolute" style="top: 12px; left: 12px;">
                  <v-chip size="small" color="surface" variant="flat">
                    {{ getSportName(article.sport.nameKey) }}
                  </v-chip>
                </div>
                <div class="position-absolute" style="bottom: 12px; left: 12px;">
                  <v-chip size="small" color="primary" variant="flat">
                    {{ getRelativeTime(article.createdAt) }}
                  </v-chip>
                </div>
              </v-img>
              <v-card-text>
                <h2 class="text-h6 font-weight-bold mb-2 article-title">{{ article.title }}</h2>
                <p class="text-body-2 text-medium-emphasis mb-4 article-summary">{{ article.summary }}</p>
                <div class="d-flex ga-4 text-caption text-medium-emphasis">
                  <span class="d-flex align-center ga-1">
                    <v-icon size="14">mdi-calendar</v-icon>
                    {{ formatDate(article.createdAt) }}
                  </span>
                  <span class="d-flex align-center ga-1">
                    <v-icon size="14">mdi-clock-outline</v-icon>
                    {{ formatTime(article.createdAt) }}
                  </span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <div v-else class="d-flex flex-column align-center py-16 text-center">
        <v-avatar color="surface" size="80" class="mb-4">
          <v-icon size="40" color="medium-emphasis">mdi-magnify</v-icon>
        </v-avatar>
        <h3 class="text-h6 font-weight-bold">{{ t.liveFeed.noArticles }}</h3>
        <p class="text-body-2 text-medium-emphasis mt-1">{{ t.liveFeed.noArticlesDesc }}</p>
        <v-btn variant="outlined" class="mt-4" @click="clearFilters">
          {{ t.liveFeed.clearFilters }}
        </v-btn>
      </div>
    </v-container>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

const searchQuery = ref('')
const selectedSport = ref('all')

const mockArticles = [
  {
    id: '1',
    title: 'Champions League Final: Epic Showdown in Istanbul',
    summary: 'Two European giants clash in what promises to be one of the most exciting finals in recent memory.',
    createdAt: '2026-01-30T20:30:00Z',
    sport: { id: '1', nameKey: 'football' },
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
  },
  {
    id: '2',
    title: 'NBA All-Star Weekend: Records Shattered',
    summary: 'The annual showcase of basketball\'s finest talents delivered unforgettable moments.',
    createdAt: '2026-01-30T18:15:00Z',
    sport: { id: '2', nameKey: 'basketball' },
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
  },
  {
    id: '3',
    title: 'Australian Open: Underdog Reaches Semi-Finals',
    summary: 'In a stunning upset, the unseeded player defeats the world number two in straight sets.',
    createdAt: '2026-01-30T14:45:00Z',
    sport: { id: '3', nameKey: 'tennis' },
    imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
  },
  {
    id: '4',
    title: 'Tour de France Route Announced for 2026',
    summary: 'The legendary race will feature more mountain stages than ever before.',
    createdAt: '2026-01-30T12:00:00Z',
    sport: { id: '4', nameKey: 'cycling' },
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
  },
  {
    id: '5',
    title: 'Swimming World Championships: New World Record Set',
    summary: 'The 100m freestyle record that stood for over a decade has finally been broken.',
    createdAt: '2026-01-29T22:30:00Z',
    sport: { id: '5', nameKey: 'swimming' },
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80',
  },
  {
    id: '6',
    title: 'F1 Pre-Season Testing: Surprising Early Pace',
    summary: 'The newly restructured team shows unexpected speed during testing in Bahrain.',
    createdAt: '2026-01-29T19:00:00Z',
    sport: { id: '6', nameKey: 'formula1' },
    imageUrl: 'https://images.unsplash.com/photo-1541348263662-e068662d82af?w=800&q=80',
  },
]

const mockUserInterests = ['1', '2', '6']

const sportOptions = computed(() => [
  { id: 'all', name: t.value.liveFeed.allSports },
  { id: 'my-interests', name: t.value.liveFeed.myInterests },
  { id: '1', name: t.value.sports.football },
  { id: '2', name: t.value.sports.basketball },
  { id: '3', name: t.value.sports.tennis },
  { id: '4', name: t.value.sports.cycling },
  { id: '5', name: t.value.sports.swimming },
  { id: '6', name: t.value.sports.formula1 },
])

const getSportName = (nameKey) => t.value.sports[nameKey] || nameKey

const filteredArticles = computed(() => {
  return mockArticles.filter(article => {
    const matchesSearch = !searchQuery.value ||
      article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.value.toLowerCase())

    let matchesSport = selectedSport.value === 'all'
    if (selectedSport.value === 'my-interests') {
      matchesSport = mockUserInterests.includes(article.sport.id)
    } else if (selectedSport.value !== 'all') {
      matchesSport = article.sport.id === selectedSport.value
    }

    return matchesSearch && matchesSport
  })
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const getRelativeTime = (dateString) => {
  const diffHours = Math.floor((Date.now() - new Date(dateString)) / 3600000)
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedSport.value = 'all'
}
</script>

<style scoped>
.article-card { 
  transition: all 0.2s ease;
  border-color: rgba(160, 160, 184, 0.2) !important;
}
.article-card:hover { 
  border-color: rgba(168, 85, 247, 0.5) !important;
  box-shadow: 0 4px 20px rgba(168, 85, 247, 0.1) !important; 
}
.article-title { 
  display: -webkit-box; 
  -webkit-line-clamp: 2; 
  line-clamp: 2;
  -webkit-box-orient: vertical; 
  overflow: hidden;
}
.article-summary {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
