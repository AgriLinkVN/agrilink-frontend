# P4 ITE1 - QR + Gia + Ban do

## Scope
P4 phu trach trong Iteration 1:
- BE: traceability schema
- BE: market_prices schema
- FE: Mapbox GL map view in Next.js
- FE: mock province data for Vietnam map

## Mapbox
Token is stored in .env.local:
NEXT_PUBLIC_MAPBOX_TOKEN=...

Styles:
- mapbox://styles/mapbox/outdoors-v12
- mapbox://styles/mapbox/satellite-streets-v12

## Data Strategy
ITE1 uses mock province data first.
GeoJSON Vietnam provinces will be uploaded to Mapbox Studio later.

GeoJSON source:
https://github.com/daohoangson/dvhcvn

## ITE1 Done When
- Backend builds with traceability + market price entities.
- Frontend /map renders Mapbox map.
- Map token is not hardcoded.
- Terrain/satellite style switch works.
- Province markers and popups render from mock data.