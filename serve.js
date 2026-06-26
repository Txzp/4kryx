const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT          = 5000;
const HOST          = '0.0.0.0';
const VISITORS_FILE = path.join(__dirname, 'visitors.json');

/* Storage env vars — checked in priority order */
const REPLIT_DB_URL    = process.env.REPLIT_DB_URL;
const UPSTASH_URL      = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN    = process.env.UPSTASH_REDIS_REST_TOKEN;

const mimeTypes = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.mp4':  'video/mp4',
  '.mp3':  'audio/mpeg',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
};

/* ── Upstash Redis REST helpers ── */
async function upstashGet(key) {
  try {
    const r = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    const j = await r.json();
    if (j.result === null || j.result === undefined) return null;
    try { return JSON.parse(j.result); } catch { return j.result; }
  } catch { return null; }
}

async function upstashSet(key, value) {
  try {
    await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(JSON.stringify(value))}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
  } catch { /* ignore */ }
}

/* ── Replit KV REST helpers ── */
async function replitGet(key) {
  try {
    const r = await fetch(`${REPLIT_DB_URL}/${encodeURIComponent(key)}`);
    if (!r.ok || r.status === 404) return null;
    const text = await r.text();
    if (!text) return null;
    try { return JSON.parse(text); } catch { return text; }
  } catch { return null; }
}

async function replitSet(key, value) {
  try {
    await fetch(REPLIT_DB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`,
    });
  } catch { /* ignore */ }
}

/* ── Unified data layer ── */
async function getData() {
  /* 1. Upstash (Vercel / any host) */
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    const count = await upstashGet('visitor_count');
    const ids   = await upstashGet('visitor_ids');
    return { count: Number(count) || 0, ids: Array.isArray(ids) ? ids : [] };
  }
  /* 2. Replit KV */
  if (REPLIT_DB_URL) {
    const count = await replitGet('visitor_count');
    const ids   = await replitGet('visitor_ids');
    return { count: Number(count) || 0, ids: Array.isArray(ids) ? ids : [] };
  }
  /* 3. Local file (dev) */
  try {
    const d = JSON.parse(fs.readFileSync(VISITORS_FILE, 'utf8'));
    return { count: d.count || 0, ids: d.ids || [] };
  } catch { return { count: 0, ids: [] }; }
}

async function saveData(data) {
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    await Promise.all([
      upstashSet('visitor_count', data.count),
      upstashSet('visitor_ids',   data.ids),
    ]);
    return;
  }
  if (REPLIT_DB_URL) {
    await Promise.all([
      replitSet('visitor_count', data.count),
      replitSet('visitor_ids',   data.ids),
    ]);
    return;
  }
  try { fs.writeFileSync(VISITORS_FILE, JSON.stringify(data)); } catch { /* ignore */ }
}

const server = http.createServer(async (req, res) => {
  const urlPath = req.url.split('?')[0];

  /* ── CORS preflight ── */
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  /* ── Visitor API ── */
  if (urlPath === '/api/visitors') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        const data = await getData();
        try {
          const payload = JSON.parse(body);
          const vid = String(payload.id || '').trim();
          if (vid.length > 8 && !data.ids.includes(vid)) {
            data.ids.push(vid);
            data.count = (data.count || 0) + 1;
            await saveData(data);
          }
        } catch { /* bad body */ }

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify({ count: data.count || 0 }));
      });
      return;
    }

    /* GET */
    const data = await getData();
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify({ count: data.count || 0 }));
    return;
  }

  /* ── Static files ── */
  let filePath = urlPath === '/' ? '/index.html' : urlPath;
  filePath = path.join(__dirname, filePath);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  const ext         = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(__dirname, 'index.html'), (err2, data2) => {
          if (err2) { res.writeHead(500); res.end('Server error'); }
          else { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(data2); }
        });
      } else { res.writeHead(500); res.end('Server error'); }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
  const storage = UPSTASH_URL ? 'Upstash Redis' : REPLIT_DB_URL ? 'Replit KV' : 'local file';
  console.log(`Visitor storage: ${storage}`);
});
