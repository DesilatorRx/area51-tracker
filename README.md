# 🛸 Groom Lake Live Tracker

An open-source, real-time activity monitor for Area 51 (Groom Lake / KXTA) built from publicly available data sources.

**Live at:** [your-url.vercel.app](https://your-url.vercel.app)

---

## What It Tracks

| Data | Source | Refresh |
|------|--------|---------|
| Seismic activity (150km radius) | USGS Earthquake API | 3 min |
| Weather at Groom Lake coords | Open-Meteo | 5 min |
| FAA NOTAMs (ZLA FIR) | FAA NOTAM API | 10 min |
| Janet Airlines ADS-B | ADS-B Exchange (RapidAPI) | Manual / on key entry |
| Satellite imagery timeline | ESRI World Imagery tiles | Static |
| Personnel estimates | Flight count model | 8 sec |

---

## Running Locally

```bash
git clone https://github.com/YOUR_USERNAME/area51-tracker
cd area51-tracker
cp .env.example .env.local
# Add your RAPIDAPI_KEY to .env.local
vercel dev
```

Then open `http://localhost:3000`

---

## Deploying to Vercel

```bash
vercel --prod
```

To enable live ADS-B tracking, add your RapidAPI key as an environment variable in your Vercel project dashboard:

**Vercel Dashboard → Your Project → Settings → Environment Variables**
- Key: `RAPIDAPI_KEY`
- Value: your RapidAPI key
- Environment: Production + Preview + Development

Get a free ADS-B Exchange key at: https://rapidapi.com/adsbx/api/adsbexchange-com

---

## Project Structure

```
area51-tracker/
├── index.html          # Main dashboard
├── api/
│   ├── notams.js       # FAA NOTAM proxy (fixes CORS)
│   ├── weather.js      # Open-Meteo proxy
│   ├── quakes.js       # USGS earthquake proxy
│   └── adsb.js         # ADS-B Exchange proxy (server-side key)
├── vercel.json         # Routing config
├── .env.example        # Environment variable template
└── .gitignore
```

---

## Contributing

Pull requests welcome. Some ideas for contributors:

- [ ] Leaflet.js interactive map with live ADS-B blip positions
- [ ] NOTAM parser that highlights R-4808 specific alerts
- [ ] Historical flight frequency chart (Chart.js)
- [ ] NASA FIRMS thermal anomaly integration
- [ ] Mobile-optimized layout
- [ ] Dark/phosphor theme toggle
- [ ] Rachel NV webcam embed (when available)
- [ ] Tikaboo Peak viewing conditions (visibility + wind)

**To contribute:**
1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## Disclaimer

All data is derived from publicly available open-source information. This project is not affiliated with, endorsed by, or connected to the U.S. Government, Department of Defense, U.S. Air Force, or any defense contractor. This is an OSINT hobbyist project for educational purposes.

Unauthorized access to the Nevada Test and Training Range is prohibited.

---

## Data Sources

- [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/fdsnws/event/1/)
- [Open-Meteo Weather API](https://open-meteo.com/)
- [FAA NOTAM API](https://api.faa.gov/)
- [ADS-B Exchange](https://www.adsbexchange.com/) via RapidAPI
- [Dreamland Resort](https://www.dreamlandresort.com/) — Janet schedule research
- [ESRI World Imagery](https://server.arcgisonline.com/) — Satellite tiles
