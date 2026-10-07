export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const hex = (req.query.hex || '').trim().toLowerCase();
  if (!hex) {
    return res.status(400).json({ photos: [], error: 'Missing hex parameter' });
  }

  try {
    const targetUrl = `https://api.planespotters.net/pub/photos/hex/${hex}`;
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'FlightRadarAvionics/1.0 (+https://flightcontroller.vercel.app; contact@flightcontroller.app)',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ photos: [] });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Planespotters proxy error:', error);
    return res.status(500).json({ photos: [] });
  }
}
