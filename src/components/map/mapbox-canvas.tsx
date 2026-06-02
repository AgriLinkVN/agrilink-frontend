"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import {
  PROVINCE_CODE_TO_NAME,
} from "@/data/province-mapping";
import type { FeatureCollection } from "geojson";

/* ── Constants ─────────────────────────────────────────────── */

const MAP_STYLES = {
  terrain: "mapbox://styles/mapbox/outdoors-v12",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
} as const;

export type MapStyleKey = keyof typeof MAP_STYLES;

/** Bounding box Việt Nam [Tây, Nam, Đông, Bắc] */
const VIETNAM_BOUNDS: [number, number, number, number] = [102.1, 8.2, 109.6, 23.4];

/**
 * Colors matching bandonongsanviet.vn
 * Default: uniform green, Hover/Selected: golden yellow
 */
const COLORS = {
  fill: "#2ba84a",         // uniform green (same as bandonongsanviet.vn)
  hover: "#ffc107",        // golden yellow on hover
  selected: "#ffc107",     // golden yellow on selected
  stroke: "#333",          // border color
  strokeHover: "#000",     // border on hover
  labelText: "#333",       // province label color
} as const;

/* ── Layer IDs ──────────────────────────────────────────────── */

const LAYER_IDS = {
  worldDim: "world-dim",
  vietnamBase: "vietnam-base",
  fill: "province-fill",
  borders: "province-borders",
  labels: "province-labels",
} as const;

const SOURCE_IDS = {
  provinces: "provinces",
  worldMask: "world-mask",
} as const;

/**
 * Aggressively customize base map:
 * - Hide ALL symbol layers except country-label and continent-label
 * - Our custom province-labels layer handles all VN labels
 * - Style country borders
 */
function customizeMapStyle(map: mapboxgl.Map) {
  const style = map.getStyle();
  if (!style?.layers) return;

  for (const layer of style.layers) {
    const id = layer.id;

    // Hide ALL symbol layers except country + continent labels
    if (layer.type === "symbol") {
      const isCountryOrContinent =
        id.includes("country-label") || id.includes("continent-label");

      if (isCountryOrContinent) {
        // Keep and translate to Vietnamese
        map.setLayoutProperty(id, "text-field", [
          "coalesce",
          ["get", "name_vi"],
          ["get", "name"],
        ]);
      } else {
        // Hide everything else: state-label, settlement-*, place-*, poi-*, road-*, water-*, natural-*, etc.
        map.setLayoutProperty(id, "visibility", "none");
      }
    }

    // Style country borders
    if (id.includes("admin-0-boundary") && layer.type === "line") {
      map.setPaintProperty(id, "line-color", "#1a6b3c");
      map.setPaintProperty(id, "line-width", 2);
      map.setPaintProperty(id, "line-opacity", 1);
    }

    // Hide province-level boundaries from base map (we have our own)
    if (id.includes("admin-1-boundary") && layer.type === "line") {
      map.setLayoutProperty(id, "visibility", "none");
    }
  }
}

/* ── Props ──────────────────────────────────────────────────── */

interface MapboxCanvasProps {
  className?: string;
  styleKey?: MapStyleKey;
  geojsonData?: FeatureCollection;
  filteredProvinceCodes?: string[];
  selectedProvinceCode?: string | null;
  onProvinceClick?: (code: string) => void;
  onProvinceHover?: (code: string | null) => void;
}

/* ── Component ─────────────────────────────────────────────── */

export function MapboxCanvas({
  className,
  styleKey = "terrain",
  geojsonData,
  filteredProvinceCodes,
  selectedProvinceCode,
  onProvinceClick,
  onProvinceHover,
}: MapboxCanvasProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapError = mapboxToken ? null : "Missing NEXT_PUBLIC_MAPBOX_TOKEN in .env.local";

  // Store latest geojsonData in ref so the style.load handler can access it
  const geojsonRef = useRef(geojsonData);
  geojsonRef.current = geojsonData;

  /* ── Setup choropleth layers ─────────────────────────────── */

  const setupChoroplethLayers = useCallback((map: mapboxgl.Map) => {
    const data = geojsonRef.current;
    if (!data) return;

    // Guard: remove ALL our layers (reverse order) then sources
    [
      LAYER_IDS.labels,
      LAYER_IDS.borders,
      LAYER_IDS.fill,
      LAYER_IDS.vietnamBase,
      LAYER_IDS.worldDim,
    ].forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id);
    });
    if (map.getSource(SOURCE_IDS.provinces)) map.removeSource(SOURCE_IDS.provinces);
    if (map.getSource(SOURCE_IDS.worldMask)) map.removeSource(SOURCE_IDS.worldMask);

    // ── World mask source (huge rectangle covering the entire world) ──
    map.addSource(SOURCE_IDS.worldMask, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]],
        },
      },
    });

    // ── Province source ──
    map.addSource(SOURCE_IDS.provinces, {
      type: "geojson",
      data,
    });

    // Layer 0a: Dim the entire world (semi-transparent white overlay)
    map.addLayer({
      id: LAYER_IDS.worldDim,
      type: "fill",
      source: SOURCE_IDS.worldMask,
      paint: {
        "fill-color": "#ffffff",
        "fill-opacity": 0.45,
      },
    });

    // Layer 0b: Undo dim for Vietnam (opaque white base so VN pops)
    map.addLayer({
      id: LAYER_IDS.vietnamBase,
      type: "fill",
      source: SOURCE_IDS.provinces,
      paint: {
        "fill-color": "#ffffff",
        "fill-opacity": 0.65,
      },
    });

    // Layer 1: Fill — uniform green (matching bandonongsanviet.vn)
    map.addLayer({
      id: LAYER_IDS.fill,
      type: "fill",
      source: SOURCE_IDS.provinces,
      paint: {
        "fill-color": COLORS.fill,
        "fill-opacity": 0.4,
      },
    });

    // Layer 2: Border lines — dark strokes matching source
    map.addLayer({
      id: LAYER_IDS.borders,
      type: "line",
      source: SOURCE_IDS.provinces,
      paint: {
        "line-color": COLORS.stroke,
        "line-width": 0.5,
        "line-opacity": 0.9,
      },
    });

    // Layer 3: Province labels (visible at zoom >= 7, one per feature, bold)
    map.addLayer({
      id: LAYER_IDS.labels,
      type: "symbol",
      source: SOURCE_IDS.provinces,
      minzoom: 7,
      layout: {
        "text-field": ["get", "ten_tinh"],
        "text-size": [
          "interpolate", ["linear"], ["zoom"],
          7, 11,
          9, 15,
        ],
        "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
        "text-anchor": "center",
        "text-allow-overlap": false,
        "text-ignore-placement": false,
        "text-padding": 20,
        "text-max-width": 6,
        "symbol-placement": "point",
      },
      paint: {
        "text-color": COLORS.labelText,
        "text-halo-color": "rgba(255,255,255,0.92)",
        "text-halo-width": 2,
      },
    });

    // Hover interaction
    map.on("mousemove", LAYER_IDS.fill, (e) => {
      map.getCanvas().style.cursor = "pointer";
      const code = e.features?.[0]?.properties?.code ?? null;
      setHoveredCode(code);
      onProvinceHover?.(code);
    });

    map.on("mouseleave", LAYER_IDS.fill, () => {
      map.getCanvas().style.cursor = "";
      setHoveredCode(null);
      onProvinceHover?.(null);
    });

    // Click interaction
    map.on("click", LAYER_IDS.fill, (e) => {
      const code = e.features?.[0]?.properties?.code;
      if (code) {
        onProvinceClick?.(code);
      }
    });
  }, [onProvinceClick, onProvinceHover]);

  /* ── Initialize map ──────────────────────────────────────── */

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    if (mapError) return;

    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[styleKey],
      attributionControl: false,
      minZoom: 5,
      maxZoom: 9,
      maxBounds: [
        [98, 5],
        [115, 26],
      ],
    });

    map.fitBounds(VIETNAM_BOUNDS, { padding: 20, animate: false });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

    // On initial load + every style change → re-add layers
    map.on("style.load", () => {
      customizeMapStyle(map);
      setupChoroplethLayers(map);
    });

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(mapContainerRef.current);

    mapRef.current = map;

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, [mapError, mapboxToken]);

  /* ── Style change (skip initial mount — already set in constructor) ── */

  const initialStyleRef = useRef(true);
  useEffect(() => {
    if (initialStyleRef.current) {
      initialStyleRef.current = false;
      return; // Skip: constructor already set the same style
    }
    if (mapRef.current) {
      mapRef.current.setStyle(MAP_STYLES[styleKey]);
      // style.load handler will re-add choropleth layers
    }
  }, [styleKey]);

  /* ── Update GeoJSON data when it changes ─────────────────── */

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geojsonData) return;

    // Always try to set up layers when data arrives
    const source = map.getSource(SOURCE_IDS.provinces) as mapboxgl.GeoJSONSource | undefined;
    if (source) {
      source.setData(geojsonData);
    } else {
      // Source doesn't exist yet → add all layers
      // Wait for style if not loaded
      if (map.isStyleLoaded()) {
        setupChoroplethLayers(map);
      } else {
        map.once("style.load", () => setupChoroplethLayers(map));
      }
    }
  }, [geojsonData, setupChoroplethLayers]);

  /* ── Reactive flyTo on selectedProvinceCode ──────────────── */

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geojsonData) return;

    if (!selectedProvinceCode) {
      // Reset to full Vietnam view
      map.fitBounds(VIETNAM_BOUNDS, { padding: 20, duration: 800 });
      return;
    }

    const feature = geojsonData.features.find(
      (f) => f.properties?.code === selectedProvinceCode
    );
    if (!feature) return;

    // Compute bounds from geometry
    const bounds = new mapboxgl.LngLatBounds();
    const addCoords = (coords: number[]) => bounds.extend(coords as [number, number]);
    const processCoordRing = (ring: number[][]) => ring.forEach(addCoords);

    if (feature.geometry.type === "Polygon") {
      (feature.geometry.coordinates as number[][][]).forEach(processCoordRing);
    } else if (feature.geometry.type === "MultiPolygon") {
      (feature.geometry.coordinates as number[][][][]).forEach((polygon) =>
        polygon.forEach(processCoordRing)
      );
    }

    map.fitBounds(bounds, { padding: 60, maxZoom: 9, duration: 1000 });
  }, [selectedProvinceCode, geojsonData]);

  /* ── Update paint expressions for hover/selected/filtered ─
   * Matching bandonongsanviet.vn behavior:
   * - Default: green #2ba84a, opacity 0.3, stroke #333, weight 0.5
   * - Hover:   yellow #ffc107, opacity 0.2, stroke #000, weight 0.5
   * - Selected: yellow #ffc107, opacity 0.5, stroke #000, weight 2
   */

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getLayer(LAYER_IDS.fill)) return;

    const effectiveHover = hoveredCode;
    const effectiveSelected = selectedProvinceCode ?? "";

    // ── fill-color: green by default, yellow on hover/selected ──
    const fillColorCases: unknown[] = ["case"];
    fillColorCases.push(["==", ["get", "code"], effectiveSelected], COLORS.selected);
    if (effectiveHover && effectiveHover !== effectiveSelected) {
      fillColorCases.push(["==", ["get", "code"], effectiveHover], COLORS.hover);
    }
    fillColorCases.push(COLORS.fill);
    map.setPaintProperty(LAYER_IDS.fill, "fill-color", fillColorCases as mapboxgl.Expression);

    // ── fill-opacity: selected=0.5, hovered=0.2, filtered-out=0.05, default=0.3 ──
    const opacityCases: unknown[] = ["case"];
    opacityCases.push(["==", ["get", "code"], effectiveSelected], 0.5);
    if (effectiveHover && effectiveHover !== effectiveSelected) {
      opacityCases.push(["==", ["get", "code"], effectiveHover], 0.2);
    }
    if (filteredProvinceCodes && filteredProvinceCodes.length > 0) {
      opacityCases.push(
        ["!", ["in", ["get", "code"], ["literal", filteredProvinceCodes]]],
        0.05
      );
    }
    opacityCases.push(0.3);
    map.setPaintProperty(LAYER_IDS.fill, "fill-opacity", opacityCases as mapboxgl.Expression);

    // ── line-width: selected=2, default=0.5 ──
    const lineWidthCases: unknown[] = ["case"];
    lineWidthCases.push(["==", ["get", "code"], effectiveSelected], 2);
    lineWidthCases.push(0.5);
    map.setPaintProperty(LAYER_IDS.borders, "line-width", lineWidthCases as mapboxgl.Expression);

    // ── line-color: hover/selected = #000, default = #333 ──
    const lineColorCases: unknown[] = ["case"];
    lineColorCases.push(["==", ["get", "code"], effectiveSelected], COLORS.strokeHover);
    if (effectiveHover && effectiveHover !== effectiveSelected) {
      lineColorCases.push(["==", ["get", "code"], effectiveHover], COLORS.strokeHover);
    }
    lineColorCases.push(COLORS.stroke);
    map.setPaintProperty(LAYER_IDS.borders, "line-color", lineColorCases as mapboxgl.Expression);
  }, [selectedProvinceCode, hoveredCode, filteredProvinceCodes]);

  /* ── Tooltip ─────────────────────────────────────────────── */

  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const onMove = (e: mapboxgl.MapMouseEvent) => {
      if (!tooltipRef.current || !hoveredCode) return;
      const name = PROVINCE_CODE_TO_NAME[hoveredCode] ?? "";
      if (!name) {
        tooltipRef.current.style.display = "none";
        return;
      }
      tooltipRef.current.textContent = name;
      tooltipRef.current.style.display = "block";
      tooltipRef.current.style.left = `${e.point.x + 12}px`;
      tooltipRef.current.style.top = `${e.point.y - 10}px`;
    };

    const onLeave = () => {
      if (tooltipRef.current) tooltipRef.current.style.display = "none";
    };

    map.on("mousemove", onMove);
    map.on("mouseleave", LAYER_IDS.fill, onLeave);

    return () => {
      map.off("mousemove", onMove);
      map.off("mouseleave", LAYER_IDS.fill, onLeave);
    };
  }, [hoveredCode]);

  /* ── Render ──────────────────────────────────────────────── */

  return (
    <div className={cn("relative h-full w-full bg-surface-green", className)}>
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-20 hidden rounded-md bg-[#1B4332] px-2.5 py-1 text-xs font-medium text-white shadow-md"
        style={{ display: "none" }}
      />

      {mapError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-green/95 p-6">
          <div className="max-w-sm rounded-lg border border-hairline bg-white p-5 text-center shadow-sm">
            <p className="font-semibold text-ink">Chưa có Mapbox token</p>
            <p className="mt-1 text-sm text-muted">{mapError}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}