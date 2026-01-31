import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SPORT_IMAGES: Record<string, string[]> = {
  'Soccer': ['photo-1574629810360-7efbbe195018', 'photo-1553778263-73a83bab9b0c', 'photo-1606925797300-0b35e9d1794e'],
  'Football': ['photo-1574629810360-7efbbe195018', 'photo-1553778263-73a83bab9b0c'],
  'Basketball': ['https://cdn.nba.com/manage/2026/01/brooks-cavs-013026-scaled.jpg', 'https://cdn.sortiraparis.com/images/80/66131/1142464-nba-paris-games-notre-strategie-ici-est-de-rendre-le-basketball-aussi-accessible-que-possible.jpg'],
  'NBA': ['https://cdn.nba.com/manage/2026/01/brooks-cavs-013026-scaled.jpg', 'https://cdn.sortiraparis.com/images/80/66131/1142464-nba-paris-games-notre-strategie-ici-est-de-rendre-le-basketball-aussi-accessible-que-possible.jpg'],
  'Antwerp Giants': ['https://dam.beatvenues.be/a0WP500000HyatGMAR_original.jpg'],
  'Tennis': ['photo-1554068865-24cecd4e34b8', 'photo-1595435934249-5df7ed86e1c0', 'photo-1622279457486-62dcc4a431d6'],
  'Formula 1': ['https://upload.wikimedia.org/wikipedia/commons/1/14/2010_Malaysian_GP_opening_lap.jpg'],
  'Motorsport': ['photo-1541348263662-e068662d82af', 'photo-1503376780353-7e6692767b70'],
  'Auto Racing': ['photo-1541348263662-e068662d82af', 'photo-1503376780353-7e6692767b70'],
  'IndyCar': ['photo-1568605117036-5fe5e7bab0b7', 'photo-1541348263662-e068662d82af'],
  'Indy Car': ['photo-1568605117036-5fe5e7bab0b7', 'photo-1541348263662-e068662d82af'],
  'Ice Hockey': ['photo-1515703407324-5f753afd8be8', 'photo-1580748142556-59ac56a6a5c3'],
  'American Football': ['https://shoc.com/cdn/shop/articles/pexels-football-wife-577822-1618200.jpg?v=1759771518'],
  'Golf': ['photo-1535131749006-b7f58c99034b', 'photo-1587174486073-ae5e5cff23aa'],
  'Swimming': ['photo-1530549387789-4c1017266635', 'photo-1519315901367-f34ff9154487'],
  'Cycling': ['photo-1517649763962-0c623066013b', 'photo-1541625602330-2277a4c46182'],
  'Boxing': ['photo-1549719386-74dfcbf7dbed', 'photo-1544005313-94ddf0286df2'],
  'MMA': ['photo-1549719386-74dfcbf7dbed'],
  'Rugby': ['photo-1544551763-46a013bb70d5'],
  'Baseball': ['photo-1471295253337-3ceaaedca402', 'photo-1529768167801-9173d94c2a42', 'photo-1508344928928-7165b67de128'],
  'Skeleton': ['https://static01.nyt.com/images/2022/02/10/science/10olympics-skeleton1/10olympics-skeleton1-superJumbo.jpg'],
  'Bobsled': ['https://static01.nyt.com/images/2022/02/10/science/10olympics-skeleton1/10olympics-skeleton1-superJumbo.jpg'],
  'Luge': ['https://static01.nyt.com/images/2022/02/10/science/10olympics-skeleton1/10olympics-skeleton1-superJumbo.jpg'],
  'Winter Sports': ['https://static01.nyt.com/images/2022/02/10/science/10olympics-skeleton1/10olympics-skeleton1-superJumbo.jpg'],
  'Politics': ['https://s.yimg.com/ny/api/res/1.2/EDJoRtM0_spzU.yYaYLMVg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTQyNztjZj13ZWJw/https://s.yimg.com/os/creatr-uploaded-images/2025-07/3a4f3d80-68e0-11f0-bfef-851ca0fc17a5'],
  'Skiing': ['https://assets.fis-ski.com/f/252177/1500x1000/e602de04fe/podium-levi.JPG/m/2880x0/smart', 'photo-1605540436563-5bca919ae766'],
  'Alpine Skiing': ['https://assets.fis-ski.com/f/252177/1500x1000/e602de04fe/podium-levi.JPG/m/2880x0/smart', 'photo-1605540436563-5bca919ae766'],
  'Ski World Cup': ['https://assets.fis-ski.com/f/252177/1500x1000/e602de04fe/podium-levi.JPG/m/2880x0/smart'],
  'Freestyle Skiing': ['photo-1605540436563-5bca919ae766', 'photo-1517315003714-a071486bd9ea'],
  'Cross-Country Skiing': ['https://assets.fis-ski.com/f/252177/1500x1000/e602de04fe/podium-levi.JPG/m/2880x0/smart'],
  'default': ['photo-1461896836934-bc06e44c42d8', 'photo-1579952363873-27f3bade9f55']
}

function getImageForSport(sport: string): string {
  const images = SPORT_IMAGES[sport] || SPORT_IMAGES['default']
  const randomImage = images[Math.floor(Math.random() * images.length)]
  if (randomImage.startsWith('http')) {
    return randomImage
  }
  return `https://images.unsplash.com/${randomImage}?w=800&q=80`
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function callLLMWithRetry(prompt: string, maxRetries = 3): Promise<any> {
  const apiKey = Deno.env.get('LLM_API_KEY')
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (attempt > 0) {
      const waitTime = Math.pow(2, attempt) * 2000 // 2s, 4s, 8s
      console.log(`Retry ${attempt}, waiting ${waitTime}ms...`)
      await delay(waitTime)
    }

    const response = await fetch('https://api.z.ai/api/coding/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'GLM-4.7',
        messages: [{ role: 'user', content: prompt }]
      }),
    })

    const data = await response.json()
    
    // Check for rate limit error
    if (data.error?.code === '1302' || data.error?.message?.includes('concurrency')) {
      console.log('Rate limited, will retry...')
      continue
    }
    
    return data
  }
  
  return { error: { code: '1302', message: 'Max retries exceeded' } }
}

Deno.serve(async (req) => {
  try {
    const { record } = await req.json()
    
    if (!record || record.indicator !== 1) {
      return new Response(JSON.stringify({ skipped: true }))
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const prompt = `You are a sports article classifier and translator. Analyze this article and respond with ONLY valid JSON (no markdown).

RULES:
- Sport names in English (use exact names): "Soccer", "Basketball", "NBA", "Tennis", "Formula 1", "IndyCar", "Ice Hockey", "American Football", "Golf", "Swimming", "Cycling", "Boxing", "MMA", "Rugby", "Baseball", "Motorsport", "Skeleton", "Bobsled", "Luge", "Alpine Skiing", "Ski World Cup", "Cross-Country Skiing", "Freestyle Skiing", "Winter Sports", "Politics"
- Provide translations in EN, NL, FR

JSON format:
{
  "is_sports_article": true/false,
  "sport": "English sport name",
  "country": "country or null",
  "league": "league or null",
  "event_type": "match/transfer/injury/interview/preview/recap/other",
  "players": ["name1", "name2"],
  "teams": ["team1", "team2"],
  "translations": {
    "en": { "title": "English title", "summary": "2-3 sentence summary" },
    "nl": { "title": "Dutch title", "summary": "Dutch summary" },
    "fr": { "title": "French title", "summary": "French summary" }
  }
}

Title: ${record.title}
Content: ${record.body || 'No content'}`

    const llmData = await callLLMWithRetry(prompt)
    console.log('LLM Response:', JSON.stringify(llmData))

    if (!llmData.choices || !llmData.choices[0]) {
      await supabase.from('classification').insert({
        article_id: record.id,
        json_response: JSON.stringify({ error: 'LLM failed', response: llmData })
      })
      return new Response(JSON.stringify({ error: 'LLM failed' }), { status: 500 })
    }

    let jsonResponse = llmData.choices[0].message.content
    if (jsonResponse.includes('```')) {
      jsonResponse = jsonResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    }

    // Parse to add image_url
    try {
      const parsed = JSON.parse(jsonResponse)
      parsed.image_url = getImageForSport(parsed.sport || 'default')
      jsonResponse = JSON.stringify(parsed)
    } catch {
      console.error('Failed to parse JSON, adding default image')
    }

    await supabase.from('classification').insert({
      article_id: record.id,
      json_response: jsonResponse
    })

    return new Response(JSON.stringify({ success: true }))
  } catch (err) {
    console.error('Error:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})

