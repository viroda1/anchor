import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = process.env.PORT || 3000;
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json'};

async function askArc(body) {
  if (!process.env.GROQ_API_KEY) return { status: 503, body: { error: 'Arc AI is not configured yet.' } };
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: {'Content-Type':'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}`}, body: JSON.stringify({ model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile', messages: [{role:'system', content:'You are Arc AI, created by Isaac Hughley and hosted by AnchorOS. Be concise, kind, and educational.'}, ...(body.messages || []).slice(-20)] }) });
  const data = await response.json();
  return { status: response.ok ? 200 : response.status, body: response.ok ? { reply: data.choices?.[0]?.message?.content || 'No response returned.' } : { error: data.error?.message || 'The AI provider returned an error.' } };
}

createServer(async (request, response) => {
  try {
    if ((request.url === '/api/ask-arc' || request.url === '/ask-arc') && request.method === 'POST') {
      let raw = ''; for await (const chunk of request) raw += chunk;
      const result = await askArc(JSON.parse(raw || '{}'));
      response.writeHead(result.status, {'Content-Type':'application/json'}); response.end(JSON.stringify(result.body)); return;
    }
    const requested = decodeURIComponent((request.url || '/').split('?')[0]);
    const relative = requested === '/' ? 'index.html' : requested.replace(/^\/+/, '');
    const file = normalize(join(root, relative));
    if (!file.startsWith(root)) throw new Error('Invalid path');
    const content = await readFile(file);
    response.writeHead(200, {'Content-Type': types[extname(file)] || 'application/octet-stream'}); response.end(content);
  } catch { response.writeHead(404); response.end('Not found'); }
}).listen(port, () => console.log(`Anchor OS listening on ${port}`));
