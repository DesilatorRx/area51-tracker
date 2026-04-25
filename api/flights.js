// api/flights.js
// Queries OpenSky Network (free, no key) for live aircraft in the
// Las Vegas → Groom Lake corridor, then flags known Janet tail numbers.

const JANET_ICAO = {
  // Known Janet 737-600 ICAO hex addresses (derived from tail numbers)
  'a4d805': 'N4529W',  // Janet 737
  'a68077': 'N5294E',  // Janet 737
  'a6807e': 'N5294M',  // Janet 737
  'a4d4f0': 'N5175U',  // Janet 737
  'a4d4f1': 'N5176Y',  // Janet 737
  'a4d4f2': 'N5177C',  // Janet 737
  'a09d6e': 'N654BA',  // Janet King Air
  'a0c992': 'N661BA',  // Janet King Air
  'a0c993': 'N662BA',  // Janet King Air
};

// Bounding box: covers Las Vegas + full KLAS→Groom Lake corridor
const BBOX = {
  lamin: 35.5,   // south of Las Vegas
  lomin: -117.5, // west past Death Valley
  lamax: 38.5,   // north past Groom Lake
  lomax: -113.5  // east past Las Vegas
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  // Cache for 30s to be a good citizen with OpenSky rate limits
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');

  try {
    const url = `https://opensky-network.org/api/states/all?lamin=${BBOX.lamin}&lomin=${BBOX.lomin}&lamax=${BBOX.lamax}&lomax=${BBOX.lomax}`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) throw new Error(`OpenSky returned ${response.status}`);

    const data = await response.json();
    const states = data.states || [];

    // Map raw OpenSky state vectors to clean objects
    // State vector indices: https://openskynetwork.github.io/opensky-api/rest.html
    const aircraft = states.map(s => ({
      icao24:      s[0],
      callsign:    (s[1] || '').trim(),
      origin:      s[2],
      lastContact: s[4],
      lon:         s[5],
      lat:         s[6],
      altBaro:     s[7],   // meters
      onGround:    s[8],
      velocity:    s[9],   // m/s
      heading:     s[10],
      vertRate:    s[11],
      altGeo:      s[13],  // meters
      tailNumber:  JANET_ICAO[s[0]] || null,
      isJanet:     !!JANET_ICAO[s[0]] || (s[1] || '').trim().toUpperCase().startsWith('JANET')
    }));

    const janetFlights = aircraft.filter(a => a.isJanet);
    const totalInBox   = aircraft.length;

    // Also pull KLAS departures for Janet tail numbers in last 2 hours
    // This catches them right after takeoff before heading NW
    let recentDepartures = [];
    try {
      const now   = Math.floor(Date.now() / 1000);
      const begin = now - 7200; // 2 hours ago
      const depUrl = `https://opensky-network.org/api/flights/departure?airport=KLAS&begin=${begin}&end=${now}`;
      const depRes = await fetch(depUrl, { signal: AbortSignal.timeout(5000) });
      if (depRes.ok) {
        const depData = await depRes.json();
        recentDepartures = (depData || [])
          .filter(f => JANET_ICAO[f.icao24])
          .map(f => ({
            icao24:      f.icao24,
            tailNumber:  JANET_ICAO[f.icao24],
            callsign:    (f.callsign || '').trim(),
            departure:   f.firstSeen,
            destination: f.estArrivalAirport || 'KXTA',
            isJanet:     true,
            fromDepartures: true
          }));
      }
    } catch (e) {
      // Departure query is bonus data — don't fail if it errors
    }

    res.status(200).json({
      timestamp:        Math.floor(Date.now() / 1000),
      totalInBbox:      totalInBox,
      janetLive:        janetFlights,
      janetDepartures:  recentDepartures,
      allAircraft:      aircraft,
      source:           'OpenSky Network (free/anonymous)',
      bbox:             BBOX
    });

  } catch (err) {
    res.status(500).json({
      error:       err.message,
      janetLive:   [],
      totalInBbox: 0,
      source:      'OpenSky Network — error'
    });
  }
}
