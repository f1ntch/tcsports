<template>
  <AppLayout>
    <v-container class="py-8">
      <div class="mb-8">
        <div class="d-flex align-center ga-3 mb-2">
          <v-icon color="primary" size="32">mdi-archive</v-icon>
          <h1 class="text-h4 font-weight-bold">{{ t.archive.title }}</h1>
        </div>
        <p class="text-body-1 text-medium-emphasis">{{ t.archive.subtitle }}</p>
      </div>

      <template v-if="archivedArticles.length">
        <p class="text-body-2 text-medium-emphasis mb-4">
          {{ archivedArticles.length }} article{{ archivedArticles.length !== 1 ? 's' : '' }}
        </p>

        <v-row>
          <v-col v-for="article in archivedArticles" :key="article.id" cols="12" sm="6" lg="4">
            <v-card class="h-100 article-card">
              <router-link :to="{ name: 'article', params: { id: article.id } }" class="text-decoration-none">
                <v-img :src="article.imageUrl" height="180" cover class="position-relative">
                  <div class="position-absolute" style="top: 12px; left: 12px;">
                    <v-chip size="small" color="surface" variant="flat">
                      {{ getSportName(article.sport.nameKey) }}
                    </v-chip>
                  </div>
                  <div class="position-absolute" style="top: 12px; right: 12px;">
                    <v-chip size="small" color="primary" variant="flat">
                      {{ getRelativeTime(article.createdAt) }}
                    </v-chip>
                  </div>
                </v-img>
              </router-link>
              
              <v-card-text>
                <router-link :to="{ name: 'article', params: { id: article.id } }" class="text-decoration-none">
                  <h3 class="text-h6 font-weight-bold mb-2 article-title text-high-emphasis">{{ article.title }}</h3>
                  <p class="text-body-2 text-medium-emphasis mb-4 article-summary">{{ article.summary }}</p>
                </router-link>
                
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex ga-3 text-caption text-medium-emphasis">
                    <span class="d-flex align-center ga-1">
                      <v-icon size="14">mdi-calendar</v-icon>
                      {{ formatDate(article.createdAt) }}
                    </span>
                    <span class="d-flex align-center ga-1">
                      <v-icon size="14">mdi-clock-outline</v-icon>
                      {{ formatTime(article.createdAt) }}
                    </span>
                  </div>
                  
                  <v-btn
                    variant="text"
                    color="error"
                    size="small"
                    @click="removeFromArchive(article.id)"
                  >
                    <v-icon start size="16">mdi-delete</v-icon>
                    {{ t.archive.remove }}
                  </v-btn>
                </div>
                
                <v-divider class="my-3" />
                <span class="text-caption text-medium-emphasis">
                  {{ t.archive.archivedOn }} {{ formatDate(article.archivedAt) }}
                </span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <v-card v-else class="pa-12 text-center">
        <v-icon color="medium-emphasis" size="64" class="mb-4">mdi-archive-off</v-icon>
        <h2 class="text-h5 font-weight-bold mb-2">{{ t.archive.emptyTitle }}</h2>
        <p class="text-body-1 text-medium-emphasis mb-6" style="max-width: 400px; margin: 0 auto;">
          {{ t.archive.emptyDesc }}
        </p>
        <v-btn :to="{ name: 'live' }" color="primary">
          {{ t.archive.browseFeed }}
        </v-btn>
      </v-card>
    </v-container>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

const allArticles = [
  {
    id: '1',
    title: 'Champions League Final: Epic Showdown in Istanbul',
    summary: 'Two European giants clash in what promises to be one of the most exciting finals.',
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
    summary: 'In a stunning upset, the unseeded player defeats the world number two.',
    createdAt: '2026-01-30T14:45:00Z',
    sport: { id: '3', nameKey: 'tennis' },
    imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
  },
  {
    id: '5',
    title: 'Swimming World Championships: New World Record Set',
    summary: 'The 100m freestyle record that stood for over a decade has finally been broken.',
    createdAt: '2026-01-29T22:30:00Z',
    sport: { id: '5', nameKey: 'swimming' },
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80',
  },
]

const archivedIds = ref([
  { articleId: '2', archivedAt: '2026-01-31T10:30:00Z' },
  { articleId: '5', archivedAt: '2026-01-31T09:15:00Z' },
  { articleId: '3', archivedAt: '2026-01-30T22:00:00Z' },
])

const archivedArticles = computed(() => {
  return archivedIds.value
    .sort((a, b) => new Date(b.archivedAt) - new Date(a.archivedAt))
    .map(archived => {
      const article = allArticles.find(a => a.id === archived.articleId)
      return article ? { ...article, archivedAt: archived.archivedAt } : null
    })
    .filter(Boolean)
})

const getSportName = (nameKey) => t.value.sports[nameKey] || nameKey

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

const removeFromArchive = (articleId) => {
  archivedIds.value = archivedIds.value.filter(a => a.articleId !== articleId)
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
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

