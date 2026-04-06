// api/sync.js - Sync wealth data via Upstash Redis REST API
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const REDIS_URL = process.env.KV_REST_API_URL;
  const REDIS_TOKEN = process.env.KV_REST_API_TOKEN;

  if (!REDIS_URL || !REDIS_TOKEN) {
    return res.status(500).json({ error: 'Redis not configured' });
  }

  const redis = async (cmd, args) => {
    const r = await fetch(`${REDIS_URL}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([cmd, ...args])
    });
    return r.json();
  };

  try {
    const { pin, action, data } = req.method === 'POST' ? req.body : { pin: req.query.pin, action: req.query.action };

    if (!pin || pin.length !== 4) {
      return res.status(400).json({ error: 'Invalid PIN' });
    }

    // Simple hash of PIN to use as key (not cryptographic, just obfuscation)
    const key = 'wealth_' + pin.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 0).toString(36);

    if (action === 'push') {
      // Save data to Redis
      if (!data) return res.status(400).json({ error: 'No data' });
      const payload = JSON.stringify({ ...data, _ts: Date.now() });
      const result = await redis('SET', [key, payload]);
      return res.status(200).json({ ok: true, ts: Date.now() });
    }

    if (action === 'pull') {
      // Load data from Redis
      const result = await redis('GET', [key]);
      if (result.result) {
        const parsed = JSON.parse(result.result);
        return res.status(200).json({ ok: true, data: parsed });
      }
      return res.status(200).json({ ok: true, data: null });
    }

    return res.status(400).json({ error: 'Invalid action. Use push or pull.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
