// api/adsb.js
// Proxies ADS-B Exchange API — keeps your RapidAPI key server-side
// Set RAPIDAPI_KEY in Vercel environment variables (never commit the key)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const key = process.env.RAPIDAPI_KEY;
  if (!key) {
    return res.status(200).json({
      ac: [],
      _note: 'No RAPIDAPI_KEY set in Vercel environment variables. Add it in your Vercel project settings.'
    });
  }

  const lat = req.query.lat || '37.2431';
  const lon = req.query.lon || '-115.7930';
  const dist = req.query.dist || '100';

  try {
    const url = `https://adsbexchange-com1.p.rapidapi.com/v2/lat/${lat}/lon/${lon}/dist/${dist}/`;
    const response = await fetch(url, {
      headers: {
        'x-rapidapi-key': key,
        'x-rapidapi-host': 'adsbexchange-com1.p.rapidapi.com'
      }
    });

    if (!response.ok) throw new Error(`ADS-B Exchange returned ${response.status}`);

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message, ac: [] });
  }
}
