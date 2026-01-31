<template>
  <AppLayout>
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6 flex flex-wrap items-center gap-2">
        <button
          v-for="filter in filters"
          :key="filter.id"
          class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
          :class="activeFilter === filter.id ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-primary/10 hover:text-primary'"
          @click="activeFilter = filter.id"
        >
          {{ filter.label }}
        </button>
        <button
          class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
          :class="showFollowedOnly ? 'bg-yellow-500 text-white' : 'bg-card text-muted-foreground hover:bg-yellow-500/10 hover:text-yellow-500'"
          @click="showFollowedOnly = !showFollowedOnly"
        >
          <Star class="mr-1 inline h-3 w-3" :class="showFollowedOnly ? 'fill-current' : ''" />
          {{ t.matches.myTeams }}
        </button>
        <div class="ml-auto flex items-center gap-2">
          <select
            v-model="selectedLeague"
            class="rounded-md border border-border bg-card px-3 py-1.5 text-sm"
          >
            <option value="all">{{ t.matches.allLeagues }}</option>
            <option v-for="league in allLeagues" :key="league.id" :value="league.id">
              {{ league.country }}: {{ league.name }}
            </option>
          </select>
          <button class="rounded-md p-2 hover:bg-primary/10" @click="prevDay">
            <ChevronLeft class="h-4 w-4" />
          </button>
          <button class="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm">
            <CalendarIcon class="h-4 w-4" />
            {{ t.matches.today }}
          </button>
          <button class="rounded-md p-2 hover:bg-primary/10" @click="nextDay">
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
      </div>

      <div v-for="league in filteredLeagues" :key="league.id" class="mb-6">
        <div class="mb-3 flex items-center gap-3 rounded-lg bg-card p-3">
          <img :src="league.flag" :alt="league.country" class="h-5 w-5 rounded-sm object-cover" />
          <span class="font-semibold">{{ league.country }}: {{ league.name }}</span>
          <router-link :to="{ name: 'standings', params: { leagueId: league.id } }" class="ml-auto text-sm text-primary hover:underline">
            {{ t.matches.standings }}
          </router-link>
        </div>

        <div class="space-y-2">
          <div
            v-for="match in getFilteredMatches(league.matches)"
            :key="match.id"
            class="group flex items-center gap-4 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary hover:bg-primary/5"
          >
            <span class="w-14 text-center text-sm text-muted-foreground">{{ match.time }}</span>
            
            <div class="flex flex-1 flex-col gap-1">
              <div class="flex items-center gap-2">
                <router-link 
                  :to="{ name: 'team', params: { teamId: getTeamSlug(match.home.name) } }"
                  @click.stop
                  class="flex items-center gap-2 hover:text-primary"
                >
                  <img :src="match.home.logo" :alt="match.home.name" class="h-5 w-5" />
                  <span class="text-sm font-medium" :class="[
                    match.home.goals > match.away.goals ? 'text-foreground' : 'text-muted-foreground',
                    isFollowed(match.home.name) ? 'text-yellow-500' : ''
                  ]">
                    {{ match.home.name }}
                  </span>
                </router-link>
                <Star 
                  v-if="isFollowed(match.home.name)" 
                  class="h-3 w-3 fill-yellow-500 text-yellow-500" 
                />
                <span v-if="match.status !== 'scheduled'" class="ml-auto text-sm font-bold">{{ match.home.goals }}</span>
              </div>
              <div class="flex items-center gap-2">
                <router-link 
                  :to="{ name: 'team', params: { teamId: getTeamSlug(match.away.name) } }"
                  @click.stop
                  class="flex items-center gap-2 hover:text-primary"
                >
                  <img :src="match.away.logo" :alt="match.away.name" class="h-5 w-5" />
                  <span class="text-sm font-medium" :class="[
                    match.away.goals > match.home.goals ? 'text-foreground' : 'text-muted-foreground',
                    isFollowed(match.away.name) ? 'text-yellow-500' : ''
                  ]">
                    {{ match.away.name }}
                  </span>
                </router-link>
                <Star 
                  v-if="isFollowed(match.away.name)" 
                  class="h-3 w-3 fill-yellow-500 text-yellow-500" 
                />
                <span v-if="match.status !== 'scheduled'" class="ml-auto text-sm font-bold">{{ match.away.goals }}</span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span v-if="match.status === 'live'" class="animate-pulse rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">{{ t.matches.live.toUpperCase() }}</span>
              <span v-else-if="match.status === 'ft'" class="rounded bg-muted px-2 py-1 text-xs">FT</span>
            </div>

            <div class="flex gap-2">
              <span class="rounded border border-border px-3 py-1 text-sm" :class="getOddsColor(match.odds.home)">{{ match.odds.home }}</span>
              <span class="rounded border border-border px-3 py-1 text-sm" :class="getOddsColor(match.odds.draw)">{{ match.odds.draw }}</span>
              <span class="rounded border border-border px-3 py-1 text-sm" :class="getOddsColor(match.odds.away)">{{ match.odds.away }}</span>
            </div>

            <button 
              @click.stop="openMatch(match)"
              class="rounded-md p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary"
            >
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredLeagues.length === 0" class="rounded-lg border border-border bg-card p-8 text-center">
        <p class="text-muted-foreground">{{ t.matches.noMatches }}</p>
      </div>

      <!-- Match Detail Modal -->
      <div v-if="selectedMatch" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" @click.self="selectedMatch = null">
        <div class="w-full max-w-2xl rounded-xl border border-border bg-card shadow-2xl">
          <div class="border-b border-border bg-muted/50 p-4">
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <img :src="selectedMatch.league.flag" class="h-4 w-4 rounded-sm" />
              <span>{{ selectedMatch.league.country }}</span>
              <ChevronRight class="h-3 w-3" />
              <span>{{ selectedMatch.league.name }} - {{ t.matches.round }} {{ selectedMatch.round }}</span>
              <button class="ml-auto" @click="selectedMatch = null">
                <X class="h-5 w-5" />
              </button>
            </div>
          </div>

          <div class="p-6">
            <div class="mb-4 text-center text-sm text-muted-foreground">
              {{ selectedMatch.date }} {{ selectedMatch.time }}
            </div>

            <div class="mb-6 flex items-center justify-center gap-8">
              <router-link :to="{ name: 'team', params: { teamId: getTeamSlug(selectedMatch.home.name) } }" class="flex flex-col items-center gap-2 transition-transform hover:scale-105">
                <img :src="selectedMatch.home.logo" :alt="selectedMatch.home.name" class="h-20 w-20 rounded-full bg-white p-2" />
                <span class="font-semibold">{{ selectedMatch.home.name }}</span>
              </router-link>
              <div class="text-center">
                <div v-if="selectedMatch.status === 'scheduled'" class="text-3xl font-bold text-muted-foreground">-</div>
                <div v-else class="text-3xl font-bold">{{ selectedMatch.home.goals }} - {{ selectedMatch.away.goals }}</div>
              </div>
              <router-link :to="{ name: 'team', params: { teamId: getTeamSlug(selectedMatch.away.name) } }" class="flex flex-col items-center gap-2 transition-transform hover:scale-105">
                <img :src="selectedMatch.away.logo" :alt="selectedMatch.away.name" class="h-20 w-20 rounded-full bg-white p-2" />
                <span class="font-semibold">{{ selectedMatch.away.name }}</span>
              </router-link>
            </div>

            <div class="mb-6 flex gap-2 border-b border-border">
              <button
                v-for="tab in modalTabs"
                :key="tab.id"
                class="px-4 py-2 text-sm font-medium transition-colors"
                :class="activeTab === tab.id ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'"
                @click="activeTab = tab.id"
              >
                {{ tab.label }}
              </button>
            </div>

            <div v-if="activeTab === 'MATCH'" class="space-y-4">
              <div class="flex gap-2">
                <button class="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">{{ t.matches.summary }}</button>
                <button class="rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary">{{ t.matches.lineups }}</button>
              </div>
              <div class="rounded-lg bg-muted/50 p-4">
                <h3 class="mb-2 text-sm font-medium text-muted-foreground">{{ t.matches.analysis.toUpperCase() }}</h3>
                <h2 class="mb-1 text-xl font-bold">{{ t.matches.matchPreview }}: {{ selectedMatch.home.name }} vs {{ selectedMatch.away.name }}</h2>
                <p class="text-sm text-primary">{{ t.matches.round }} {{ selectedMatch.round }} at {{ selectedMatch.venue }} on {{ selectedMatch.date }}</p>
              </div>
            </div>

            <div v-if="activeTab === 'ODDS'" class="space-y-4">
              <div class="flex gap-2">
                <button class="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">1X2</button>
                <button class="rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">{{ t.matches.overUnder }}</button>
                <button class="rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">{{ t.matches.btts }}</button>
              </div>
              <div class="rounded-lg border border-border p-4">
                <div class="mb-2 flex justify-between text-sm text-muted-foreground">
                  <span></span>
                  <span>1</span>
                  <span>X</span>
                  <span>2</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="h-8 w-20 rounded bg-green-600 px-2 py-1 text-xs font-bold text-white">UNIBET</div>
                    <span class="rounded border border-border px-2 py-0.5 text-xs">{{ t.matches.live.toUpperCase() }}</span>
                  </div>
                  <span class="rounded bg-primary/20 px-3 py-1 text-sm font-medium text-primary">↑ {{ selectedMatch.odds.home }}</span>
                  <span class="rounded bg-muted px-3 py-1 text-sm font-medium">{{ selectedMatch.odds.draw }}</span>
                  <span class="rounded bg-primary/20 px-3 py-1 text-sm font-medium text-primary">↑ {{ selectedMatch.odds.away }}</span>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'H2H'" class="text-center text-muted-foreground">
              {{ t.matches.h2h }} coming soon...
            </div>

            <div v-if="activeTab === 'STANDINGS'">
              <router-link :to="{ name: 'standings', params: { leagueId: 208 } }" class="inline-flex items-center gap-2 text-primary hover:underline">
                {{ t.matches.viewFullStandings }}
                <ChevronRight class="h-4 w-4" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import { Star, ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-vue-next'
import AppLayout from '@/components/AppLayout.vue'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

const filters = computed(() => [
  { id: 'all', label: t.value.matches.all },
  { id: 'live', label: t.value.matches.live },
  { id: 'ft', label: t.value.matches.fullTime },
  { id: 'scheduled', label: t.value.matches.scheduled }
])

const modalTabs = computed(() => [
  { id: 'MATCH', label: t.value.matches.match },
  { id: 'ODDS', label: t.value.matches.odds },
  { id: 'H2H', label: t.value.matches.h2h },
  { id: 'STANDINGS', label: t.value.matches.standings }
])

const activeFilter = ref('all')
const activeTab = ref('MATCH')
const selectedMatch = ref(null)
const selectedLeague = ref('all')
const showFollowedOnly = ref(false)
const followedTeams = ref(JSON.parse(localStorage.getItem('tc-followed-teams') || '[]'))

const teamIds = {
  'Antwerp': 328,
  'Club Brugge': 340,
  'Anderlecht': 2555,
  'Genk': 2709,
  'Cercle Brugge': 2641,
  'Standard Liège': 700,
  'Union Saint-Gilloise': 3958,
  'Sint-Truiden': 355,
  'Gent': 2402,
  'Mechelen': 2938,
  'Sporting Charleroi': 1087,
  'Zulte-Waregem': 1118,
  'Westerlo': 357,
  'La Louvière': 6722,
  'OH Leuven': 1947,
  'Dender': 2741
}

const getTeamSlug = (teamName) => teamIds[teamName] || teamName.toLowerCase().replace(/\s+/g, '-')

const allLeagues = ref([
  {
    id: 208,
    country: 'BELGIUM',
    name: 'Jupiler Pro League',
    flag: 'https://flagcdn.com/w40/be.png',
    matches: [
      {
        id: 1,
        time: '20:45',
        date: '31.01.2026',
        round: 24,
        venue: 'Bosuil Stadium',
        status: 'live',
        home: { name: 'Antwerp', logo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', goals: 1 },
        away: { name: 'Club Brugge', logo: 'https://cdn.sportmonks.com/images/soccer/teams/20/340.png', goals: 0 },
        odds: { home: '2.45', draw: '3.20', away: '2.80' },
        league: { country: 'BELGIUM', name: 'Jupiler Pro League', flag: 'https://flagcdn.com/w40/be.png' }
      },
      {
        id: 2,
        time: '18:30',
        date: '31.01.2026',
        round: 24,
        venue: 'Jan Breydel',
        status: 'ft',
        home: { name: 'Cercle Brugge', logo: 'https://cdn.sportmonks.com/images/soccer/teams/17/2641.png', goals: 2 },
        away: { name: 'Anderlecht', logo: 'https://cdn.sportmonks.com/images/soccer/teams/27/2555.png', goals: 1 },
        odds: { home: '3.10', draw: '3.40', away: '2.20' },
        league: { country: 'BELGIUM', name: 'Jupiler Pro League', flag: 'https://flagcdn.com/w40/be.png' }
      },
      {
        id: 3,
        time: '16:00',
        date: '31.01.2026',
        round: 24,
        venue: 'Cegeka Arena',
        status: 'ft',
        home: { name: 'Genk', logo: 'https://cdn.sportmonks.com/images/soccer/teams/21/2709.png', goals: 3 },
        away: { name: 'Standard Liège', logo: 'https://cdn.sportmonks.com/images/soccer/teams/28/700.png', goals: 0 },
        odds: { home: '1.85', draw: '3.60', away: '4.20' },
        league: { country: 'BELGIUM', name: 'Jupiler Pro League', flag: 'https://flagcdn.com/w40/be.png' }
      },
      {
        id: 8,
        time: '14:30',
        date: '31.01.2026',
        round: 24,
        venue: 'Stayen',
        status: 'ft',
        home: { name: 'Sint-Truiden', logo: 'https://cdn.sportmonks.com/images/soccer/teams/3/355.png', goals: 2 },
        away: { name: 'Gent', logo: 'https://cdn.sportmonks.com/images/soccer/teams/2/2402.png', goals: 2 },
        odds: { home: '2.60', draw: '3.30', away: '2.70' },
        league: { country: 'BELGIUM', name: 'Jupiler Pro League', flag: 'https://flagcdn.com/w40/be.png' }
      },
      {
        id: 9,
        time: '21:00',
        date: '31.01.2026',
        round: 24,
        venue: 'Joseph Marien Stadium',
        status: 'scheduled',
        home: { name: 'Union Saint-Gilloise', logo: 'https://cdn.sportmonks.com/images/soccer/teams/22/3958.png', goals: null },
        away: { name: 'Mechelen', logo: 'https://cdn.sportmonks.com/images/soccer/teams/26/2938.png', goals: null },
        odds: { home: '1.75', draw: '3.60', away: '4.50' },
        league: { country: 'BELGIUM', name: 'Jupiler Pro League', flag: 'https://flagcdn.com/w40/be.png' }
      }
    ]
  },
])

const isFollowed = (teamName) => followedTeams.value.includes(teamName)

const filteredLeagues = computed(() => {
  let leagues = allLeagues.value

  if (selectedLeague.value !== 'all') {
    leagues = leagues.filter(l => l.id === parseInt(selectedLeague.value))
  }

  return leagues.filter(league => {
    const matches = getFilteredMatches(league.matches)
    return matches.length > 0
  })
})

const getFilteredMatches = (matches) => {
  let filtered = matches

  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(m => m.status === activeFilter.value)
  }

  if (showFollowedOnly.value) {
    filtered = filtered.filter(m => 
      isFollowed(m.home.name) || isFollowed(m.away.name)
    )
  }

  return filtered
}

const openMatch = (match) => {
  selectedMatch.value = match
  activeTab.value = 'MATCH'
}

const getOddsColor = (odds) => {
  const value = parseFloat(odds)
  if (value < 2) return 'text-green-500'
  if (value > 4) return 'text-red-500'
  return ''
}

const prevDay = () => {}
const nextDay = () => {}

onMounted(() => {
  setTimeout(() => {
    toast(`⚽ ${t.value.matches.goal}! Antwerp 1 - 0 Club Brugge`, {
      description: "45' - M. Janssen scores from the penalty spot!",
      duration: 8000,
      action: {
        label: t.value.matches.viewMatch,
        onClick: () => {
          const match = allLeagues.value[0].matches[0]
          openMatch(match)
        }
      }
    })
  }, 2000)

  setTimeout(() => {
    toast.info(`🔔 ${t.value.matches.matchStartingSoon}`, {
      description: `Antwerp vs Club Brugge ${t.value.matches.kicksOffIn} 15 ${t.value.matches.minutes}`,
      duration: 5000
    })
  }, 6000)
})
</script>
