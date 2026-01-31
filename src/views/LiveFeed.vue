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

      <div v-if="loading" class="d-flex justify-center py-16">
        <v-progress-circular indeterminate color="primary" size="48" />
      </div>

      <template v-else-if="filteredArticles.length">
        <v-row>
          <v-col v-for="article in filteredArticles" :key="article.id" cols="12" sm="6" lg="4">
            <v-card
              :to="{ name: 'article', params: { id: article.id } }"
              class="h-100 article-card"
            >
              <v-img :src="article.imageUrl" height="200" cover class="position-relative">
                <div class="position-absolute" style="top: 12px; left: 12px;">
                  <v-chip size="small" color="surface" variant="flat">
                    {{ getSportName(article.sport) }}
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
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
      imageUrl: getSportImage(item.articles?.sports?.name)
    }))
  }
  loading.value = false
}

async function fetchSports() {
  const { data } = await supabase.from('sports').select('id, name').order('name')
  if (data) sports.value = data
}

function getSportImage(sportName) {
  const images = {
    'Soccer': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    'Football': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    'Basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    'Tennis': 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
    'Cycling': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
    'Swimming': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80',
    'Formula 1': 'https://images.unsplash.com/photo-1541348263662-e068662d82af?w=800&q=80',
    'Ice Hockey': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800&q=80',
    'American Football': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80',
  }
  return images[sportName] || 'https://images.unsplash.com/photo-1461896836934- voices?w=800&q=80'
}

const sportOptions = computed(() => [
  { id: 'all', name: t.value.liveFeed?.allSports || 'All Sports' },
  ...sports.value.map(s => ({ id: s.id, name: s.name }))
])

const getSportName = (sport) => sport?.name || 'Unknown'

const filteredArticles = computed(() => {
  return articles.value.filter(article => {
    const matchesSearch = !searchQuery.value ||
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
