# Vietnam 34 Provinces GeoJSON Data

## Source
- URL: `http://bandonongsanviet.vn/vietnam.geojson`
- Fetched: 2026-05-31
- Original platform: Bản đồ Nông sản Việt (Cục Quản lý và Phát triển thị trường trong nước — Bộ Công Thương)

## Contents
- `vietnam-34-provinces.json`: GeoJSON FeatureCollection with 34 province polygons (post-merger per Nghị quyết 202/2025/QH15)
- `province-mapping.ts`: Hardcoded bidirectional mapping `ten_tinh ↔ code` + region classification

## Schema (per feature)
| Property | Type | Description |
|---|---|---|
| `ten_tinh` | string | Province name in Vietnamese |
| `sap_nhap` | string | Merger info ("không sáp nhập" or list of merged provinces) |
| `code` | string | Official province code (injected by us) |
| `dan_so` | number | Population |
| `dtich_km2` | number | Area in km² |
| `matdo_km2` | number | Population density |
| `quy_mo` | string | Administrative scale |
| `grdp` | number\|string | GDP in tỷ VNĐ |

## Usage Notes
- Geographic boundary data only — used for choropleth map visualization
- Product descriptions from the source are NOT copied into this project
- `code` property was added by our build script to match [vietnam-provinces.ts](../lib/vietnam-provinces.ts)
- Data is committed to repo and loaded statically (no runtime fetch)
