# Calgary Home Dashboard

A compact, self-hosted Chrome home page for Calgary weather, local news, CAD rates, daylight, holidays, transit, and market snapshots.

## Run it

```powershell
npm start
```

No package installation is required; the server uses only Node's built-in modules.

Open `http://localhost:3000`, then set it as Chrome's startup or new-tab URL with a new-tab redirect extension. A browser cannot natively use a local URL as its built-in new-tab page.

## Live data and refresh cadence

| Card | Source | Automatic refresh |
| --- | --- | --- |
| Conditions, forecast, sunrise/sunset | Open-Meteo | 10 minutes |
| CAD exchange rates | ExchangeRate-API public feed | 30 minutes |
| Calgary briefing | CBC Calgary RSS | 15 minutes |
| Market snapshots + 10-day sparklines | Yahoo Finance public chart feed | 5 minutes |
| Transit | Configured Calgary GTFS-realtime endpoint | 1 minute |

The proxy prevents browser CORS problems and caches each upstream response slightly below the dashboard refresh interval. Any upstream failure becomes a visible **Connection Failed** state, rather than stale data presented as current.

## Transit setup

Calgary Transit real-time feed availability and terms can change. Set a feed URL in the environment before starting the app:

```powershell
$env:CALGARY_TRANSIT_FEED_URL = 'https://your-authorized-gtfs-realtime-feed'
npm start
```

The dashboard expects a JSON adapter response shaped like:

```json
{ "departures": [{ "route": "RED", "time": "4 min" }] }
```

This keeps the visual dashboard stable while allowing a Calgary Open Data/GTFS adapter suited to your feed access. Without it, the transit card clearly reports that it cannot connect.

## Local settings

The settings control stores an optional greeting name and a transit stop note in `localStorage`; no account or cloud persistence is used.

## Production note

The public Yahoo endpoint is practical for a personal home page but not a licensed financial-data source. Use a licensed market provider before redistributing or making trading decisions from the display.
