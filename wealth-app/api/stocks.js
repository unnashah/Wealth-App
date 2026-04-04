export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { symbols } = req.query;
  if (!symbols) return res.status(400).json({ error: 'No symbols provided' });

  const list = symbols.split(',').map(s => s.trim().toUpperCase()).filter(Boolean).slice(0, 10);
  const results = [];

  for (const symbol of list) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS?range=1d&interval=1d`;
      const r = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const data = await r.json();
      const meta = data?.chart?.result?.[0]?.meta;
      if (meta) {
        results.push({
          symbol,
          price: meta.regularMarketPrice,
          prevClose: meta.previousClose,
          change: meta.previousClose ? (((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100) : 0
        });
      }
    } catch (e) {
      results.push({ symbol, price: null, change: null, error: true });
    }
  }

  return res.status(200).json(results);
}
