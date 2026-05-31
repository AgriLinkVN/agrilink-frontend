# P4 ITE1 Vietnam Tileset Notes

ITE1 uses mock province markers first. Vietnam province polygons are prepared for ITE2/ITE3.

## Source

- GeoJSON source: https://github.com/daohoangson/dvhcvn

## Mapbox Studio Checklist

- Download Vietnam province GeoJSON from dvhcvn.
- Check the province key property, preferably province code or province name.
- Upload the GeoJSON to Mapbox Studio as a tileset.
- Record the tileset id.
- Record the source-layer name.
- Record the property name used to join API/mock data with map polygons.

## Security

- Do not commit Mapbox tokens or secrets.
- Keep `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env.local`.
