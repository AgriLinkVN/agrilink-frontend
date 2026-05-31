"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const MAP_STYLES = {
  terrain: "mapbox://styles/mapbox/outdoors-v12",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
} as const;

export type MapStyleKey = keyof typeof MAP_STYLES;

/** Bounding box Việt Nam [Tây, Nam, Đông, Bắc] */
const VIETNAM_BOUNDS: [number, number, number, number] = [102.1, 8.2, 109.6, 23.4];

const ALLOWED_LABELS = [
  "country-label",
  "state-label",
  "continent-label",
  "settlement-major-label",
  "settlement-minor-label",
];

function customizeMapStyle(map: mapboxgl.Map) {
  const style = map.getStyle();
  if (!style?.layers) return;

  for (const layer of style.layers) {
    const id = layer.id;

    if (layer.type === "symbol") {
      const duocPhepHien = ALLOWED_LABELS.some((kw) => id.includes(kw));
      if (duocPhepHien) {
        map.setLayoutProperty(id, "text-field", [
          "coalesce",
          ["get", "name_vi"],
          ["get", "name"],
        ]);
      } else {
        map.setLayoutProperty(id, "visibility", "none");
      }
    }

    if (id.includes("admin-0-boundary") && layer.type === "line") {
      map.setPaintProperty(id, "line-color", "#1a6b3c");
      map.setPaintProperty(id, "line-width", 3);
      map.setPaintProperty(id, "line-opacity", 1);
    }

    if (id.includes("admin-1-boundary") && layer.type === "line") {
      map.setPaintProperty(id, "line-color", "#2d8a56");
      map.setPaintProperty(id, "line-width", 1.8);
      map.setPaintProperty(id, "line-opacity", 0.85);
      map.setPaintProperty(id, "line-dasharray", [4, 2]);
    }
  }
}

interface MapboxCanvasProps {
  className?: string;
  styleKey?: MapStyleKey;
}

export function MapboxCanvas({ className, styleKey = "terrain" }: MapboxCanvasProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapError = mapboxToken ? null : "Missing NEXT_PUBLIC_MAPBOX_TOKEN in .env.local";

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    if (mapError) {
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[styleKey],
      attributionControl: false,
      maxBounds: [
        [98, 5],
        [115, 26],
      ],
    });

    map.fitBounds(VIETNAM_BOUNDS, { padding: 20, animate: false });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

    map.on("load", () => customizeMapStyle(map));
    map.on("style.load", () => customizeMapStyle(map));

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(mapContainerRef.current);

    mapRef.current = map;

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, [mapError, mapboxToken]);

  // Khi styleKey thay đổi từ parent → đổi style
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(MAP_STYLES[styleKey]);
    }
  }, [styleKey]);

  return (
    <div className={cn("relative h-full w-full bg-surface-green", className)}>
      <div ref={mapContainerRef} className="h-full w-full" />

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
