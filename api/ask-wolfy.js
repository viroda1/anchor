export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({error: 'Method not allowed'});
  if (!process.env.GROQ_API_KEY) return response.status(503).json({error: 'Ask Wolfy is not configured yet.'});
  try {
    const result = await fetch('https://api.groq.com/openai/v1/chat/completions', {method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${process.env.GROQ_API_KEY}`}, body:JSON.stringify({model:process.env.GROQ_MODEL || 'llama-3.3-70b-versatile', messages:[{role:'system',content:'You are Ask Wolfy, the helpful AI inside Anchor OS, created by Isaac Hughley. Be concise, kind, and educational.'}, ...(request.body?.messages || []).slice(-20)]})});
    const data = await result.json();
    return response.status(result.ok ? 200 : result.status).json(result.ok ? {reply:data.choices?.[0]?.message?.content || 'No response returned.'} : {error:data.error?.message || 'The AI provider returned an error.'});
  } catch { return response.status(502).json({error:'The AI provider could not be reached.'}); }
}
