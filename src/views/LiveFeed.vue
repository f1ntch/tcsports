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
          class="flex h-9 max-w-[200px] rounded-md border border-input bg-card px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option v-for="opt in sportOptions" :key="opt.id" :value="opt.id" class="bg-card text-card-foreground">{{ opt.name }}</option>
        </select>
      </div>

      <div v-if="loading" class="flex justify-center py-16">
        <Loader2 class="h-12 w-12 animate-spin text-primary" />
      </div>

      <template v-else-if="filteredArticles.length">
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <router-link
            v-for="article in filteredArticles"
            :key="article.id"
            :to="{ name: 'article', params: { id: article.id } }"
            class="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary hover:shadow-lg"
          >
            <div class="relative aspect-video overflow-hidden bg-muted">
              <img :src="article.imageUrl" :alt="article.title" class="h-full w-full object-cover transition-transform group-hover:scale-105" @error="(e) => e.target.src = DEFAULT_IMAGE" />
              <span class="absolute left-3 top-3 rounded-md bg-card/90 px-2 py-0.5 text-xs font-medium text-card-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {{ getSportName(article.sport) }}
              </span>
            </div>
            <div class="flex flex-1 flex-col p-4">
              <div class="mb-2 flex items-center gap-2">
                <span class="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  {{ getRelativeTime(article.createdAt) }}
                </span>
              </div>
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Search, Calendar, Clock, Loader2 } from 'lucide-vue-next'
import AppLayout from '@/components/AppLayout.vue'
import { useLanguage } from '@/composables/useLanguage'
import { supabase } from '@/lib/supabase'

const { t, language } = useLanguage()

const searchQuery = ref('')
const selectedSport = ref('all')
const articles = ref([])
const sports = ref([])
const loading = ref(true)
let refreshInterval = null

async function fetchArticles() {
  const lang = language.value || 'en'
  
  const { data, error } = await supabase
    .from('articles_processed')
    .select(`
      id,
      article_id,
      language_code,
      title,
      summary,
      image_url,
      created_at,
      articles!inner (
        id,
        indicator,
        source,
        sport_id,
        sports ( id, name )
      )
    `)
    .eq('language_code', lang)
    .eq('articles.indicator', 1)
    .order('created_at', { ascending: false })

  if (!error && data) {
    articles.value = data.map(item => ({
      id: item.article_id,
      title: item.title,
      summary: item.summary,
      createdAt: item.created_at,
      source: item.articles?.source,
      sport: item.articles?.sports || { id: null, name: 'Unknown' },
      imageUrl: item.image_url || getSportImage(item.articles?.sports?.name)
    }))
  }
  loading.value = false
}

async function fetchSports() {
  // Only fetch sports that have at least one article with indicator = 1
  const { data } = await supabase
    .from('sports')
    .select('id, name, articles!inner(id)')
    .eq('articles.indicator', 1)
    .order('name')
  if (data) {
    // Remove duplicates and extract just id/name
    const unique = [...new Map(data.map(s => [s.id, { id: s.id, name: s.name }])).values()]
    sports.value = unique
  }
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80'

function getSportImage(sportName) {
  const images = {
    'Soccer': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    'Football': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    'Basketball': 'https://cdn.nba.com/manage/2026/01/brooks-cavs-013026-scaled.jpg',
    'NBA': 'https://cdn.nba.com/manage/2026/01/brooks-cavs-013026-scaled.jpg',
    'Antwerp Giants': 'https://dam.beatvenues.be/a0WP500000HyatGMAR_original.jpg',
    'Tennis': 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
    'Cycling': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
    'Swimming': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80',
    'Formula 1': 'https://upload.wikimedia.org/wikipedia/commons/1/14/2010_Malaysian_GP_opening_lap.jpg',
    'IndyCar': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
    'Indy Car': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
    'Ice Hockey': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800&q=80',
    'American Football': 'https://shoc.com/cdn/shop/articles/pexels-football-wife-577822-1618200.jpg?v=1759771518',
    'Motorsport': 'https://images.unsplash.com/photo-1541348263662-e068662d82af?w=800&q=80',
    'Golf': 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80',
    'Auto Racing': 'https://images.unsplash.com/photo-1541348263662-e068662d82af?w=800&q=80',
    'Baseball': 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=800&q=80',
    'Skeleton': 'https://static01.nyt.com/images/2022/02/10/science/10olympics-skeleton1/10olympics-skeleton1-superJumbo.jpg',
    'Bobsled': 'https://static01.nyt.com/images/2022/02/10/science/10olympics-skeleton1/10olympics-skeleton1-superJumbo.jpg',
    'Luge': 'https://static01.nyt.com/images/2022/02/10/science/10olympics-skeleton1/10olympics-skeleton1-superJumbo.jpg',
    'Winter Sports': 'https://static01.nyt.com/images/2022/02/10/science/10olympics-skeleton1/10olympics-skeleton1-superJumbo.jpg',
    'Politics': 'https://s.yimg.com/ny/api/res/1.2/EDJoRtM0_spzU.yYaYLMVg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTQyNztjZj13ZWJw/https://s.yimg.com/os/creatr-uploaded-images/2025-07/3a4f3d80-68e0-11f0-bfef-851ca0fc17a5',
    'Skiing': 'https://assets.fis-ski.com/f/252177/1500x1000/e602de04fe/podium-levi.JPG/m/2880x0/smart',
    'Alpine Skiing': 'https://assets.fis-ski.com/f/252177/1500x1000/e602de04fe/podium-levi.JPG/m/2880x0/smart',
    'Ski World Cup': 'https://assets.fis-ski.com/f/252177/1500x1000/e602de04fe/podium-levi.JPG/m/2880x0/smart',
    'Cross-Country Skiing': 'https://assets.fis-ski.com/f/252177/1500x1000/e602de04fe/podium-levi.JPG/m/2880x0/smart',
    'Freestyle Skiing': 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&q=80',
  }
  return images[sportName] || DEFAULT_IMAGE
}

const sportOptions = computed(() => [
  { id: 'all', name: t.value.liveFeed?.allSports || 'All Sports' },
  ...sports.value.map(s => ({ id: s.id, name: s.name }))
])

const getSportName = (sport) => sport?.name || 'Unknown'

const filteredArticles = computed(() => {
  return articles.value.filter((article) => {
    const matchesSearch =
      !searchQuery.value ||
      article.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.summary?.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesSport = selectedSport.value === 'all' || article.sport?.id === selectedSport.value

    return matchesSearch && matchesSport
  })
})

watch(language, () => {
  fetchArticles()
})

onMounted(() => {
  fetchArticles()
  fetchSports()
  refreshInterval = setInterval(fetchArticles, 10000)
})

onUnmounted(() => {
  clearInterval(refreshInterval)
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
select {
  color-scheme: dark;
}
select option {
  background-color: hsl(var(--card));
  color: hsl(var(--card-foreground));
}
</style>
