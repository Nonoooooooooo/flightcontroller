export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { path, ...queryParams } = req.query || {};
    const subpath = Array.isArray(path) ? path.join('/') : (path || '');
    const qs = new URLSearchParams(queryParams).toString();
    const targetUrl = `https://api.planespotters.net/pub/photos/${subpath}${qs ? `?${qs}` : ''}`;

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'FlightRadarAvionics/1.0 (https://flightcontroller.vercel.app; contact@flightcontroller.app)',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ photos: [] });
    }

    const data = await response.json();
    // Cache for 24 hours on Vercel CDN Edge
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Planespotters proxy error:', error);
    return res.status(500).json({ photos: [] });
  }
}
