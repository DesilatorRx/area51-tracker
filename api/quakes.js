// api/quakes.js
// Proxies USGS earthquake feed filtered to Groom Lake area
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const lat = req.query.lat || '37.2431';
  const lon = req.query.lon || '-115.7930';
  const radius = req.query.radius || '150';
  const days = req.query.days || '30';

  try {
    const end = new Date().toISOString();
    const start = new Date(Date.now() - days * 86400000).toISOString();
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${start}&endtime=${end}&latitude=${lat}&longitude=${lon}&maxradiuskm=${radius}&orderby=time&limit=20`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`USGS returned ${response.status}`);

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
