import http from 'node:http';

const AEROLINK_KEY = process.env.AEROLINK_KEY || 'aero_live_EzzWC4yIoJBpqMHY1V3mF619mLOPATRjS3zvPnyZt2k';
const AEROLINK_BASE = 'https://capi.aerolink.lat';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8045;
const TARGET_MODEL = 'claude-opus-5';

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = req.url || '/';

  let bodyChunks = [];
  for await (const chunk of req) {
    bodyChunks.push(chunk);
  }
  const rawBody = Buffer.concat(bodyChunks).toString('utf8');
  let parsedBody = {};
  try {
    if (rawBody) parsedBody = JSON.parse(rawBody);
  } catch (e) {}

  // 1. Anthropic Messages API (/v1/messages) for Claude Code CLI
  if (url.includes('/messages')) {
    parsedBody.model = TARGET_MODEL;

    try {
      const upstreamRes = await fetch(`${AEROLINK_BASE}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AEROLINK_KEY,
          'anthropic-version': req.headers['anthropic-version'] || '2023-06-01',
          ...(req.headers['anthropic-beta'] ? { 'anthropic-beta': req.headers['anthropic-beta'] } : {})
        },
        body: JSON.stringify(parsedBody)
      });

      res.writeHead(upstreamRes.status, {
        'Content-Type': upstreamRes.headers.get('content-type') || 'application/json'
      });

      if (parsedBody.stream) {
        const reader = upstreamRes.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
      } else {
        const data = await upstreamRes.text();
        res.end(data);
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: err.message } }));
    }
    return;
  }

  // 2. OpenAI Chat Completions API (/v1/chat/completions) for Codex CLI
  if (url.includes('/chat/completions')) {
    const system = (parsedBody.messages || []).find(m => m.role === 'system')?.content || '';
    const messages = (parsedBody.messages || [])
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
      }));

    if (messages.length === 0) {
      messages.push({ role: 'user', content: 'Hello' });
    }

    const anthropicPayload = {
      model: TARGET_MODEL,
      max_tokens: parsedBody.max_tokens || 4096,
      messages,
      ...(system ? { system } : {})
    };

    try {
      const upstreamRes = await fetch(`${AEROLINK_BASE}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AEROLINK_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(anthropicPayload)
      });

      const upstreamData = await upstreamRes.json();
      const content = upstreamData?.content?.[0]?.text || '';

      const openAiResponse = {
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: TARGET_MODEL,
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: content
            },
            finish_reason: 'stop'
          }
        ],
        usage: {
          prompt_tokens: upstreamData?.usage?.input_tokens || 10,
          completion_tokens: upstreamData?.usage?.output_tokens || 20,
          total_tokens: (upstreamData?.usage?.input_tokens || 10) + (upstreamData?.usage?.output_tokens || 20)
        }
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(openAiResponse));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: err.message } }));
    }
    return;
  }

  // 3. Models list
  if (url.includes('/models')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      object: 'list',
      data: [
        { id: 'claude-opus-5', object: 'model' },
        { id: 'claude-sonnet-5', object: 'model' },
        { id: 'gpt-4o', object: 'model' }
      ]
    }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', service: 'aerolink-proxy', target_model: TARGET_MODEL }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[AeroLink Proxy] Running on http://127.0.0.1:${PORT} locked to ${TARGET_MODEL}`);
});
