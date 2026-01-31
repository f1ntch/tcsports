import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const API_KEY = '06391acdb2cc83fd4d962fd74cbb2c55'
const LEAGUE_ID = 144 // Belgian Jupiler Pro League
const SEASON = 2024

const apiHeaders = {
  'x-apisports-key': API_KEY
}

async function fetchFromAPI(endpoint: string) {
  const response = await fetch(`https://v3.football.api-sports.io${endpoint}`, {
    headers: apiHeaders
  })
  return response.json()
}

Deno.serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Fetch standings
    console.log('Fetching standings...')
    const standingsData = await fetchFromAPI(`/standings?league=${LEAGUE_ID}&season=${SEASON}`)
    
    // Fetch teams
    console.log('Fetching teams...')
    const teamsData = await fetchFromAPI(`/teams?league=${LEAGUE_ID}&season=${SEASON}`)
    
    // Fetch fixtures (last 10 + next 10)
    console.log('Fetching fixtures...')
    const fixturesData = await fetchFromAPI(`/fixtures?league=${LEAGUE_ID}&season=${SEASON}&last=20`)
    
    // Fetch top scorers
    console.log('Fetching top scorers...')
    const scorersData = await fetchFromAPI(`/players/topscorers?league=${LEAGUE_ID}&season=${SEASON}`)

    const result = {
      league: {
        id: LEAGUE_ID,
        name: 'Jupiler Pro League',
        country: 'Belgium',
        season: SEASON
      },
      standings: standingsData.response?.[0]?.league?.standings?.[0] || [],
      teams: teamsData.response?.map((t: any) => ({
        id: t.team.id,
        name: t.team.name,
        logo: t.team.logo,
        venue: t.venue?.name,
        city: t.venue?.city
      })) || [],
      fixtures: fixturesData.response?.map((f: any) => ({
        id: f.fixture.id,
        date: f.fixture.date,
        status: f.fixture.status.short,
        home: {
          id: f.teams.home.id,
          name: f.teams.home.name,
          logo: f.teams.home.logo,
          goals: f.goals.home
        },
        away: {
          id: f.teams.away.id,
          name: f.teams.away.name,
          logo: f.teams.away.logo,
          goals: f.goals.away
        }
      })) || [],
      topScorers: scorersData.response?.slice(0, 10).map((p: any) => ({
        id: p.player.id,
        name: p.player.name,
        photo: p.player.photo,
        team: p.statistics[0]?.team?.name,
        goals: p.statistics[0]?.goals?.total || 0,
        assists: p.statistics[0]?.goals?.assists || 0,
        appearances: p.statistics[0]?.games?.appearences || 0
      })) || []
    }

    // Store in Supabase
    await supabase.from('jupiler_data').upsert({
      id: 1,
      data: result,
      updated_at: new Date().toISOString()
    })

    return new Response(JSON.stringify(result, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error('Error:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})

