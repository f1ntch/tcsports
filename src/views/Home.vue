<template>
  <AppLayout>
    <!-- Matches Ticker Widget -->
    <div class="border-b border-border bg-card">
      <div class="container mx-auto">
        <div class="flex items-center border-b border-border">
          <div class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary">
            <Trophy class="h-4 w-4" />
            {{ t.home.ticker.matches }}
          </div>
          <router-link 
            to="/matches" 
            class="ml-auto px-4 py-2 text-sm text-primary hover:underline"
          >
            {{ t.home.ticker.viewAll }} →
          </router-link>
        </div>

        <div class="relative overflow-hidden py-3">
          <div class="flex animate-ticker gap-4">
            <div
              v-for="match in [...tickerMatches, ...tickerMatches]"
              :key="match.id + '-' + Math.random()"
              class="flex min-w-[280px] items-center gap-3 rounded-lg border border-border bg-background p-3 transition-all hover:border-primary"
            >
              <div class="flex flex-col items-center gap-1">
                <span class="text-xs text-muted-foreground">{{ match.time }}</span>
                <span 
                  v-if="match.status === 'live'" 
                  class="animate-pulse rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white"
                >
                  LIVE
                </span>
                <span 
                  v-else-if="match.status === 'ft'" 
                  class="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium"
                >
                  FT
                </span>
              </div>
              <div class="flex flex-1 flex-col gap-1">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <img :src="match.home.logo" class="h-4 w-4" />
                    <span class="text-xs font-medium">{{ match.home.name }}</span>
                  </div>
                  <span class="text-xs font-bold">{{ match.home.goals ?? '-' }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <img :src="match.away.logo" class="h-4 w-4" />
                    <span class="text-xs font-medium">{{ match.away.name }}</span>
                  </div>
                  <span class="text-xs font-bold">{{ match.away.goals ?? '-' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <div class="flex flex-col items-center gap-8 text-center">
        <div class="relative h-64 w-full max-w-2xl overflow-hidden rounded-2xl">
          <img
            src="/images/tres-comas.png"
            alt="Tres Comas - Three bulls with sombreros"
            class="h-full w-full object-cover"
          />
        </div>

        <div class="flex flex-col items-center gap-4">
          <h1 class="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {{ t.home.welcome }} <span class="text-primary">TC Sports</span>
          </h1>
          <p class="max-w-xl text-pretty text-lg text-muted-foreground">
            {{ t.home.description }}
          </p>
        </div>

        <div class="flex flex-col gap-4 sm:flex-row">
          <router-link
            :to="{ name: 'register' }"
            class="inline-flex min-w-[160px] items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {{ t.home.getStarted }}
          </router-link>
          <router-link
            :to="{ name: 'live' }"
            class="inline-flex min-w-[160px] items-center justify-center rounded-md border border-input bg-background px-6 py-2.5 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {{ t.home.browseArticles }}
          </router-link>
        </div>

        <div class="mt-12 grid w-full max-w-4xl gap-6 md:grid-cols-3">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="rounded-xl border border-border bg-card p-6 text-left transition-colors hover:border-primary/50"
          >
            <h3 class="mb-2 text-lg font-semibold text-card-foreground">{{ feature.title }}</h3>
            <p class="text-sm text-muted-foreground">{{ feature.description }}</p>
          </div>
        </div>
      </div>

      <!-- Articles & Standings Section -->
      <div class="mt-16 grid gap-8 lg:grid-cols-3">
        <!-- Articles Column -->
        <div class="lg:col-span-2">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-xl font-bold">{{ t.home.latestNews }}</h2>
            <router-link to="/live" class="text-sm text-primary hover:underline">
              {{ t.home.ticker.viewAll }} →
            </router-link>
          </div>
          <div class="space-y-4">
            <router-link
              v-for="article in latestArticles"
              :key="article.id"
              :to="`/article/${article.id}`"
              class="flex gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-md"
            >
              <img 
                :src="article.image" 
                :alt="article.title"
                class="h-24 w-32 rounded-lg object-cover"
              />
              <div class="flex flex-1 flex-col justify-between">
                <div>
                  <span class="mb-1 inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {{ article.category }}
                  </span>
                  <h3 class="line-clamp-2 font-semibold text-card-foreground">{{ article.title }}</h3>
                </div>
                <div class="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{{ article.date }}</span>
                  <span>•</span>
                  <span>{{ article.readTime }}</span>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Standings Column -->
        <div>
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-xl font-bold">{{ t.home.ticker.standings }}</h2>
            <router-link to="/standings/208" class="text-sm text-primary hover:underline">
              {{ t.home.ticker.viewAll }} →
            </router-link>
          </div>
          <div class="rounded-lg border border-border bg-card overflow-hidden">
            <div class="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
              <img src="https://flagcdn.com/w40/be.png" class="h-4 w-4 rounded-sm" />
              <span class="text-sm font-semibold">Jupiler Pro League</span>
            </div>
            <table class="w-full">
              <thead>
                <tr class="border-b border-border text-xs text-muted-foreground">
                  <th class="px-3 py-2 text-left">#</th>
                  <th class="px-3 py-2 text-left">{{ t.home.team }}</th>
                  <th class="px-3 py-2 text-center">P</th>
                  <th class="px-3 py-2 text-center">Pts</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="team in standings" 
                  :key="team.name"
                  class="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                >
                  <td class="px-3 py-2">
                    <span 
                      class="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-white"
                      :class="getPositionBadgeClass(team.position)"
                    >
                      {{ team.position }}
                    </span>
                  </td>
                  <td class="px-3 py-2">
                    <router-link :to="`/team/${team.id}`" class="flex items-center gap-2 hover:text-primary">
                      <img :src="team.logo" class="h-4 w-4" />
                      <span class="text-sm font-medium">{{ team.name }}</span>
                    </router-link>
                  </td>
                  <td class="px-3 py-2 text-center text-sm text-muted-foreground">{{ team.played }}</td>
                  <td class="px-3 py-2 text-center text-sm font-bold">{{ team.points }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Trophy } from 'lucide-vue-next'
import AppLayout from '@/components/AppLayout.vue'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

const tickerMatches = ref([
  {
    id: 1,
    time: '20:45',
    status: 'live',
    home: { name: 'Antwerp', logo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', goals: 1 },
    away: { name: 'Club Brugge', logo: 'https://cdn.sportmonks.com/images/soccer/teams/20/340.png', goals: 0 }
  },
  {
    id: 2,
    time: '18:30',
    status: 'ft',
    home: { name: 'Cercle Brugge', logo: 'https://cdn.sportmonks.com/images/soccer/teams/17/2641.png', goals: 2 },
    away: { name: 'Anderlecht', logo: 'https://cdn.sportmonks.com/images/soccer/teams/27/2555.png', goals: 1 }
  },
  {
    id: 3,
    time: '16:00',
    status: 'ft',
    home: { name: 'Genk', logo: 'https://cdn.sportmonks.com/images/soccer/teams/21/2709.png', goals: 3 },
    away: { name: 'Standard Liège', logo: 'https://cdn.sportmonks.com/images/soccer/teams/28/700.png', goals: 0 }
  },
  {
    id: 4,
    time: '14:30',
    status: 'ft',
    home: { name: 'Sint-Truiden', logo: 'https://cdn.sportmonks.com/images/soccer/teams/3/355.png', goals: 2 },
    away: { name: 'Gent', logo: 'https://cdn.sportmonks.com/images/soccer/teams/2/2402.png', goals: 2 }
  },
  {
    id: 5,
    time: '21:00',
    status: 'scheduled',
    home: { name: 'Union SG', logo: 'https://cdn.sportmonks.com/images/soccer/teams/22/3958.png', goals: null },
    away: { name: 'Mechelen', logo: 'https://cdn.sportmonks.com/images/soccer/teams/26/2938.png', goals: null }
  }
])

const standings = ref([
  { position: 1, id: 3958, name: 'Union SG', logo: 'https://cdn.sportmonks.com/images/soccer/teams/22/3958.png', played: 22, points: 46 },
  { position: 2, id: 355, name: 'Sint-Truiden', logo: 'https://cdn.sportmonks.com/images/soccer/teams/3/355.png', played: 22, points: 45 },
  { position: 3, id: 340, name: 'Club Brugge', logo: 'https://cdn.sportmonks.com/images/soccer/teams/20/340.png', played: 22, points: 44 },
  { position: 4, id: 2555, name: 'Anderlecht', logo: 'https://cdn.sportmonks.com/images/soccer/teams/27/2555.png', played: 22, points: 36 },
  { position: 5, id: 2402, name: 'Gent', logo: 'https://cdn.sportmonks.com/images/soccer/teams/2/2402.png', played: 23, points: 33 },
  { position: 6, id: 2938, name: 'Mechelen', logo: 'https://cdn.sportmonks.com/images/soccer/teams/26/2938.png', played: 22, points: 32 },
  { position: 7, id: 1087, name: 'Charleroi', logo: 'https://cdn.sportmonks.com/images/soccer/teams/31/1087.png', played: 22, points: 30 },
  { position: 8, id: 328, name: 'Antwerp', logo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', played: 22, points: 27 }
])

const latestArticles = ref([
  {
    id: 1,
    title: 'Antwerp Stuns Club Brugge with Late Winner in Top-of-the-Table Clash',
    category: 'Football',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&h=300&fit=crop',
    date: 'Jan 31, 2026',
    readTime: '4 min read'
  },
  {
    id: 2,
    title: 'Union Saint-Gilloise Extends Lead at the Top After Dominant Victory',
    category: 'Football',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop',
    date: 'Jan 30, 2026',
    readTime: '3 min read'
  },
  {
    id: 3,
    title: 'Transfer Window: Belgian Pro League Teams Make Final Moves',
    category: 'Transfers',
    image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=300&fit=crop',
    date: 'Jan 30, 2026',
    readTime: '5 min read'
  },
  {
    id: 4,
    title: 'Rising Stars: Young Talents to Watch in the Jupiler Pro League',
    category: 'Analysis',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop',
    date: 'Jan 29, 2026',
    readTime: '6 min read'
  }
])

const getPositionBadgeClass = (pos) => {
  if (pos <= 6) return 'bg-green-500'
  if (pos <= 12) return 'bg-orange-500'
  return 'bg-red-500'
}

const features = computed(() => [
  {
    title: t.value.home.features.personalized,
    description: t.value.home.features.personalizedDesc,
  },
  {
    title: t.value.home.features.liveUpdates,
    description: t.value.home.features.liveUpdatesDesc,
  },
  {
    title: t.value.home.features.archive,
    description: t.value.home.features.archiveDesc,
  },
])
</script>

<style scoped>
@keyframes ticker {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-ticker {
  animation: ticker 30s linear infinite;
}

.animate-ticker:hover {
  animation-play-state: paused;
}
</style>
