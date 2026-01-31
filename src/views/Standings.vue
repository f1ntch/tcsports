<template>
  <AppLayout>
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <router-link to="/matches" class="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ChevronLeft class="h-4 w-4" />
          Back to Matches
        </router-link>
        <div class="flex items-center gap-4">
          <img :src="currentLeague.flag" :alt="currentLeague.country" class="h-8 w-8 rounded" />
          <div>
            <h1 class="text-2xl font-bold">{{ currentLeague.name }}</h1>
            <p class="text-sm text-muted-foreground">{{ currentLeague.country }} - Season 2025/26</p>
          </div>
        </div>
      </div>

      <div class="mb-4 flex gap-2">
        <button
          v-for="tab in ['TABLE', 'FORM', 'TOP SCORERS']"
          :key="tab"
          class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
          :class="activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-primary/10'"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>

      <div v-if="activeTab === 'TABLE'" class="rounded-lg border border-border bg-card overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-muted/50 text-sm">
              <th class="px-4 py-3 text-left font-medium">#</th>
              <th class="px-4 py-3 text-left font-medium">Team</th>
              <th class="px-4 py-3 text-center font-medium">P</th>
              <th class="px-4 py-3 text-center font-medium">W</th>
              <th class="px-4 py-3 text-center font-medium">D</th>
              <th class="px-4 py-3 text-center font-medium">L</th>
              <th class="px-4 py-3 text-center font-medium">GF</th>
              <th class="px-4 py-3 text-center font-medium">GA</th>
              <th class="px-4 py-3 text-center font-medium">GD</th>
              <th class="px-4 py-3 text-center font-medium">Pts</th>
              <th class="px-4 py-3 text-center font-medium">Form</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="team in standings"
              :key="team.name"
              class="border-b border-border transition-colors hover:bg-muted/30"
              :class="getPositionClass(team.position)"
            >
              <td class="px-4 py-3 text-sm">
                <span class="flex h-6 w-6 items-center justify-center rounded" :class="getPositionBadgeClass(team.position)">
                  {{ team.position }}
                </span>
              </td>
              <td class="px-4 py-3">
                <router-link :to="{ name: 'team', params: { teamId: team.id } }" class="flex items-center gap-3 hover:text-primary">
                  <img :src="team.logo" :alt="team.name" class="h-6 w-6" />
                  <span class="font-medium" :class="isFollowed(team.name) ? 'text-yellow-500' : ''">
                    {{ team.name }}
                    <Star v-if="isFollowed(team.name)" class="ml-1 inline h-3 w-3 fill-yellow-500 text-yellow-500" />
                  </span>
                </router-link>
                <button @click.stop="toggleFollow(team.name)" class="ml-2 text-muted-foreground hover:text-yellow-500">
                  <Star class="h-4 w-4" :class="isFollowed(team.name) ? 'fill-yellow-500 text-yellow-500' : ''" />
                </button>
              </td>
              <td class="px-4 py-3 text-center text-sm">{{ team.played }}</td>
              <td class="px-4 py-3 text-center text-sm text-green-500">{{ team.won }}</td>
              <td class="px-4 py-3 text-center text-sm text-muted-foreground">{{ team.drawn }}</td>
              <td class="px-4 py-3 text-center text-sm text-red-500">{{ team.lost }}</td>
              <td class="px-4 py-3 text-center text-sm">{{ team.goalsFor }}</td>
              <td class="px-4 py-3 text-center text-sm">{{ team.goalsAgainst }}</td>
              <td class="px-4 py-3 text-center text-sm" :class="team.goalDiff > 0 ? 'text-green-500' : team.goalDiff < 0 ? 'text-red-500' : ''">
                {{ team.goalDiff > 0 ? '+' : '' }}{{ team.goalDiff }}
              </td>
              <td class="px-4 py-3 text-center text-sm font-bold">{{ team.points }}</td>
              <td class="px-4 py-3">
                <div class="flex justify-center gap-1">
                  <span
                    v-for="(result, i) in team.form"
                    :key="i"
                    class="flex h-5 w-5 items-center justify-center rounded text-xs font-bold text-white"
                    :class="result === 'W' ? 'bg-green-500' : result === 'D' ? 'bg-gray-400' : 'bg-red-500'"
                  >
                    {{ result }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="activeTab === 'TABLE'" class="mt-4 flex flex-wrap gap-4 text-sm">
        <div class="flex items-center gap-2">
          <span class="h-3 w-3 rounded bg-green-500"></span>
          <span class="text-muted-foreground">Championship Round</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="h-3 w-3 rounded bg-orange-500"></span>
          <span class="text-muted-foreground">Conference League Playoff</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="h-3 w-3 rounded bg-red-500"></span>
          <span class="text-muted-foreground">Relegation Round</span>
        </div>
      </div>

      <div v-if="activeTab === 'TOP SCORERS'" class="rounded-lg border border-border bg-card overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-muted/50 text-sm">
              <th class="px-4 py-3 text-left font-medium">#</th>
              <th class="px-4 py-3 text-left font-medium">Player</th>
              <th class="px-4 py-3 text-left font-medium">Team</th>
              <th class="px-4 py-3 text-center font-medium">Goals</th>
              <th class="px-4 py-3 text-center font-medium">Assists</th>
              <th class="px-4 py-3 text-center font-medium">Matches</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(scorer, index) in topScorers"
              :key="scorer.name"
              class="border-b border-border transition-colors hover:bg-muted/30"
            >
              <td class="px-4 py-3 text-sm font-medium">{{ index + 1 }}</td>
              <td class="px-4 py-3 font-medium">{{ scorer.name }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <img :src="scorer.teamLogo" :alt="scorer.team" class="h-5 w-5" />
                  <span class="text-sm text-muted-foreground">{{ scorer.team }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-center font-bold text-primary">{{ scorer.goals }}</td>
              <td class="px-4 py-3 text-center text-sm">{{ scorer.assists }}</td>
              <td class="px-4 py-3 text-center text-sm text-muted-foreground">{{ scorer.matches }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="activeTab === 'FORM'" class="space-y-4">
        <div v-for="team in standings" :key="team.name" class="rounded-lg border border-border bg-card p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="w-6 text-center text-sm font-medium text-muted-foreground">{{ team.position }}</span>
              <img :src="team.logo" :alt="team.name" class="h-8 w-8" />
              <span class="font-medium">{{ team.name }}</span>
              <span class="text-sm text-muted-foreground">{{ team.points }} pts</span>
            </div>
            <div class="flex gap-1">
              <span
                v-for="(result, i) in team.form"
                :key="i"
                class="flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-white"
                :class="result === 'W' ? 'bg-green-500' : result === 'D' ? 'bg-gray-400' : 'bg-red-500'"
              >
                {{ result }}
              </span>
            </div>
          </div>
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
const activeTab = ref('TABLE')
const followedTeams = ref(JSON.parse(localStorage.getItem('tc-followed-teams') || '[]'))

const leagues = {
  1: { id: 1, name: 'Jupiler Pro League', country: 'BELGIUM', flag: 'https://flagcdn.com/w40/be.png' },
  208: { id: 208, name: 'Jupiler Pro League', country: 'BELGIUM', flag: 'https://flagcdn.com/w40/be.png' }
}

const currentLeague = computed(() => {
  const id = parseInt(route.params.leagueId) || 208
  return leagues[id] || leagues[208]
})

const isFollowed = (teamName) => followedTeams.value.includes(teamName)

const toggleFollow = (teamName) => {
  if (isFollowed(teamName)) {
    followedTeams.value = followedTeams.value.filter(t => t !== teamName)
    toast.info(`Unfollowed ${teamName}`)
  } else {
    followedTeams.value.push(teamName)
    toast.success(`Now following ${teamName}!`)
  }
  localStorage.setItem('tc-followed-teams', JSON.stringify(followedTeams.value))
}

const getPositionClass = (pos) => {
  if (pos <= 6) return 'bg-green-500/10'
  if (pos >= 7 && pos <= 12) return 'bg-orange-500/10'
  if (pos >= 13) return 'bg-red-500/10'
  return ''
}

const getPositionBadgeClass = (pos) => {
  if (pos <= 6) return 'bg-green-500 text-white'
  if (pos >= 7 && pos <= 12) return 'bg-orange-500 text-white'
  if (pos >= 13) return 'bg-red-500 text-white'
  return 'bg-muted'
}

const standings = ref([
  { position: 1, id: 3958, name: 'Union Saint-Gilloise', logo: 'https://cdn.sportmonks.com/images/soccer/teams/22/3958.png', played: 22, won: 13, drawn: 7, lost: 2, goalsFor: 37, goalsAgainst: 12, goalDiff: 25, points: 46, form: ['W', 'D', 'W', 'D', 'D'] },
  { position: 2, id: 355, name: 'Sint-Truiden', logo: 'https://cdn.sportmonks.com/images/soccer/teams/3/355.png', played: 22, won: 14, drawn: 3, lost: 5, goalsFor: 33, goalsAgainst: 24, goalDiff: 9, points: 45, form: ['W', 'W', 'W', 'W', 'W'] },
  { position: 3, id: 340, name: 'Club Brugge', logo: 'https://cdn.sportmonks.com/images/soccer/teams/20/340.png', played: 22, won: 14, drawn: 2, lost: 6, goalsFor: 42, goalsAgainst: 28, goalDiff: 14, points: 44, form: ['W', 'L', 'W', 'W', 'L'] },
  { position: 4, id: 2555, name: 'Anderlecht', logo: 'https://cdn.sportmonks.com/images/soccer/teams/27/2555.png', played: 22, won: 10, drawn: 6, lost: 6, goalsFor: 30, goalsAgainst: 26, goalDiff: 4, points: 36, form: ['L', 'L', 'D', 'D', 'D'] },
  { position: 5, id: 2402, name: 'Gent', logo: 'https://cdn.sportmonks.com/images/soccer/teams/2/2402.png', played: 23, won: 9, drawn: 6, lost: 8, goalsFor: 37, goalsAgainst: 32, goalDiff: 5, points: 33, form: ['W', 'W', 'W', 'D', 'D'] },
  { position: 6, id: 2938, name: 'Mechelen', logo: 'https://cdn.sportmonks.com/images/soccer/teams/26/2938.png', played: 22, won: 8, drawn: 8, lost: 6, goalsFor: 26, goalsAgainst: 24, goalDiff: 2, points: 32, form: ['D', 'L', 'D', 'W', 'D'] },
  { position: 7, id: 1087, name: 'Sporting Charleroi', logo: 'https://cdn.sportmonks.com/images/soccer/teams/31/1087.png', played: 22, won: 8, drawn: 6, lost: 8, goalsFor: 27, goalsAgainst: 26, goalDiff: 1, points: 30, form: ['W', 'W', 'W', 'D', 'D'] },
  { position: 8, id: 328, name: 'Antwerp', logo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', played: 22, won: 7, drawn: 6, lost: 9, goalsFor: 24, goalsAgainst: 24, goalDiff: 0, points: 27, form: ['L', 'L', 'W', 'W', 'D'] },
  { position: 9, id: 700, name: 'Standard Liège', logo: 'https://cdn.sportmonks.com/images/soccer/teams/28/700.png', played: 22, won: 8, drawn: 3, lost: 11, goalsFor: 18, goalsAgainst: 29, goalDiff: -11, points: 27, form: ['L', 'L', 'L', 'W', 'W'] },
  { position: 10, id: 1118, name: 'Zulte-Waregem', logo: 'https://cdn.sportmonks.com/images/soccer/teams/30/1118.png', played: 22, won: 6, drawn: 8, lost: 8, goalsFor: 31, goalsAgainst: 34, goalDiff: -3, points: 26, form: ['L', 'W', 'L', 'D', 'D'] },
  { position: 11, id: 2709, name: 'Genk', logo: 'https://cdn.sportmonks.com/images/soccer/teams/21/2709.png', played: 22, won: 6, drawn: 8, lost: 8, goalsFor: 29, goalsAgainst: 34, goalDiff: -5, points: 26, form: ['D', 'L', 'L', 'L', 'D'] },
  { position: 12, id: 357, name: 'Westerlo', logo: 'https://cdn.sportmonks.com/images/soccer/teams/5/357.png', played: 22, won: 6, drawn: 7, lost: 9, goalsFor: 29, goalsAgainst: 33, goalDiff: -4, points: 25, form: ['D', 'L', 'L', 'W', 'D'] },
  { position: 13, id: 6722, name: 'La Louvière', logo: 'https://cdn.sportmonks.com/images/soccer/teams/2/6722.png', played: 23, won: 5, drawn: 9, lost: 9, goalsFor: 20, goalsAgainst: 26, goalDiff: -6, points: 24, form: ['D', 'W', 'L', 'D', 'L'] },
  { position: 14, id: 2641, name: 'Cercle Brugge', logo: 'https://cdn.sportmonks.com/images/soccer/teams/17/2641.png', played: 22, won: 4, drawn: 9, lost: 9, goalsFor: 28, goalsAgainst: 31, goalDiff: -3, points: 21, form: ['D', 'W', 'D', 'D', 'W'] },
  { position: 15, id: 1947, name: 'OH Leuven', logo: 'https://cdn.sportmonks.com/images/soccer/teams/27/1947.png', played: 22, won: 5, drawn: 6, lost: 11, goalsFor: 19, goalsAgainst: 30, goalDiff: -11, points: 21, form: ['D', 'L', 'W', 'L', 'D'] },
  { position: 16, id: 2741, name: 'Dender', logo: 'https://cdn.sportmonks.com/images/soccer/teams/21/2741.png', played: 22, won: 3, drawn: 8, lost: 11, goalsFor: 17, goalsAgainst: 34, goalDiff: -17, points: 17, form: ['D', 'W', 'D', 'W', 'D'] }
])

const topScorers = ref([
  { name: 'Mohamed Amoura', team: 'Union SG', teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/22/3958.png', goals: 14, assists: 4, matches: 22 },
  { name: 'Adriano Bertaccini', team: 'Sint-Truiden', teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/3/355.png', goals: 13, assists: 3, matches: 21 },
  { name: 'Gustaf Nilsson', team: 'Club Brugge', teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/20/340.png', goals: 12, assists: 5, matches: 22 },
  { name: 'Kasper Dolberg', team: 'Anderlecht', teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/27/2555.png', goals: 10, assists: 4, matches: 20 },
  { name: 'Vincent Janssen', team: 'Antwerp', teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', goals: 8, assists: 4, matches: 22 },
  { name: 'Hugo Cuypers', team: 'Gent', teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/2/2402.png', goals: 8, assists: 6, matches: 23 },
  { name: 'Mandela Keita', team: 'Antwerp', teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', goals: 7, assists: 3, matches: 19 },
  { name: 'Tolu Arokodare', team: 'Genk', teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/21/2709.png', goals: 7, assists: 2, matches: 20 }
])
</script>
