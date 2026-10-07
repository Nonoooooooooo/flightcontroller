export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(req.query || {})) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v));
      } else if (value !== undefined && value !== null) {
        searchParams.append(key, value);
      }
    }

    const qs = searchParams.toString();
    const targetUrl = `https://opensky-network.org/api/states/all${qs ? `?${qs}` : ''}`;

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'FlightRadarAvionics/1.0 (+https://flightcontroller.vercel.app; contact@flightcontroller.app)',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.warn(`OpenSky returned HTTP ${response.status}`);
      return res.status(response.status).json({ time: Math.floor(Date.now() / 1000), states: [] });
    }

    const data = await response.json();
    // Cache for 6 seconds at the Edge to avoid hitting OpenSky rate limits
    res.setHeader('Cache-Control', 's-maxage=6, stale-while-revalidate=12');
    return res.status(200).json(data);
  } catch (error) {
    console.error('OpenSky states proxy error:', error);
    return res.status(500).json({ time: Math.floor(Date.now() / 1000), states: [], error: error.message });
  }
}
