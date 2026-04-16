export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const symbols = ['GC=F', 'SI=F', 'INR=X'];
    const prices = {};

    for (const sym of symbols) {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?range=1d&interval=1d`;
        const r = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const data = await r.json();
        const meta = data && data.chart && data.chart.result && data.chart.result[0] && data.chart.result[0].meta;
        if (meta) {
          prices[sym] = meta.regularMarketPrice;
        }
      } catch (e) {}
    }

    const goldUsdPerOz = prices['GC=F'] || 0;
    const silverUsdPerOz = prices['SI=F'] || 0;
    const usdInr = prices['INR=X'] || 85;

    // India premium: ~10% import duty + 3% GST = ~13%
    const INDIA_PREMIUM = 1.13;

    // 1 troy oz = 31.1035 grams
    const gold24kPerGram = Math.round((goldUsdPerOz * usdInr * INDIA_PREMIUM) / 31.1035);
    const gold22kPerGram = Math.round(gold24kPerGram * 22 / 24);
    const silverPerGram = Math.round((silverUsdPerOz * usdInr * INDIA_PREMIUM) / 31.1035);

    return res.status(200).json({
      gold24k: gold24kPerGram,
      gold22k: gold22kPerGram,
      silver: silverPerGram,
      raw: { goldUsd: goldUsdPerOz, silverUsd: silverUsdPerOz, usdInr, premium: '13%' },
      updated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to fetch metal prices' });
  }
}
