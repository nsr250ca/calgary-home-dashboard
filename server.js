import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const PORT = process.env.PORT || 3000;
const publicDir = join(process.cwd(), 'public');
const mime = { '.html':'text/html; charset=utf-8', '.js':'application/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8' };

const cache = new Map();
async function cached(key, ttl, load) {
  const existing = cache.get(key);
  if (existing && Date.now() - existing.at < ttl) return existing.value;
  const value = await load();
  cache.set(key, { at: Date.now(), value });
  return value;
}
async function json(url, options = {}) {
  const response = await fetch(url, { headers: { 'User-Agent': 'CalgaryHomeDashboard/1.0' }, ...options });
  if (!response.ok) throw new Error(`Upstream returned ${response.status}`);
  return response.json();
}

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(Buffer.isBuffer(body) || typeof body === 'string' ? body : JSON.stringify(body));
}
function decodeXml(text = '') { return text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>'); }
async function news() {
  const response = await fetch('https://www.cbc.ca/webfeed/rss/rss-canada-calgary', { headers: { 'User-Agent': 'CalgaryHomeDashboard/1.0' } });
  if (!response.ok) throw new Error('RSS unavailable');
  const xml = await response.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].slice(0, 5).map(([, item]) => {
    const field = tag => decodeXml(item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))?.[1] || '');
    return { title: field('title'), link: field('link'), pubDate: field('pubDate') };
  });
  return { items };
}

// Yahoo exposes two public chart hostnames. Some cloud networks intermittently reject one of
// them, so use the alternate hostname before reporting a market outage to the browser.
async function yahooChart(symbol) {
  const encoded = encodeURIComponent(symbol);
  const hosts = ['query1.finance.yahoo.com', 'query2.finance.yahoo.com'];
  let lastError;
  for (const host of hosts) {
    try {
      return await json(`https://${host}/v8/finance/chart/${encoded}?range=14d&interval=1d`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; CalgaryHomeDashboard/1.0)',
          'Accept': 'application/json',
          'Referer': 'https://finance.yahoo.com/'
        }
      });
    } catch (error) { lastError = error; }
  }
  throw lastError || new Error('Yahoo Finance unavailable');
}
async function markets() {
  const symbols = ['^GSPTSE', '^GSPC', '^NDX', 'GC=F', 'CAD=X'];
  const result = await cached('markets', 4 * 60_000, async () => {
    const settled = await Promise.allSettled(symbols.map(async symbol => {
      const chart = await yahooChart(symbol);
      const data = chart.chart.result?.[0];
      if (!data) throw new Error('No chart data');
      const quote = data.indicators.quote[0];
      const points = data.timestamp.map((time, i) => ({ time: time * 1000, value: quote.close[i] })).filter(p => Number.isFinite(p.value));
      const meta = data.meta;
      const previous = meta.previousClose ?? points.at(-2)?.value;
      const price = meta.regularMarketPrice ?? points.at(-1)?.value;
      return { symbol, price, change: price - previous, changePercent: ((price - previous) / previous) * 100, points };
    }));
    const successful = settled.filter(result => result.status === 'fulfilled').map(result => result.value);
    if (!successful.length) throw new Error('All market providers failed');
    return successful;
  });
  return result;
}
async function transit() {
  // Calgary Transit GTFS-realtime is not consistently CORS/API-key free. This endpoint keeps
  // the UI contract ready for a feed URL entered in Settings, and remains honest when absent.
  const url = process.env.CALGARY_TRANSIT_FEED_URL;
  if (!url) throw new Error('Transit feed not configured');
  return cached('transit', 45_000, () => json(url));
}
const routes = {
  '/api/weather': () => cached('weather', 9 * 60_000, () => json('https://api.open-meteo.com/v1/forecast?latitude=51.0447&longitude=-114.0719&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=America%2FEdmonton&forecast_days=7')),
  '/api/rates': () => cached('rates', 30 * 60_000, () => json('https://open.er-api.com/v6/latest/CAD')),
  '/api/news': () => cached('news', 15 * 60_000, news),
  '/api/markets': () => cached('markets', 4 * 60_000, markets),
  '/api/transit': transit
};
http.createServer(async (req, res) => {
  const path = new URL(req.url, `http://${req.headers.host}`).pathname;
  if (routes[path]) { try { send(res, 200, await routes[path]()); } catch { send(res, 502, { error: 'Connection Failed' }); } return; }
  const relative = path === '/' ? 'index.html' : normalize(path).replace(/^[/\\]+/, '');
  const file = join(publicDir, relative);
  if (!file.startsWith(publicDir)) return send(res, 403, 'Forbidden', 'text/plain');
  try { send(res, 200, await readFile(file), mime[extname(file)] || 'application/octet-stream'); } catch { send(res, 404, 'Not found', 'text/plain'); }
}).listen(PORT, () => console.log(`Calgary Home Dashboard running at http://localhost:${PORT}`));
