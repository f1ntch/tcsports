<template>
  <AppLayout>
    <div v-if="loading" class="container mx-auto flex items-center justify-center px-4 py-16">
      <Loader2 class="h-12 w-12 animate-spin text-primary" />
    </div>

    <div v-else-if="article" class="container mx-auto px-4 py-8">
      <router-link
        :to="{ name: 'live' }"
        class="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft class="h-4 w-4" />
        {{ t.article.backToFeed }}
      </router-link>

      <div class="grid gap-8 lg:grid-cols-8">
        <div class="lg:col-span-5">
          <div class="relative mb-6 aspect-video overflow-hidden rounded-xl bg-muted">
            <img :src="article.imageUrl" :alt="article.title" class="h-full w-full object-cover" @error="(e) => e.target.src = 'https://images.unsplash.com/photo-1461896836934-bc06e44c42d8?w=1200&q=80'" />
            <span class="absolute left-4 top-4 rounded-md bg-primary px-2 py-1 text-sm font-medium text-primary-foreground">
              {{ article.sport.name }}
            </span>
          </div>

          <h1 class="mb-4 text-2xl font-bold md:text-3xl">{{ article.title }}</h1>

          <div class="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div class="flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User class="h-4 w-4" />
              </div>
              <span class="font-medium text-foreground">{{ article.author }}</span>
            </div>
            <span class="flex items-center gap-1">
              <Calendar class="h-4 w-4" />
              {{ formatDate(article.createdAt) }}
            </span>
            <span class="flex items-center gap-1">
              <Clock class="h-4 w-4" />
              {{ formatTime(article.createdAt) }}
            </span>
            <span class="rounded-md bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
              {{ getRelativeTime(article.createdAt) }}
            </span>
          </div>

          <div class="mb-6 flex flex-wrap gap-2">
            <div class="relative" ref="shareMenuRef">
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground"
                @click="shareOpen = !shareOpen"
              >
                <Share2 class="h-4 w-4" />
                {{ t.article.share }}
              </button>
              <div
                v-if="shareOpen"
                class="absolute left-0 top-full z-10 mt-1 min-w-[180px] rounded-md border border-border bg-popover py-1 shadow-lg"
              >
                <button
                  type="button"
                  class="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                  @click="copyLink(); shareOpen = false"
                >
                  <Link v-if="!linkCopied" class="h-4 w-4" />
                  <Check v-else class="h-4 w-4 text-primary" />
                  {{ linkCopied ? t.article.linkCopied : t.article.copyLink }}
                </button>
                <button
                  type="button"
                  class="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                  @click="shareToFacebook"
                >
                  <Share2 class="h-4 w-4" />
                  {{ t.article.shareOnFacebook }}
                </button>
                <button
                  type="button"
                  class="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                  @click="shareToWhatsApp"
                >
                  <Share2 class="h-4 w-4" />
                  {{ t.article.shareOnWhatsApp }}
                </button>
              </div>
            </div>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
              :class="
                isArchived
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground'
              "
              @click="toggleArchive"
            >
              <BookmarkCheck v-if="isArchived" class="h-4 w-4" />
              <Bookmark v-else class="h-4 w-4" />
              {{ isArchived ? t.article.removeFromArchive : t.article.saveToArchive }}
            </button>
          </div>

          <div class="mb-6 h-px bg-border" />

          <p class="mb-6 text-lg font-medium">{{ article.summary }}</p>

          <div class="article-content space-y-4 text-muted-foreground">
            <p v-for="(paragraph, idx) in getContentParagraphs(article.content)" :key="idx">
              {{ paragraph }}
            </p>
          </div>

          <div class="my-8 h-px bg-border" />

          <div>
            <h2 class="mb-4 text-lg font-semibold">{{ t.article.tags }}</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in article.tags"
                :key="tag"
                class="rounded-md bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <aside class="lg:col-span-3">
          <div v-if="relatedArticles.length" class="mb-6 rounded-xl border border-border bg-card p-4">
            <h3 class="mb-4 text-lg font-semibold">{{ t.article.relatedArticles }}</h3>
            <div class="flex flex-col gap-4">
              <router-link
                v-for="related in relatedArticles"
                :key="related.id"
                :to="{ name: 'article', params: { id: related.id } }"
                class="group flex gap-3 rounded-md p-1 transition-colors hover:bg-primary/10"
              >
                <img
                  :src="related.imageUrl"
                  :alt="related.title"
                  class="h-14 w-20 shrink-0 rounded object-cover"
                  @error="(e) => e.target.src = 'https://images.unsplash.com/photo-1461896836934-bc06e44c42d8?w=800&q=80'"
                />
                <div class="min-w-0">
                  <h4 class="line-clamp-2 text-sm font-medium text-card-foreground group-hover:text-primary">{{ related.title }}</h4>
                  <span class="text-xs text-muted-foreground">{{ getRelativeTime(related.createdAt) }}</span>
                </div>
              </router-link>
            </div>
          </div>

          <div v-if="similarTagArticles.length" class="rounded-xl border border-border bg-card p-4">
            <h3 class="mb-4 text-lg font-semibold">{{ t.article.similarArticles || 'Similar Articles' }}</h3>
            <div class="flex flex-col gap-4">
              <router-link
                v-for="similar in similarTagArticles"
                :key="similar.id"
                :to="{ name: 'article', params: { id: similar.id } }"
                class="group flex gap-3 rounded-md p-1 transition-colors hover:bg-primary/10"
              >
                <img
                  :src="similar.imageUrl"
                  :alt="similar.title"
                  class="h-14 w-20 shrink-0 rounded object-cover"
                  @error="(e) => e.target.src = 'https://images.unsplash.com/photo-1461896836934-bc06e44c42d8?w=800&q=80'"
                />
                <div class="min-w-0">
                  <h4 class="line-clamp-2 text-sm font-medium text-card-foreground group-hover:text-primary">{{ similar.title }}</h4>
                  <span class="text-xs text-muted-foreground">{{ getRelativeTime(similar.createdAt) }}</span>
                </div>
              </router-link>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <div v-else class="container mx-auto flex flex-col items-center justify-center px-4 py-16 text-center">
      <h1 class="mb-2 text-xl font-semibold">{{ t.article.articleNotFound }}</h1>
      <p class="mb-6 text-muted-foreground">{{ t.article.articleNotFoundDesc }}</p>
      <router-link
        :to="{ name: 'live' }"
        class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {{ t.article.backToFeed }}
      </router-link>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Share2,
  Link,
  Check,
  Bookmark,
  BookmarkCheck,
  Loader2,
} from 'lucide-vue-next'
import AppLayout from '@/components/AppLayout.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const route = useRoute()
const auth = useAuthStore()
const { t, language } = useLanguage()

const article = ref(null)
const relatedArticles = ref([])
const similarTagArticles = ref([])
const isArchived = ref(false)
const loading = ref(true)
const linkCopied = ref(false)
const shareOpen = ref(false)
const shareMenuRef = ref(null)

function getSportImage(sportName) {
  const images = {
    'Soccer': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
    'Football': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
    'Basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80',
    'Tennis': 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80',
    'Cycling': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80',
    'Swimming': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&q=80',
    'Formula 1': 'https://images.unsplash.com/photo-1541348263662-e068662d82af?w=1200&q=80',
    'Ice Hockey': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=1200&q=80',
    'American Football': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200&q=80',
  }
  return images[sportName] || 'https://images.unsplash.com/photo-1461896836934-bc06e44c42d8?w=1200&q=80'
}

async function fetchArticle() {
  loading.value = true
  const lang = language.value || 'en'
  const articleId = parseInt(route.params.id)

  const { data, error } = await supabase
    .from('articles_processed')
    .select(`
      id, article_id, title, summary, created_at, image_url,
      articles!inner (
        id, body, source, sport_id,
        sports ( id, name )
      )
    `)
    .eq('article_id', articleId)
    .eq('language_code', lang)
    .single()

  if (!error && data) {
    article.value = {
      id: data.article_id,
      title: data.title,
      summary: data.summary,
      content: data.articles?.body || '',
      createdAt: data.created_at,
      sport: data.articles?.sports || { id: null, name: 'Unknown' },
      imageUrl: data.image_url || getSportImage(data.articles?.sports?.name),
      author: data.articles?.source || 'TC Sports',
      tags: []
    }
    await fetchTags(articleId)
    await fetchRelated(data.articles?.sport_id, articleId)
    await fetchSimilarByTags(articleId)
    await checkArchived(articleId)
  }
  loading.value = false
}

async function fetchTags(articleId) {
  const { data } = await supabase
    .from('article_tags')
    .select('tagname')
    .eq('article_id', articleId)
  if (data) {
    article.value.tags = data.map(t => t.tagname)
  }
}

async function fetchRelated(sportId, excludeId) {
  if (!sportId) return
  const lang = language.value || 'en'
  const { data } = await supabase
    .from('articles_processed')
    .select(`
      article_id, title, created_at, image_url,
      articles!inner ( sport_id, sports ( name ) )
    `)
    .eq('language_code', lang)
    .eq('articles.sport_id', sportId)
    .neq('article_id', excludeId)
    .limit(3)
  
  if (data) {
    relatedArticles.value = data.map(item => ({
      id: item.article_id,
      title: item.title,
      createdAt: item.created_at,
      imageUrl: item.image_url || getSportImage(item.articles?.sports?.name)
    }))
  }
}

async function checkArchived(articleId) {
  if (!auth.user) return
  const { data } = await supabase
    .from('user_articles')
    .select('id')
    .eq('user_id', auth.user.id)
    .eq('article_id', articleId)
    .single()
  isArchived.value = !!data
}

async function fetchSimilarByTags(articleId) {
  if (!article.value?.tags?.length) return
  const lang = language.value || 'en'
  const relatedIds = relatedArticles.value.map(a => a.id)
  
  // Get articles that share the same tags
  const { data: tagMatches } = await supabase
    .from('article_tags')
    .select('article_id')
    .in('tagname', article.value.tags)
    .neq('article_id', articleId)
  
  if (!tagMatches?.length) return
  
  const matchedIds = [...new Set(tagMatches.map(t => t.article_id))]
    .filter(id => !relatedIds.includes(id))
    .slice(0, 5)
  
  if (!matchedIds.length) return
  
  const { data } = await supabase
    .from('articles_processed')
    .select(`
      article_id, title, created_at, image_url,
      articles!inner ( sports ( name ) )
    `)
    .eq('language_code', lang)
    .in('article_id', matchedIds)
    .limit(4)
  
  if (data) {
    similarTagArticles.value = data.map(item => ({
      id: item.article_id,
      title: item.title,
      createdAt: item.created_at,
      imageUrl: item.image_url || getSportImage(item.articles?.sports?.name)
    }))
  }
}

const stripHtml = (html) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

const getContentParagraphs = (content) => {
  if (!content) return []
  const stripped = stripHtml(content)
  return stripped.split(/\n\n+/).filter(p => p.trim())
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
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

const toggleArchive = async () => {
  if (!auth.user || !article.value) return
  const articleId = article.value.id

  if (isArchived.value) {
    await supabase.from('user_articles').delete()
      .eq('user_id', auth.user.id)
      .eq('article_id', articleId)
    isArchived.value = false
  } else {
    await supabase.from('user_articles').insert({
      user_id: auth.user.id,
      article_id: articleId
    })
    isArchived.value = true
  }
}

const copyLink = async () => {
  await navigator.clipboard.writeText(window.location.href)
  linkCopied.value = true
  setTimeout(() => (linkCopied.value = false), 2000)
}

const shareToFacebook = () => {
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    '_blank',
    'width=600,height=400'
  )
}

const shareToWhatsApp = () => {
  const text = encodeURIComponent(article.value?.title || 'Check out this article')
  window.open(`https://wa.me/?text=${text}%20${encodeURIComponent(window.location.href)}`, '_blank')
}

const closeShare = (e) => {
  if (shareMenuRef.value && !shareMenuRef.value.contains(e.target)) {
    shareOpen.value = false
  }
}

watch(language, () => fetchArticle())
watch(() => route.params.id, () => fetchArticle())

onMounted(() => {
  document.addEventListener('click', closeShare)
  fetchArticle()
})
onUnmounted(() => document.removeEventListener('click', closeShare))
</script>

<style scoped>
.article-content {
  line-height: 1.8;
}
</style>
