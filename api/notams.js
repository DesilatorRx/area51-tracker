// api/notams.js
// Proxies FAA NOTAM API to avoid CORS issues in the browser
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const location = req.query.location || 'ZLA';
    const url = `https://api.faa.gov/notamapi/v1/notams?domesticLocation=${location}&pageSize=20&pageNum=0`;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`FAA API returned ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
