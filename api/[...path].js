export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { path, ...queryParams } = req.query || {};
    const subpath = Array.isArray(path) ? path.join('/') : (path || '');

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(queryParams)) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v));
      } else if (value !== undefined && value !== null) {
        searchParams.append(key, value);
      }
    }

    const qs = searchParams.toString();
    const targetUrl = `https://opensky-network.org/api/${subpath}${qs ? `?${qs}` : ''}`;

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'application/json'
    };

    // Optional authentication if user configured OpenSky credentials in Vercel environment variables
    if (process.env.OPENSKY_USERNAME && process.env.OPENSKY_PASSWORD) {
      const auth = Buffer.from(`${process.env.OPENSKY_USERNAME}:${process.env.OPENSKY_PASSWORD}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
    }

    const response = await fetch(targetUrl, { headers });

    if (!response.ok) {
      console.warn(`OpenSky API HTTP ${response.status} on ${targetUrl}`);
      // Return empty states payload gracefully instead of breaking the frontend
      res.setHeader('Cache-Control', 'no-cache');
      return res.status(response.status).json({
        time: Math.floor(Date.now() / 1000),
        states: [],
        warning: `OpenSky HTTP ${response.status}`
      });
    }

    const data = await response.json();

    // Cache on Vercel Edge for 5 seconds to prevent rate limiting (429) on frequent polls
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');
    return res.status(200).json(data);
  } catch (error) {
    console.error('OpenSky proxy error:', error);
    return res.status(500).json({
      error: error.message || 'Internal proxy error',
      time: Math.floor(Date.now() / 1000),
      states: []
    });
  }
}
