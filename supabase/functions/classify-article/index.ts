import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  try {
    const { record } = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const prompt = `Analyze this article and return JSON with: is_sports_article, sport, country, league, event_type, players[], teams[]

Title: ${record.title}
Content: ${record.body}`

    const llmResponse = await fetch('https://api.z.ai/api/coding/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LLM_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'GLM-4.7',
        messages: [{ role: 'user', content: prompt }]
      }),
    })

    const llmData = await llmResponse.json()
    console.log('LLM Response:', JSON.stringify(llmData))

    if (!llmData.choices || !llmData.choices[0]) {
      console.error('Invalid LLM response:', llmData)
      await supabase
        .from('classification')
        .insert({
          article_id: record.id,
          json_response: JSON.stringify({ error: 'LLM API failed', response: llmData })
        })
      return new Response(JSON.stringify({ error: 'LLM failed', details: llmData }), { status: 500 })
    }

    const jsonResponse = llmData.choices[0].message.content

    await supabase
      .from('classification')
      .insert({
        article_id: record.id,
        json_response: jsonResponse
      })

    return new Response(JSON.stringify({ success: true }))
  } catch (err) {
    console.error('Error:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})

