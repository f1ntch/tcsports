<template>
  <AppLayout>
    <div v-if="article" class="container mx-auto px-4 py-8">
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
            <img :src="article.imageUrl" :alt="article.title" class="h-full w-full object-cover" />
            <span class="absolute left-4 top-4 rounded-md bg-card/90 px-2 py-1 text-sm font-medium">
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
            <span class="rounded-md border border-border px-2 py-0.5 text-xs">
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
            <p v-for="(paragraph, idx) in article.content.split('\n\n')" :key="idx">
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
                class="flex gap-3 rounded-md p-1 transition-colors hover:bg-accent"
              >
                <img
                  :src="related.imageUrl"
                  :alt="related.title"
                  class="h-14 w-20 shrink-0 rounded object-cover"
                />
                <div class="min-w-0">
                  <h4 class="line-clamp-2 text-sm font-medium text-card-foreground">{{ related.title }}</h4>
                  <span class="text-xs text-muted-foreground">{{ getRelativeTime(related.createdAt) }}</span>
                </div>
              </router-link>
            </div>
          </div>

          <div class="rounded-xl border border-border bg-card p-4">
            <h3 class="mb-4 text-lg font-semibold">{{ t.article.popularTags }}</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in allTags.slice(0, 12)"
                :key="tag"
                class="rounded-md border border-border px-2 py-0.5 text-xs"
              >
                {{ tag }}
              </span>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
} from 'lucide-vue-next'
import AppLayout from '@/components/AppLayout.vue'
import { useLanguage } from '@/composables/useLanguage'

const route = useRoute()
const { t } = useLanguage()

const mockArchivedIds = ['2', '5']
const isArchived = ref(mockArchivedIds.includes(route.params.id))
const linkCopied = ref(false)
const shareOpen = ref(false)
const shareMenuRef = ref(null)

const mockArticles = [
  {
    id: '1',
    title: 'Champions League Final: Epic Showdown in Istanbul',
    summary: 'Two European giants clash in what promises to be one of the most exciting finals in recent memory.',
    content: `The stage is set for what many are calling the match of the decade. Two of Europe's most prestigious clubs will face off in Istanbul's Ataturk Olympic Stadium.

Both teams have navigated a treacherous path to reach this final. The defending champions overcame a dramatic semi-final, while their opponents dispatched the tournament favorites with stunning tactical brilliance.

The tactical battle between the two managers promises to be fascinating. One favors a high-pressing, possession-based approach, while the other has mastered the art of the counter-attack.

Key players on both sides have been in scintillating form. The tournament's top scorer will be looking to add to his tally, while the opposing goalkeeper has kept the most clean sheets.

With millions of fans watching worldwide, the pressure will be immense. But these players thrive on the biggest stages.`,
    createdAt: '2026-01-30T20:30:00Z',
    sport: { id: '1', name: 'Football' },
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
    author: 'James Wilson',
    tags: ['Champions League', 'Final', 'Istanbul', 'European Football', 'UEFA'],
  },
  {
    id: '2',
    title: 'NBA All-Star Weekend: Records Shattered',
    summary: "The annual showcase of basketball's finest talents delivered unforgettable moments.",
    content: `The NBA All-Star Weekend delivered on its promise of entertainment, with several records falling across the various competitions.

The Three-Point Contest saw a new benchmark set, with the winner draining an incredible 31 out of 34 attempts in the final round.

The Slam Dunk Competition returned to its glory days with four competitors pushing the boundaries of what's physically possible.

The All-Star Game itself showcased the league's brightest stars in a surprisingly competitive affair. Unlike recent years, both teams played with intensity throughout.`,
    createdAt: '2026-01-30T18:15:00Z',
    sport: { id: '2', name: 'Basketball' },
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80',
    author: 'Marcus Thompson',
    tags: ['NBA', 'All-Star', 'Three-Point Contest', 'Slam Dunk', 'Records'],
  },
  {
    id: '3',
    title: 'Australian Open: Underdog Reaches Semi-Finals',
    summary: 'In a stunning upset, the unseeded player defeats the world number two in straight sets.',
    content: `In one of the most remarkable stories of this year's Australian Open, an unseeded Argentine player has reached the semi-finals.

The 22-year-old, ranked 87th in the world, produced the performance of his career on Rod Laver Arena. His powerful baseline game proved too much for his highly-favored opponent.

Coming into the tournament, few had heard of this rising star outside of South American tennis circles. But his journey has captured hearts worldwide.`,
    createdAt: '2026-01-30T14:45:00Z',
    sport: { id: '3', name: 'Tennis' },
    imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80',
    author: 'Sofia Martinez',
    tags: ['Australian Open', 'Grand Slam', 'Tennis', 'Upset', 'Argentina'],
  },
  {
    id: '4',
    title: 'Tour de France Route Announced for 2026',
    summary: 'The legendary race will feature more mountain stages than ever before.',
    content: `Tour de France organizers have unveiled what they're calling the most demanding route in the race's 123-year history.

The 2026 edition will feature six mountain-top finishes, including back-to-back summit finishes in the Alps during the final week.

The infamous Mont Ventoux returns after a two-year absence, scheduled for a crucial stage that could define the entire race.`,
    createdAt: '2026-01-30T12:00:00Z',
    sport: { id: '4', name: 'Cycling' },
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80',
    author: 'Pierre Dubois',
    tags: ['Tour de France', 'Cycling', 'Mountain Stage', 'Alps', 'Pyrenees'],
  },
  {
    id: '5',
    title: 'Swimming World Championships: New World Record Set',
    summary: 'The 100m freestyle record that stood for over a decade has finally been broken.',
    content: `The swimming world witnessed history as a 23-year-old from the Netherlands broke the seemingly unbreakable 100m freestyle world record.

The previous record, set over a decade ago during the controversial super-suit era, had long been considered out of reach.

But the young Dutch swimmer had other ideas. From the moment he dove into the pool, it was clear something special was unfolding.`,
    createdAt: '2026-01-29T22:30:00Z',
    sport: { id: '5', name: 'Swimming' },
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&q=80',
    author: 'Emma van Berg',
    tags: ['Swimming', 'World Record', 'World Championships', 'Netherlands', 'Freestyle'],
  },
  {
    id: '6',
    title: 'F1 Pre-Season Testing: Surprising Early Pace',
    summary: 'The newly restructured team shows unexpected speed during testing in Bahrain.',
    content: `The first week of Formula 1 pre-season testing in Bahrain has thrown up a major surprise.

After a significant restructuring during the off-season, the improved pace was perhaps not entirely unexpected. But the margins they're showing have exceeded even the most optimistic predictions.

Lap time analysis reveals their car is particularly strong in the high-speed corners, suggesting their new aerodynamic philosophy is working as intended.`,
    createdAt: '2026-01-29T19:00:00Z',
    sport: { id: '6', name: 'Formula 1' },
    imageUrl: 'https://images.unsplash.com/photo-1541348263662-e068662d82af?w=1200&q=80',
    author: 'Sebastian Kraft',
    tags: ['Formula 1', 'Pre-Season', 'Testing', 'Bahrain', 'F1 2026'],
  },
]

const article = computed(() => mockArticles.find((a) => a.id === route.params.id))

const relatedArticles = computed(() => {
  if (!article.value) return []
  return mockArticles
    .filter((a) => a.sport.id === article.value.sport.id && a.id !== article.value.id)
    .slice(0, 3)
})

const allTags = computed(() => [...new Set(mockArticles.flatMap((a) => a.tags))])

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

const toggleArchive = () => (isArchived.value = !isArchived.value)

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

onMounted(() => document.addEventListener('click', closeShare))
onUnmounted(() => document.removeEventListener('click', closeShare))
</script>

<style scoped>
.article-content {
  line-height: 1.8;
}
</style>
