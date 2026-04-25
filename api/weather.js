// api/weather.js
// Proxies Open-Meteo weather API for Groom Lake coordinates
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const lat = req.query.lat || '37.2431';
  const lon = req.query.lon || '-115.7930';

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m,precipitation,cloudcover,weathercode&daily=sunrise,sunset&temperature_unit=fahrenheit&wind_speed_unit=kn&forecast_days=1&timezone=America%2FLos_Angeles`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Open-Meteo returned ${response.status}`);

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
