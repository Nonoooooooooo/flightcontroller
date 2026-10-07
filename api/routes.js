export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const callsign = (req.query.callsign || '').trim().toUpperCase();
  if (!callsign) {
    return res.status(400).json({ error: 'Missing callsign' });
  }

  try {
    const targetUrl = `https://opensky-network.org/api/routes?callsign=${callsign}`;
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'FlightRadarAvionics/1.0 (+https://flightcontroller.vercel.app; contact@flightcontroller.app)',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ route: [] });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(data);
  } catch (error) {
    console.error('OpenSky routes proxy error:', error);
    return res.status(500).json({ route: [] });
  }
}
