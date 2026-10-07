// Registration prefix country mapper
function getCountryFromReg(reg) {
  if (!reg) return 'N/A';
  const r = reg.toUpperCase().trim();
  if (r.startsWith('F-')) return 'France';
  if (r.startsWith('N') && /^[A-Z0-9]+$/.test(r)) return 'United States';
  if (r.startsWith('G-')) return 'United Kingdom';
  if (r.startsWith('D-')) return 'Germany';
  if (r.startsWith('OE-')) return 'Austria';
  if (r.startsWith('OO-')) return 'Belgium';
  if (r.startsWith('HB-')) return 'Switzerland';
  if (r.startsWith('EI-')) return 'Ireland';
  if (r.startsWith('EC-')) return 'Spain';
  if (r.startsWith('PH-')) return 'Netherlands';
  if (r.startsWith('CS-')) return 'Portugal';
  if (r.startsWith('TC-')) return 'Turkey';
  if (r.startsWith('A6-')) return 'United Arab Emirates';
  if (r.startsWith('JA')) return 'Japan';
  if (r.startsWith('HL')) return 'South Korea';
  if (r.startsWith('C-')) return 'Canada';
  if (r.startsWith('9H-')) return 'Malta';
  if (r.startsWith('SP-')) return 'Poland';
  if (r.startsWith('SX-')) return 'Greece';
  if (r.startsWith('I-')) return 'Italy';
  if (r.startsWith('SE-')) return 'Sweden';
  if (r.startsWith('LN-')) return 'Norway';
  if (r.startsWith('OY-')) return 'Denmark';
  if (r.startsWith('OH-')) return 'Finland';
  return 'International';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const lamin = parseFloat(req.query.lamin) || 48.0;
  const lamax = parseFloat(req.query.lamax) || 49.5;
  const lomin = parseFloat(req.query.lomin) || 1.5;
  const lomax = parseFloat(req.query.lomax) || 3.5;

  const centerLat = (lamin + lamax) / 2;
  const centerLon = (lomin + lomax) / 2;

  // Radius in Nautical Miles (NM)
  const latSpanKm = Math.abs(lamax - lamin) * 111;
  const lonSpanKm = Math.abs(lomax - lomin) * 111 * Math.cos(centerLat * Math.PI / 180);
  const radiusKm = Math.min(250, Math.max(30, Math.round(Math.hypot(latSpanKm, lonSpanKm) / 2)));
  const radiusNm = Math.min(250, Math.max(25, Math.round(radiusKm / 1.852)));

  const headers = {
    'User-Agent': 'FlightRadarAvionics/1.0 (+https://flightcontroller.vercel.app; contact@flightcontroller.app)',
    'Accept': 'application/json'
  };

  // 1. Primary Engine: High-speed live ADS-B network (ADSB.lol, reliable on cloud & Vercel)
  try {
    const adsbUrl = `https://api.adsb.lol/v2/point/${centerLat.toFixed(4)}/${centerLon.toFixed(4)}/${radiusNm}`;
    const adsbRes = await fetch(adsbUrl, { headers });

    if (adsbRes.ok) {
      const data = await adsbRes.json();
      const aircraft = data.ac || [];

      const nowSec = Math.floor(Date.now() / 1000);
      const states = aircraft
        .filter(a => a.lat != null && a.lon != null)
        .map(a => {
          const icao24 = (a.hex || '').toLowerCase();
          const callsign = (a.flight || a.r || 'UNKNOWN').trim();
          const country = a.r ? getCountryFromReg(a.r) : 'France';
          const altMeters = a.alt_baro === 'ground' ? 0 : (typeof a.alt_baro === 'number' ? Math.round(a.alt_baro * 0.3048) : null);
          const onGround = a.alt_baro === 'ground';
          const velocity = typeof a.gs === 'number' ? a.gs * 0.514444 : 0;
          const track = a.track != null ? a.track : 0;
          const vRate = typeof a.baro_rate === 'number' ? a.baro_rate * 0.00508 : 0;
          const geoAlt = a.alt_geom != null ? Math.round(a.alt_geom * 0.3048) : altMeters;
          const squawk = a.squawk || null;

          return [
            icao24,
            callsign,
            country,
            nowSec,
            nowSec,
            a.lon,
            a.lat,
            altMeters,
            onGround,
            velocity,
            track,
            vRate,
            null,
            geoAlt,
            squawk,
            false,
            0
          ];
        });

      res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');
      return res.status(200).json({ time: nowSec, states });
    }
  } catch (errAdsb) {
    console.warn('ADSB.lol fetch failed, trying OpenSky fallback:', errAdsb.message);
  }

  // 2. Secondary Engine: OpenSky Network fallback
  try {
    const qs = new URLSearchParams(req.query).toString();
    const openSkyUrl = `https://opensky-network.org/api/states/all${qs ? `?${qs}` : ''}`;
    const openSkyRes = await fetch(openSkyUrl, { headers });

    if (openSkyRes.ok) {
      const data = await openSkyRes.json();
      res.setHeader('Cache-Control', 's-maxage=6, stale-while-revalidate=12');
      return res.status(200).json(data);
    }
  } catch (errOpenSky) {
    console.error('OpenSky fallback failed:', errOpenSky.message);
  }

  return res.status(200).json({ time: Math.floor(Date.now() / 1000), states: [] });
}
