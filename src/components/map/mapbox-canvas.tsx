"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import mapboxgl from "mapbox-gl";
import { Layers } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn, formatPrice } from "@/lib/utils";
import { vietnamProvinces } from "@/lib/vietnam-provinces";

const MAP_STYLES = {
  terrain: "mapbox://styles/mapbox/outdoors-v12",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
} as const;

export function MapboxCanvas({ className }: { className?: string }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [styleKey, setStyleKey] = useState<keyof typeof MAP_STYLES>("terrain");
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapError = mapboxToken ? null : "Missing NEXT_PUBLIC_MAPBOX_TOKEN in .env.local";

  const markerData = useMemo(() => vietnamProvinces, []);

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
    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [mapError, mapboxToken]);

  useEffect(() => {
    mapRef.current?.setStyle(MAP_STYLES[styleKey]);
  }, [styleKey]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = markerData.map((province) => {
      const element = document.createElement("button");
      element.type = "button";
      element.className =
        "flex h-8 min-w-8 items-center justify-center rounded-full border-2 border-white bg-primary px-2 text-[11px] font-bold text-white shadow-lg";
      element.textContent =
        province.activeFarms >= 1000 ? `${(province.activeFarms / 1000).toFixed(1)}k` : String(province.activeFarms);

      const popup = new mapboxgl.Popup({ offset: 16 }).setHTML(`
        <strong>${province.name}</strong>
        <div>Main products: ${province.products.join(", ")}</div>
        <div>Active farms: ${province.activeFarms.toLocaleString("vi-VN")}</div>
        <div>Avg price: ${formatPrice(province.avgPrice)}</div>
      `);

      return new mapboxgl.Marker({ element })
        .setLngLat([province.lng, province.lat])
        .setPopup(popup)
        .addTo(map);
    });
  }, [markerData]);

  return (
    <div className={cn("absolute inset-0 z-0 bg-surface-green", className)}>
      <div ref={mapContainerRef} className="h-full w-full" />

      {mapError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-green/95 p-6">
          <div className="max-w-sm rounded-lg border border-hairline bg-white p-5 text-center shadow-sm">
            <p className="font-semibold text-ink">Mapbox token missing</p>
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
          Terrain
        </button>
        <button
          onClick={() => setStyleKey("satellite")}
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded bg-white px-3 text-sm font-semibold shadow-sm",
            styleKey === "satellite" ? "text-primary" : "text-muted"
          )}
        >
          <Layers size={15} />
          Satellite
        </button>
      </div>
    </div>
  );
}
