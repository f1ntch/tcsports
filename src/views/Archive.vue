<template>
  <AppLayout>
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <div class="mb-2 flex items-center gap-3">
          <Archive class="h-8 w-8 text-primary" />
          <h1 class="text-2xl font-bold md:text-3xl">{{ t.archive.title }}</h1>
        </div>
        <p class="text-muted-foreground">{{ t.archive.subtitle }}</p>
      </div>

      <template v-if="archivedArticles.length">
        <p class="mb-4 text-sm text-muted-foreground">
          {{ archivedArticles.length }} article{{ archivedArticles.length !== 1 ? 's' : '' }}
        </p>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="article in archivedArticles"
            :key="article.id"
            class="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-colors hover:border-primary/50"
          >
            <router-link :to="{ name: 'article', params: { id: article.id } }">
              <div class="relative aspect-video overflow-hidden bg-muted">
                <img :src="article.imageUrl" :alt="article.title" class="h-full w-full object-cover" />
                <span class="absolute left-3 top-3 rounded-md bg-card/90 px-2 py-0.5 text-xs font-medium">
                  {{ getSportName(article.sport.nameKey) }}
                </span>
                <span class="absolute right-3 top-3 rounded-md bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                  {{ getRelativeTime(article.createdAt) }}
                </span>
              </div>
            </router-link>
            <div class="flex flex-1 flex-col p-4">
              <router-link :to="{ name: 'article', params: { id: article.id } }" class="block">
                <h3 class="mb-2 line-clamp-2 text-lg font-semibold text-card-foreground hover:text-primary">
                  {{ article.title }}
                </h3>
                <p class="mb-4 line-clamp-2 text-sm text-muted-foreground">{{ article.summary }}</p>
              </router-link>
              <div class="mt-auto flex items-center justify-between">
                <div class="flex gap-3 text-xs text-muted-foreground">
                  <span class="flex items-center gap-1">
                    <Calendar class="h-3.5 w-3.5" />
                    {{ formatDate(article.createdAt) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <Clock class="h-3.5 w-3.5" />
                    {{ formatTime(article.createdAt) }}
                  </span>
                </div>
                <button
                  type="button"
                  class="inline-flex items-center gap-1 text-sm text-destructive hover:underline"
                  @click="removeFromArchive(article.id)"
                >
                  <Trash2 class="h-4 w-4" />
                  {{ t.archive.remove }}
                </button>
              </div>
              <div class="mt-3 border-t border-border pt-3">
                <span class="text-xs text-muted-foreground">
                  {{ t.archive.archivedOn }} {{ formatDate(article.archivedAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="flex flex-col items-center rounded-xl border border-border bg-card py-12 text-center">
        <ArchiveOff class="mb-4 h-16 w-16 text-muted-foreground" />
        <h2 class="mb-2 text-xl font-semibold">{{ t.archive.emptyTitle }}</h2>
        <p class="mx-auto mb-6 max-w-md text-muted-foreground">{{ t.archive.emptyDesc }}</p>
        <router-link
          :to="{ name: 'live' }"
          class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {{ t.archive.browseFeed }}
        </router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Archive, ArchiveOff, Calendar, Clock, Trash2 } from 'lucide-vue-next'
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
    summary: "The annual showcase of basketball's finest talents delivered unforgettable moments.",
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
    .map((archived) => {
      const article = allArticles.find((a) => a.id === archived.articleId)
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
  archivedIds.value = archivedIds.value.filter((a) => a.articleId !== articleId)
}
</script>
