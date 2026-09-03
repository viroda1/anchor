export default async (request) => {
  if (request.method !== 'POST') return new Response(JSON.stringify({error:'Method not allowed'}), {status:405, headers:{'Content-Type':'application/json'}});
  if (!process.env.GROQ_API_KEY) return new Response(JSON.stringify({error:'Ask Wolfy is not configured yet.'}), {status:503, headers:{'Content-Type':'application/json'}});
  try {
    const body = JSON.parse(request.body || '{}');
    const result = await fetch('https://api.groq.com/openai/v1/chat/completions', {method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${process.env.GROQ_API_KEY}`}, body:JSON.stringify({model:process.env.GROQ_MODEL || 'llama-3.3-70b-versatile', messages:[{role:'system',content:'You are Ask Wolfy, the helpful AI inside Anchor OS, created by Isaac Hughley. Be concise, kind, and educational.'}, ...(body.messages || []).slice(-20)]})});
    const data = await result.json();
    return new Response(JSON.stringify(result.ok ? {reply:data.choices?.[0]?.message?.content || 'No response returned.'} : {error:data.error?.message || 'The AI provider returned an error.'}), {status:result.ok ? 200 : result.status, headers:{'Content-Type':'application/json'}});
  } catch { return new Response(JSON.stringify({error:'The AI provider could not be reached.'}), {status:502, headers:{'Content-Type':'application/json'}}); }
};
