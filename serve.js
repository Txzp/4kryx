const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT          = 5000;
const HOST          = '0.0.0.0';
const VISITORS_FILE = path.join(__dirname, 'visitors.json');
const REPLIT_DB_URL = process.env.REPLIT_DB_URL;

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

/* ── Replit KV helpers (used in production autoscale) ── */
async function dbGet(key) {
  try {
    const r = await fetch(`${REPLIT_DB_URL}/${encodeURIComponent(key)}`);
    if (!r.ok || r.status === 404) return null;
    const text = await r.text();
    if (!text) return null;
    try { return JSON.parse(text); } catch { return text; }
  } catch { return null; }
}

async function dbSet(key, value) {
  try {
    await fetch(REPLIT_DB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`,
    });
  } catch { /* ignore write errors */ }
}

/* ── Data layer: Replit DB in production, JSON file in dev ── */
async function getData() {
  if (REPLIT_DB_URL) {
    const count = await dbGet('visitor_count');
    const ids   = await dbGet('visitor_ids');
    return {
      count: Number(count) || 0,
      ids:   Array.isArray(ids) ? ids : [],
    };
  }
  try {
    const d = JSON.parse(fs.readFileSync(VISITORS_FILE, 'utf8'));
    return { count: d.count || 0, ids: d.ids || [] };
  } catch { return { count: 0, ids: [] }; }
}

async function saveData(data) {
  if (REPLIT_DB_URL) {
    await Promise.all([
      dbSet('visitor_count', data.count),
      dbSet('visitor_ids',   data.ids),
    ]);
  } else {
    fs.writeFileSync(VISITORS_FILE, JSON.stringify(data));
  }
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
          /* Only count if a valid UUID-like id is given and not seen before */
          if (vid.length > 8 && !data.ids.includes(vid)) {
            data.ids.push(vid);
            data.count = (data.count || 0) + 1;
            await saveData(data);
          }
        } catch { /* bad body — just return current count */ }

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify({ count: data.count || 0 }));
      });
      return;
    }

    /* GET — just return count */
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
});
