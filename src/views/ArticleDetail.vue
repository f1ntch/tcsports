<template>
  <AppLayout>
    <v-container class="py-8" v-if="article">
      <v-btn variant="text" :to="{ name: 'live' }" class="mb-6 text-medium-emphasis">
        <v-icon start>mdi-arrow-left</v-icon>
        {{ t.article.backToFeed }}
      </v-btn>

      <v-row>
        <v-col cols="12" lg="8">
          <v-img :src="article.imageUrl" height="400" cover class="rounded-xl mb-6 position-relative">
            <v-chip class="position-absolute" style="top: 16px; left: 16px;" color="surface" variant="flat">
              {{ article.sport.name }}
            </v-chip>
          </v-img>

          <h1 class="text-h4 text-md-h3 font-weight-bold mb-4">{{ article.title }}</h1>

          <div class="d-flex flex-wrap align-center ga-4 text-body-2 text-medium-emphasis mb-4">
            <div class="d-flex align-center ga-2">
              <v-avatar color="primary" size="32">
                <v-icon size="18">mdi-account</v-icon>
              </v-avatar>
              <span class="font-weight-medium text-high-emphasis">{{ article.author }}</span>
            </div>
            <span class="d-flex align-center ga-1">
              <v-icon size="16">mdi-calendar</v-icon>
              {{ formatDate(article.createdAt) }}
            </span>
            <span class="d-flex align-center ga-1">
              <v-icon size="16">mdi-clock-outline</v-icon>
              {{ formatTime(article.createdAt) }}
            </span>
            <v-chip size="small" variant="outlined">{{ getRelativeTime(article.createdAt) }}</v-chip>
          </div>

          <div class="d-flex ga-2 mb-6">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" variant="outlined" size="small">
                  <v-icon start>mdi-share-variant</v-icon>
                  {{ t.article.share }}
                </v-btn>
              </template>
              <v-list density="compact">
                <v-list-item @click="copyLink">
                  <template v-slot:prepend>
                    <v-icon :color="linkCopied ? 'success' : undefined">
                      {{ linkCopied ? 'mdi-check' : 'mdi-link' }}
                    </v-icon>
                  </template>
                  <v-list-item-title>{{ linkCopied ? t.article.linkCopied : t.article.copyLink }}</v-list-item-title>
                </v-list-item>
                <v-list-item @click="shareToFacebook">
                  <template v-slot:prepend><v-icon>mdi-facebook</v-icon></template>
                  <v-list-item-title>{{ t.article.shareOnFacebook }}</v-list-item-title>
                </v-list-item>
                <v-list-item @click="shareToWhatsApp">
                  <template v-slot:prepend><v-icon>mdi-whatsapp</v-icon></template>
                  <v-list-item-title>{{ t.article.shareOnWhatsApp }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-btn
              :variant="isArchived ? 'flat' : 'outlined'"
              :color="isArchived ? 'primary' : undefined"
              size="small"
              @click="toggleArchive"
            >
              <v-icon start>{{ isArchived ? 'mdi-bookmark-check' : 'mdi-bookmark-outline' }}</v-icon>
              {{ isArchived ? t.article.removeFromArchive : t.article.saveToArchive }}
            </v-btn>
          </div>

          <v-divider class="mb-6" />

          <p class="text-h6 font-weight-medium mb-6">{{ article.summary }}</p>

          <div class="article-content text-body-1 text-medium-emphasis">
            <p v-for="(paragraph, idx) in article.content.split('\n\n')" :key="idx" class="mb-4">
              {{ paragraph }}
            </p>
          </div>

          <v-divider class="my-8" />

          <div>
            <h2 class="text-h6 font-weight-bold mb-4">{{ t.article.tags }}</h2>
            <div class="d-flex flex-wrap ga-2">
              <v-chip
                v-for="tag in article.tags"
                :key="tag"
                variant="tonal"
                color="primary"
              >
                {{ tag }}
              </v-chip>
            </div>
          </div>
        </v-col>

        <v-col cols="12" lg="4">
          <v-card v-if="relatedArticles.length" class="mb-6">
            <v-card-title class="text-h6">{{ t.article.relatedArticles }}</v-card-title>
            <v-card-text>
              <div class="d-flex flex-column ga-4">
                <router-link
                  v-for="related in relatedArticles"
                  :key="related.id"
                  :to="{ name: 'article', params: { id: related.id } }"
                  class="text-decoration-none d-flex ga-3"
                >
                  <v-img :src="related.imageUrl" width="80" height="60" cover class="rounded flex-shrink-0" />
                  <div>
                    <h4 class="text-body-2 font-weight-medium text-high-emphasis related-title">{{ related.title }}</h4>
                    <span class="text-caption text-medium-emphasis">{{ getRelativeTime(related.createdAt) }}</span>
                  </div>
                </router-link>
              </div>
            </v-card-text>
          </v-card>

          <v-card>
            <v-card-title class="text-h6">{{ t.article.popularTags }}</v-card-title>
            <v-card-text>
              <div class="d-flex flex-wrap ga-2">
                <v-chip
                  v-for="tag in allTags.slice(0, 12)"
                  :key="tag"
                  variant="outlined"
                  size="small"
                >
                  {{ tag }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else class="d-flex flex-column align-center justify-center py-16 text-center">
      <h1 class="text-h5 font-weight-bold mb-2">{{ t.article.articleNotFound }}</h1>
      <p class="text-body-1 text-medium-emphasis mb-6">{{ t.article.articleNotFoundDesc }}</p>
      <v-btn :to="{ name: 'live' }" color="primary">{{ t.article.backToFeed }}</v-btn>
    </v-container>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { useLanguage } from '@/composables/useLanguage'

const route = useRoute()
const { t } = useLanguage()

const mockArchivedIds = ['2', '5']
const isArchived = ref(mockArchivedIds.includes(route.params.id))
const linkCopied = ref(false)

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
    summary: 'The annual showcase of basketball\'s finest talents delivered unforgettable moments.',
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

const article = computed(() => mockArticles.find(a => a.id === route.params.id))

const relatedArticles = computed(() => {
  if (!article.value) return []
  return mockArticles
    .filter(a => a.sport.id === article.value.sport.id && a.id !== article.value.id)
    .slice(0, 3)
})

const allTags = computed(() => [...new Set(mockArticles.flatMap(a => a.tags))])

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
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

const toggleArchive = () => isArchived.value = !isArchived.value

const copyLink = async () => {
  await navigator.clipboard.writeText(window.location.href)
  linkCopied.value = true
  setTimeout(() => linkCopied.value = false, 2000)
}

const shareToFacebook = () => {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400')
}

const shareToWhatsApp = () => {
  const text = encodeURIComponent(article.value?.title || 'Check out this article')
  window.open(`https://wa.me/?text=${text}%20${encodeURIComponent(window.location.href)}`, '_blank')
}
</script>

<style scoped>
.related-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.article-content {
  line-height: 1.8;
}
</style>
