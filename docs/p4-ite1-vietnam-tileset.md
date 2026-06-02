# P4 ITE1 Vietnam SVG Map Notes

ITE1 uses a local SVG/D3 administrative map. Vietnam province polygons are rendered from local GeoJSON, with mock province metadata joined by province code.

## Source

- GeoJSON source: https://github.com/daohoangson/dvhcvn
- Local 34-province GeoJSON: `src/data/vietnam-34-provinces.json`
- Data join helper: `src/lib/vietnam-map-data.ts`

## SVG/D3 Checklist

- Keep the GeoJSON local so the map works without a map token or tile service.
- Check that all 34 province features receive a `code` property.
- Render the map through `src/components/map/vietnam-svg-map.tsx`.
- Use D3 projection/path generation only; do not call third-party map APIs for this route.
- Simplify the GeoJSON if the map payload becomes too large for production.

## Security

- No map token is required for the SVG/D3 map.
- Do not add third-party map tokens unless a future route explicitly needs an external map service.
