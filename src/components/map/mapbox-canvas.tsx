"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import mapboxgl from "mapbox-gl";
import { Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const MAP_STYLES = {
  terrain: "mapbox://styles/mapbox/outdoors-v12",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
} as const;

/**
 * Layer nhãn được phép hiện trên bản đồ.
 * Tất cả symbol layer khác sẽ bị ẩn hoàn toàn.
 */
const ALLOWED_LABELS = [
  "country-label",
  "state-label",
  "continent-label",
  "settlement-major-label",
  "settlement-minor-label",
];

/**
 * Tuỳ chỉnh style bản đồ:
 * 1. Ẩn hết tất cả symbol layer (text, icon)
 * 2. Bật lại chỉ nhãn tỉnh/thành phố/quốc gia
 * 3. Chuyển nhãn sang tiếng Việt
 * 4. Tô đậm viền ranh giới
 */
function customizeMapStyle(map: mapboxgl.Map) {
  const style = map.getStyle();
  if (!style?.layers) return;

  for (const layer of style.layers) {
    const id = layer.id;

    // Bước 1+2: Với tất cả symbol layer → ẩn, trừ whitelist
    if (layer.type === "symbol") {
      const duocPhepHien = ALLOWED_LABELS.some((kw) => id.includes(kw));
      if (duocPhepHien) {
        // Bước 3: Đổi sang tiếng Việt
        map.setLayoutProperty(id, "text-field", [
          "coalesce",
          ["get", "name_vi"],
          ["get", "name"],
        ]);
      } else {
        map.setLayoutProperty(id, "visibility", "none");
      }
    }

    // Bước 4a: Viền quốc gia — xanh đậm, dày
    if (id.includes("admin-0-boundary") && layer.type === "line") {
      map.setPaintProperty(id, "line-color", "#1a6b3c");
      map.setPaintProperty(id, "line-width", 3);
      map.setPaintProperty(id, "line-opacity", 1);
    }

    // Bước 4b: Viền tỉnh/thành — nét đứt
    if (id.includes("admin-1-boundary") && layer.type === "line") {
      map.setPaintProperty(id, "line-color", "#2d8a56");
      map.setPaintProperty(id, "line-width", 1.8);
      map.setPaintProperty(id, "line-opacity", 0.85);
      map.setPaintProperty(id, "line-dasharray", [4, 2]);
    }
  }
}

export function MapboxCanvas({ className }: { className?: string }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [styleKey, setStyleKey] = useState<keyof typeof MAP_STYLES>("terrain");
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
      style: MAP_STYLES.terrain,
      center: [107.8, 15.8],
      zoom: 4.8,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

    // Lần load đầu tiên
    map.on("load", () => customizeMapStyle(map));

    // Khi đổi style (Terrain ↔ Satellite)
    map.on("style.load", () => customizeMapStyle(map));

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [mapError, mapboxToken]);

  useEffect(() => {
    mapRef.current?.setStyle(MAP_STYLES[styleKey]);
  }, [styleKey]);

  return (
    <div className={cn("absolute inset-0 z-0 bg-surface-green", className)}>
      <div ref={mapContainerRef} className="h-full w-full" />

      {mapError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-green/95 p-6">
          <div className="max-w-sm rounded-lg border border-hairline bg-white p-5 text-center shadow-sm">
            <p className="font-semibold text-ink">Chưa có Mapbox token</p>
            <p className="mt-1 text-sm text-muted">{mapError}</p>
          </div>
        </div>
      ) : null}

      <div className="absolute left-4 top-4 flex gap-2">
        <button
          onClick={() => setStyleKey("terrain")}
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded bg-white px-3 text-sm font-semibold shadow-sm",
            styleKey === "terrain" ? "text-primary" : "text-muted"
          )}
        >
          <Layers size={15} />
          Địa hình
        </button>
        <button
          onClick={() => setStyleKey("satellite")}
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded bg-white px-3 text-sm font-semibold shadow-sm",
            styleKey === "satellite" ? "text-primary" : "text-muted"
          )}
        >
          <Layers size={15} />
          Vệ tinh
        </button>
      </div>
    </div>
  );
}
