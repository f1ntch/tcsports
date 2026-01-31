import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  let articleId: number | null = null

  try {
    const body = await req.json()
    console.log('Received body:', JSON.stringify(body))
    
    const record = body.record
    
    if (!record) {
      console.error('No record in body')
      return new Response(JSON.stringify({ error: 'No record provided' }), { status: 400 })
    }

    // Only process if indicator = 1
    if (record.indicator !== 1) {
      console.log('Skipping - indicator is not 1')
      return new Response(JSON.stringify({ skipped: true }))
    }

    articleId = record.id
    console.log('Processing article:', articleId, record.title)

    const prompt = `You are a sports article classifier and translator. Analyze this article and respond with ONLY a valid JSON object (no markdown, no explanation).

IMPORTANT RULES:
- Sport names MUST be in standard English: "Formula 1" (not "Formule 1"), "Soccer" (not "Voetbal"), "Basketball", "Tennis", "Ice Hockey", "American Football", "Golf", "Baseball", "MMA", "Boxing", "Cricket", "Rugby", "Cycling", "Athletics", "Swimming"
- All classification fields in English
- Provide translations of title and body summary in EN, NL (Dutch), FR (French)

Required JSON format:
{
  "is_sports_article": true or false,
  "sport": "English sport name or null",
  "country": "country name in English or null",
  "league": "league name or null",
  "event_type": "match/transfer/injury/interview/preview/recap/other or null",
  "players": ["player1", "player2"],
  "teams": ["team1", "team2"],
  "translations": {
    "en": { "title": "English title", "summary": "2-3 sentence English summary" },
    "nl": { "title": "Dutch title", "summary": "2-3 sentence Dutch summary" },
    "fr": { "title": "French title", "summary": "2-3 sentence French summary" }
  }
}

Article Title: ${record.title}
Article Content: ${record.body || 'No content'}`

    const apiKey = Deno.env.get('LLM_API_KEY')
    console.log('API Key present:', !!apiKey)

    const llmResponse = await fetch('https://api.z.ai/api/coding/paas/v4/chat/completions', {
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

    console.log('LLM Status:', llmResponse.status)
    const llmData = await llmResponse.json()
    console.log('LLM Response:', JSON.stringify(llmData))

    if (!llmData.choices || !llmData.choices[0]) {
      const errorJson = JSON.stringify({ error: 'LLM API failed', status: llmResponse.status, response: llmData })
      await supabase.from('classification').insert({ article_id: articleId, json_response: errorJson })
      return new Response(errorJson, { status: 500 })
    }

    let jsonResponse = llmData.choices[0].message.content
    
    // Clean markdown code blocks if present
    if (jsonResponse.includes('```')) {
      jsonResponse = jsonResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    }

    console.log('Cleaned JSON:', jsonResponse)

    const { error: insertError } = await supabase
      .from('classification')
      .insert({ article_id: articleId, json_response: jsonResponse })

    if (insertError) {
      console.error('Insert error:', insertError)
      return new Response(JSON.stringify({ error: 'DB insert failed', details: insertError }), { status: 500 })
    }

    console.log('Classification saved for article:', articleId)
    return new Response(JSON.stringify({ success: true, article_id: articleId }))

  } catch (err) {
    console.error('Error:', err)
    if (articleId) {
      await supabase.from('classification').insert({ 
        article_id: articleId, 
        json_response: JSON.stringify({ error: String(err) }) 
      })
    }
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})

