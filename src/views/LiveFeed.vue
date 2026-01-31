<template>
  <AppLayout>
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold md:text-3xl">{{ t.liveFeed.title }}</h1>
        <p class="mt-2 text-muted-foreground">{{ t.liveFeed.subtitle }}</p>
      </div>

      <div class="mb-8 flex flex-col gap-4 sm:flex-row">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            v-model="searchQuery"
            type="text"
            class="flex h-9 w-full rounded-md border border-input bg-transparent py-1 pl-9 pr-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            :placeholder="t.liveFeed.searchPlaceholder"
          />
        </div>
        <select
          v-model="selectedSport"
          class="flex h-9 max-w-[200px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option v-for="opt in sportOptions" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
        </select>
      </div>

      <template v-if="filteredArticles.length">
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <router-link
            v-for="article in filteredArticles"
            :key="article.id"
            :to="{ name: 'article', params: { id: article.id } }"
            class="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-colors hover:border-primary/50 hover:shadow-md"
          >
            <div class="relative aspect-video overflow-hidden bg-muted">
              <img :src="article.imageUrl" :alt="article.title" class="h-full w-full object-cover" />
              <span class="absolute left-3 top-3 rounded-md bg-card/90 px-2 py-0.5 text-xs font-medium">
                {{ getSportName(article.sport.nameKey) }}
              </span>
              <span class="absolute bottom-3 left-3 rounded-md bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                {{ getRelativeTime(article.createdAt) }}
              </span>
            </div>
            <div class="flex flex-1 flex-col p-4">
              <h2 class="mb-2 line-clamp-2 text-lg font-semibold text-card-foreground group-hover:text-primary">
                {{ article.title }}
              </h2>
              <p class="mb-4 line-clamp-3 flex-1 text-sm text-muted-foreground">{{ article.summary }}</p>
              <div class="flex gap-4 text-xs text-muted-foreground">
                <span class="flex items-center gap-1">
                  <Calendar class="h-3.5 w-3.5" />
                  {{ formatDate(article.createdAt) }}
                </span>
                <span class="flex items-center gap-1">
                  <Clock class="h-3.5 w-3.5" />
                  {{ formatTime(article.createdAt) }}
                </span>
              </div>
            </div>
          </router-link>
        </div>
      </template>

      <div v-else class="flex flex-col items-center py-16 text-center">
        <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Search class="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 class="text-lg font-semibold">{{ t.liveFeed.noArticles }}</h3>
        <p class="mt-1 text-sm text-muted-foreground">{{ t.liveFeed.noArticlesDesc }}</p>
        <button
          type="button"
          class="mt-4 inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground"
          @click="clearFilters"
        >
          {{ t.liveFeed.clearFilters }}
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Calendar, Clock } from 'lucide-vue-next'
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
    summary: "The annual showcase of basketball's finest talents delivered unforgettable moments.",
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
  return mockArticles.filter((article) => {
    const matchesSearch =
      !searchQuery.value ||
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
