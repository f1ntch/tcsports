<template>
  <AppLayout>
    <div class="container mx-auto px-4 py-8">
      <router-link to="/matches" class="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ChevronLeft class="h-4 w-4" />
        Back to Matches
      </router-link>

      <!-- Team Header -->
      <div class="mb-8 rounded-xl border border-border bg-card p-6">
        <div class="flex flex-col items-center gap-6 md:flex-row">
          <img :src="team.logo" :alt="team.name" class="h-32 w-32 rounded-full bg-white p-4 shadow-lg" />
          <div class="flex-1 text-center md:text-left">
            <div class="mb-2 flex items-center justify-center gap-3 md:justify-start">
              <h1 class="text-3xl font-bold">{{ team.name }}</h1>
              <button
                @click="toggleFollow"
                class="rounded-full p-2 transition-all"
                :class="isFollowed ? 'bg-yellow-500 text-white' : 'bg-muted text-muted-foreground hover:bg-yellow-500/20 hover:text-yellow-500'"
              >
                <Star class="h-6 w-6" :class="isFollowed ? 'fill-current' : ''" />
              </button>
            </div>
            <div class="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground md:justify-start">
              <div class="flex items-center gap-2">
                <img :src="team.countryFlag" :alt="team.country" class="h-4 w-4 rounded-sm" />
                <span>{{ team.country }}</span>
              </div>
              <span>•</span>
              <span>{{ team.league }}</span>
              <span>•</span>
              <span>Founded {{ team.founded }}</span>
            </div>
            <div class="mt-4 flex flex-wrap items-center justify-center gap-6 md:justify-start">
              <div class="text-center">
                <p class="text-2xl font-bold text-primary">{{ team.stats.position }}</p>
                <p class="text-xs text-muted-foreground">League Position</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold">{{ team.stats.played }}</p>
                <p class="text-xs text-muted-foreground">Played</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-green-500">{{ team.stats.wins }}</p>
                <p class="text-xs text-muted-foreground">Wins</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-muted-foreground">{{ team.stats.draws }}</p>
                <p class="text-xs text-muted-foreground">Draws</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-red-500">{{ team.stats.losses }}</p>
                <p class="text-xs text-muted-foreground">Losses</p>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="rounded-lg bg-muted/50 p-4 text-center">
              <p class="text-xs text-muted-foreground">Stadium</p>
              <p class="font-medium">{{ team.stadium }}</p>
              <p class="text-sm text-muted-foreground">{{ team.capacity }} seats</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6 flex gap-2 border-b border-border">
        <button
          v-for="tab in ['MATCHES', 'SQUAD', 'STATS']"
          :key="tab"
          class="px-4 py-2 text-sm font-medium transition-colors"
          :class="activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Matches Tab -->
      <div v-if="activeTab === 'MATCHES'" class="space-y-6">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="filter in ['ALL', 'LEAGUE', 'CUP']"
            :key="filter"
            class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            :class="competitionFilter === filter ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-primary/10'"
            @click="competitionFilter = filter"
          >
            {{ filter }}
          </button>
          <div class="ml-auto flex gap-2">
            <button
              v-for="filter in ['ALL', 'HOME', 'AWAY']"
              :key="filter"
              class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
              :class="matchFilter === filter ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-primary/10'"
              @click="matchFilter = filter"
            >
              {{ filter }}
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <div
            v-for="match in filteredMatches"
            :key="match.id"
            class="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary"
            :class="{ 'opacity-60': match.status === 'upcoming' }"
          >
            <div class="w-24 text-center">
              <p class="text-xs text-muted-foreground">{{ match.date }}</p>
              <p class="text-xs font-medium" :class="match.competition === 'Cup' ? 'text-amber-500' : 'text-primary'">{{ match.competition }}</p>
              <p v-if="match.round" class="text-xs text-muted-foreground">{{ match.round }}</p>
            </div>
            
            <div class="flex flex-1 items-center justify-center gap-4">
              <div class="flex items-center gap-2 min-w-[140px] justify-end">
                <span class="text-right font-medium" :class="match.isHome ? 'text-primary' : ''">{{ match.homeTeam }}</span>
                <img :src="match.homeLogo" class="h-6 w-6" />
              </div>
              
              <div class="min-w-[70px] rounded px-3 py-1 text-center" :class="match.status === 'played' ? 'bg-muted' : 'bg-muted/50'">
                <span v-if="match.status === 'played'" class="font-bold">{{ match.homeScore }} - {{ match.awayScore }}</span>
                <span v-else class="text-sm text-muted-foreground">{{ match.time }}</span>
              </div>
              
              <div class="flex items-center gap-2 min-w-[140px]">
                <img :src="match.awayLogo" class="h-6 w-6" />
                <span class="font-medium" :class="!match.isHome ? 'text-primary' : ''">{{ match.awayTeam }}</span>
              </div>
            </div>

            <div class="w-16 text-center">
              <span
                v-if="match.status === 'played'"
                class="inline-block rounded px-2 py-0.5 text-xs font-medium"
                :class="getResultClass(match)"
              >
                {{ getResult(match) }}
              </span>
              <span v-else class="text-xs text-muted-foreground">{{ match.status === 'upcoming' ? 'Upcoming' : '' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Squad Tab -->
      <div v-if="activeTab === 'SQUAD'" class="space-y-6">
        <div v-for="position in ['Goalkeepers', 'Defenders', 'Midfielders', 'Forwards']" :key="position">
          <h3 class="mb-3 text-lg font-semibold">{{ position }}</h3>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="player in getPlayersByPosition(position)"
              :key="player.number"
              class="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary"
            >
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {{ player.number }}
              </div>
              <div class="flex-1">
                <p class="font-medium">{{ player.name }}</p>
                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                  <img :src="player.countryFlag" class="h-3 w-3 rounded-sm" />
                  <span>{{ player.country }}</span>
                  <span>•</span>
                  <span>{{ player.age }} yrs</span>
                </div>
              </div>
              <div class="text-right text-sm">
                <p v-if="player.goals" class="text-green-500">{{ player.goals }} goals</p>
                <p v-if="player.assists" class="text-blue-500">{{ player.assists }} assists</p>
                <p v-if="player.cleanSheets" class="text-purple-500">{{ player.cleanSheets }} CS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Tab -->
      <div v-if="activeTab === 'STATS'" class="grid gap-6 md:grid-cols-2">
        <div class="rounded-lg border border-border bg-card p-6">
          <h3 class="mb-4 text-lg font-semibold">Season Statistics</h3>
          <div class="space-y-4">
            <div v-for="stat in seasonStats" :key="stat.label">
              <div class="mb-1 flex justify-between text-sm">
                <span class="text-muted-foreground">{{ stat.label }}</span>
                <span class="font-medium">{{ stat.value }}</span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-muted">
                <div class="h-full rounded-full bg-primary" :style="{ width: stat.percentage + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-lg border border-border bg-card p-6">
          <h3 class="mb-4 text-lg font-semibold">Top Performers</h3>
          <div class="space-y-4">
            <div v-for="(performer, index) in topPerformers" :key="performer.name" class="flex items-center gap-3">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">{{ index + 1 }}</span>
              <div class="flex-1">
                <p class="font-medium">{{ performer.name }}</p>
                <p class="text-xs text-muted-foreground">{{ performer.position }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-primary">{{ performer.goals }}</p>
                <p class="text-xs text-muted-foreground">goals</p>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-lg border border-border bg-card p-6 md:col-span-2">
          <h3 class="mb-4 text-lg font-semibold">Recent Form</h3>
          <div class="flex justify-center gap-2">
            <div
              v-for="(result, index) in team.form"
              :key="index"
              class="flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold text-white"
              :class="result === 'W' ? 'bg-green-500' : result === 'D' ? 'bg-gray-400' : 'bg-red-500'"
            >
              {{ result }}
            </div>
          </div>
          <p class="mt-4 text-center text-sm text-muted-foreground">Last 5 matches</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { ChevronLeft, Star } from 'lucide-vue-next'
import AppLayout from '@/components/AppLayout.vue'

const route = useRoute()
const activeTab = ref('MATCHES')
const matchFilter = ref('ALL')
const competitionFilter = ref('ALL')
const followedTeams = ref(JSON.parse(localStorage.getItem('tc-followed-teams') || '[]'))

const team = ref({
  id: 328,
  name: 'Antwerp FC',
  logo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png',
  country: 'Belgium',
  countryFlag: 'https://flagcdn.com/w40/be.png',
  league: 'Jupiler Pro League',
  founded: 1880,
  stadium: 'Bosuil Stadium',
  capacity: '16,649',
  form: ['L', 'L', 'W', 'W', 'D'],
  stats: { position: 8, played: 22, wins: 7, draws: 6, losses: 9, goalsFor: 24, goalsAgainst: 24, points: 27 }
})

const isFollowed = computed(() => followedTeams.value.includes(team.value.name))

const toggleFollow = () => {
  if (isFollowed.value) {
    followedTeams.value = followedTeams.value.filter(t => t !== team.value.name)
    toast.info(`Unfollowed ${team.value.name}`)
  } else {
    followedTeams.value.push(team.value.name)
    toast.success(`Now following ${team.value.name}!`, {
      description: 'You will receive notifications for this team'
    })
  }
  localStorage.setItem('tc-followed-teams', JSON.stringify(followedTeams.value))
}

const matches = ref([
  // Upcoming matches
  { id: 19428744, date: '31 Jan', time: '16:00', competition: 'League', round: 'Round 23', homeTeam: 'Cercle Brugge', homeLogo: 'https://cdn.sportmonks.com/images/soccer/teams/17/2641.png', awayTeam: 'Antwerp', awayLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', homeScore: null, awayScore: null, status: 'upcoming', isHome: false },
  { id: 19640897, date: '05 Feb', time: '20:30', competition: 'Cup', round: 'Semi-final', homeTeam: 'Anderlecht', homeLogo: 'https://cdn.sportmonks.com/images/soccer/teams/27/2555.png', awayTeam: 'Antwerp', awayLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', homeScore: null, awayScore: null, status: 'upcoming', isHome: false },
  { id: 19428756, date: '08 Feb', time: '19:15', competition: 'League', round: 'Round 24', homeTeam: 'Mechelen', homeLogo: 'https://cdn.sportmonks.com/images/soccer/teams/26/2938.png', awayTeam: 'Antwerp', awayLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', homeScore: null, awayScore: null, status: 'upcoming', isHome: false },
  { id: 19640895, date: '12 Feb', time: '20:30', competition: 'Cup', round: 'Semi-final', homeTeam: 'Antwerp', homeLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', awayTeam: 'Anderlecht', awayLogo: 'https://cdn.sportmonks.com/images/soccer/teams/27/2555.png', homeScore: null, awayScore: null, status: 'upcoming', isHome: true },
  { id: 19428764, date: '15 Feb', time: '16:00', competition: 'League', round: 'Round 25', homeTeam: 'Antwerp', homeLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', awayTeam: 'Westerlo', awayLogo: 'https://cdn.sportmonks.com/images/soccer/teams/5/357.png', homeScore: null, awayScore: null, status: 'upcoming', isHome: true },
  
  // Recent results (most recent first)
  { id: 19428741, date: '25 Jan', time: '13:30', competition: 'League', round: 'Round 22', homeTeam: 'Antwerp', homeLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', awayTeam: 'Charleroi', awayLogo: 'https://cdn.sportmonks.com/images/soccer/teams/31/1087.png', homeScore: 0, awayScore: 2, status: 'played', isHome: true },
  { id: 19428729, date: '18 Jan', time: '16:00', competition: 'League', round: 'Round 21', homeTeam: 'Dender', homeLogo: 'https://cdn.sportmonks.com/images/soccer/teams/21/2741.png', awayTeam: 'Antwerp', awayLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', homeScore: 1, awayScore: 0, status: 'played', isHome: false },
  { id: 19608785, date: '13 Jan', time: '20:30', competition: 'Cup', round: 'Quarter-final', homeTeam: 'Antwerp', homeLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', awayTeam: 'La Louvière', awayLogo: 'https://cdn.sportmonks.com/images/soccer/teams/2/6722.png', homeScore: 2, awayScore: 1, status: 'played', isHome: true, extraTime: true },
  { id: 19428725, date: '27 Dec', time: '13:30', competition: 'League', round: 'Round 20', homeTeam: 'Antwerp', homeLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', awayTeam: 'Zulte-Waregem', awayLogo: 'https://cdn.sportmonks.com/images/soccer/teams/30/1118.png', homeScore: 2, awayScore: 1, status: 'played', isHome: true },
  { id: 19428717, date: '21 Dec', time: '18:30', competition: 'League', round: 'Round 19', homeTeam: 'Antwerp', homeLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', awayTeam: 'Anderlecht', awayLogo: 'https://cdn.sportmonks.com/images/soccer/teams/27/2555.png', homeScore: 2, awayScore: 2, status: 'played', isHome: true },
  { id: 19428706, date: '14 Dec', time: '13:30', competition: 'League', round: 'Round 18', homeTeam: 'Gent', homeLogo: 'https://cdn.sportmonks.com/images/soccer/teams/2/2402.png', awayTeam: 'Antwerp', awayLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', homeScore: 0, awayScore: 2, status: 'played', isHome: false },
  { id: 19428701, date: '07 Dec', time: '18:30', competition: 'League', round: 'Round 17', homeTeam: 'Antwerp', homeLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', awayTeam: 'Genk', awayLogo: 'https://cdn.sportmonks.com/images/soccer/teams/21/2709.png', homeScore: 3, awayScore: 0, status: 'played', isHome: true },
  { id: 19428688, date: '30 Nov', time: '13:30', competition: 'League', round: 'Round 16', homeTeam: 'Club Brugge', homeLogo: 'https://cdn.sportmonks.com/images/soccer/teams/20/340.png', awayTeam: 'Antwerp', awayLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', homeScore: 0, awayScore: 1, status: 'played', isHome: false },
  { id: 19428685, date: '23 Nov', time: '16:00', competition: 'League', round: 'Round 15', homeTeam: 'Antwerp', homeLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', awayTeam: 'Dender', awayLogo: 'https://cdn.sportmonks.com/images/soccer/teams/21/2741.png', homeScore: 1, awayScore: 2, status: 'played', isHome: true },
  { id: 19428677, date: '08 Nov', time: '20:45', competition: 'League', round: 'Round 14', homeTeam: 'Antwerp', homeLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', awayTeam: 'La Louvière', awayLogo: 'https://cdn.sportmonks.com/images/soccer/teams/2/6722.png', homeScore: 3, awayScore: 1, status: 'played', isHome: true },
  { id: 19428669, date: '02 Nov', time: '18:30', competition: 'League', round: 'Round 13', homeTeam: 'Sint-Truiden', homeLogo: 'https://cdn.sportmonks.com/images/soccer/teams/3/355.png', awayTeam: 'Antwerp', awayLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', homeScore: 1, awayScore: 0, status: 'played', isHome: false },
  { id: 19428662, date: '26 Oct', time: '13:30', competition: 'League', round: 'Round 12', homeTeam: 'Antwerp', homeLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', awayTeam: 'Club Brugge', awayLogo: 'https://cdn.sportmonks.com/images/soccer/teams/20/340.png', homeScore: 0, awayScore: 1, status: 'played', isHome: true },
  { id: 19428654, date: '20 Oct', time: '14:00', competition: 'League', round: 'Round 11', homeTeam: 'Standard Liège', homeLogo: 'https://cdn.sportmonks.com/images/soccer/teams/28/700.png', awayTeam: 'Antwerp', awayLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', homeScore: 1, awayScore: 0, status: 'played', isHome: false },
  { id: 19428646, date: '04 Oct', time: '19:45', competition: 'League', round: 'Round 10', homeTeam: 'Antwerp', homeLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', awayTeam: 'Cercle Brugge', awayLogo: 'https://cdn.sportmonks.com/images/soccer/teams/17/2641.png', homeScore: 1, awayScore: 1, status: 'played', isHome: true },
])

const filteredMatches = computed(() => {
  let filtered = matches.value

  if (matchFilter.value === 'HOME') {
    filtered = filtered.filter(m => m.isHome)
  } else if (matchFilter.value === 'AWAY') {
    filtered = filtered.filter(m => !m.isHome)
  }

  if (competitionFilter.value === 'LEAGUE') {
    filtered = filtered.filter(m => m.competition === 'League')
  } else if (competitionFilter.value === 'CUP') {
    filtered = filtered.filter(m => m.competition === 'Cup')
  }

  return filtered
})

const getResult = (match) => {
  const antScore = match.isHome ? match.homeScore : match.awayScore
  const oppScore = match.isHome ? match.awayScore : match.homeScore
  if (antScore > oppScore) return 'W'
  if (antScore < oppScore) return 'L'
  return 'D'
}

const getResultClass = (match) => {
  const result = getResult(match)
  if (result === 'W') return 'bg-green-500 text-white'
  if (result === 'L') return 'bg-red-500 text-white'
  return 'bg-gray-400 text-white'
}

const players = ref([
  { number: 1, name: 'Jean Butez', position: 'Goalkeepers', country: 'France', countryFlag: 'https://flagcdn.com/w40/fr.png', age: 28, cleanSheets: 5 },
  { number: 26, name: 'Senne Lammens', position: 'Goalkeepers', country: 'Belgium', countryFlag: 'https://flagcdn.com/w40/be.png', age: 22, cleanSheets: 2 },
  { number: 2, name: 'Jelle Bataille', position: 'Defenders', country: 'Belgium', countryFlag: 'https://flagcdn.com/w40/be.png', age: 25, goals: 1, assists: 3 },
  { number: 4, name: 'Toby Alderweireld', position: 'Defenders', country: 'Belgium', countryFlag: 'https://flagcdn.com/w40/be.png', age: 35, goals: 1, assists: 1 },
  { number: 5, name: 'Zeno Van den Bosch', position: 'Defenders', country: 'Belgium', countryFlag: 'https://flagcdn.com/w40/be.png', age: 20, goals: 0, assists: 1 },
  { number: 3, name: 'Dinis Almeida', position: 'Defenders', country: 'Portugal', countryFlag: 'https://flagcdn.com/w40/pt.png', age: 24, goals: 0, assists: 2 },
  { number: 21, name: 'Björn Engels', position: 'Defenders', country: 'Belgium', countryFlag: 'https://flagcdn.com/w40/be.png', age: 30, goals: 1, assists: 0 },
  { number: 6, name: 'Mandela Keita', position: 'Midfielders', country: 'Belgium', countryFlag: 'https://flagcdn.com/w40/be.png', age: 21, goals: 2, assists: 2 },
  { number: 8, name: 'Kobe Corbanie', position: 'Midfielders', country: 'Belgium', countryFlag: 'https://flagcdn.com/w40/be.png', age: 21, goals: 1, assists: 3 },
  { number: 10, name: 'Jacob Ondrejka', position: 'Midfielders', country: 'Slovakia', countryFlag: 'https://flagcdn.com/w40/sk.png', age: 22, goals: 4, assists: 5 },
  { number: 14, name: 'Tjaronn Chery', position: 'Midfielders', country: 'Suriname', countryFlag: 'https://flagcdn.com/w40/sr.png', age: 36, goals: 3, assists: 4 },
  { number: 20, name: 'Michel-Ange Balikwisha', position: 'Midfielders', country: 'Belgium', countryFlag: 'https://flagcdn.com/w40/be.png', age: 23, goals: 4, assists: 6 },
  { number: 9, name: 'Vincent Janssen', position: 'Forwards', country: 'Netherlands', countryFlag: 'https://flagcdn.com/w40/nl.png', age: 30, goals: 8, assists: 4 },
  { number: 11, name: 'Tolu Arokodare', position: 'Forwards', country: 'Nigeria', countryFlag: 'https://flagcdn.com/w40/ng.png', age: 24, goals: 5, assists: 2 },
  { number: 7, name: 'Gyrano Kerk', position: 'Forwards', country: 'Netherlands', countryFlag: 'https://flagcdn.com/w40/nl.png', age: 28, goals: 3, assists: 3 },
])

const getPlayersByPosition = (position) => players.value.filter(p => p.position === position)

const seasonStats = ref([
  { label: 'Goals Scored', value: 24, percentage: 48 },
  { label: 'Goals Conceded', value: 24, percentage: 48 },
  { label: 'Clean Sheets', value: 5, percentage: 23 },
  { label: 'Possession Avg', value: '49%', percentage: 49 },
  { label: 'Pass Accuracy', value: '76%', percentage: 76 },
])

const topPerformers = ref([
  { name: 'Vincent Janssen', position: 'Forward', goals: 8 },
  { name: 'Tolu Arokodare', position: 'Forward', goals: 5 },
  { name: 'Michel-Ange Balikwisha', position: 'Midfielder', goals: 4 },
  { name: 'Jacob Ondrejka', position: 'Midfielder', goals: 4 },
])
</script>
