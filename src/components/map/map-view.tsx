"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import mapboxgl from "mapbox-gl";
import { Filter, Layers, MapPin, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { type VietnamProvince, vietnamProvinces } from "@/lib/vietnam-provinces";

const MAP_STYLES = {
  terrain: "mapbox://styles/mapbox/outdoors-v12",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
} as const;

const REGION_LABELS: Record<VietnamProvince["region"], string> = {
  North: "North",
  Central: "Central",
  Highlands: "Highlands",
  South: "South",
};

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function popupHtml(province: VietnamProvince) {
  return `
    <div style="min-width: 220px">
      <strong style="font-size: 14px">${province.name}</strong>
      <div style="margin-top: 4px; color: #6B7280">${REGION_LABELS[province.region]}</div>
      <div style="margin-top: 10px">Main products: ${province.products.join(", ")}</div>
      <div>Active farms: ${province.activeFarms.toLocaleString("vi-VN")}</div>
      <div>Avg price: ${formatPrice(province.avgPrice)}</div>
    </div>
  `;
}

export function MapView() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("All");
  const [selectedFarmingType, setSelectedFarmingType] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof MAP_STYLES>("terrain");
  const [selectedProvince, setSelectedProvince] = useState<VietnamProvince | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapError = mapboxToken ? null : "Missing NEXT_PUBLIC_MAPBOX_TOKEN in .env.local";

  const products = useMemo(
    () => uniqueSorted(vietnamProvinces.flatMap((province) => province.products)),
    []
  );
  const farmingTypes = useMemo(
    () => uniqueSorted(vietnamProvinces.flatMap((province) => province.farmingTypes)),
    []
  );

  const filteredProvinces = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return vietnamProvinces.filter((province) => {
      const matchesProduct = selectedProduct === "All" || province.products.includes(selectedProduct);
      const matchesFarming = selectedFarmingType === "All" || province.farmingTypes.includes(selectedFarmingType);
      const matchesRegion = selectedRegion === "All" || province.region === selectedRegion;
      const matchesSearch = !normalizedSearch || province.name.toLowerCase().includes(normalizedSearch);

      return matchesProduct && matchesFarming && matchesRegion && matchesSearch;
    });
  }, [searchTerm, selectedFarmingType, selectedProduct, selectedRegion]);

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
    const map = mapRef.current;
    if (!map) {
      return;
    }

    map.setStyle(MAP_STYLES[selectedStyle]);
  }, [selectedStyle]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = filteredProvinces.map((province) => {
      const markerElement = document.createElement("button");
      markerElement.type = "button";
      markerElement.className =
        "flex h-9 min-w-9 items-center justify-center rounded-full border-2 border-white bg-primary px-2 text-xs font-bold text-white shadow-lg transition-transform hover:scale-110";
      markerElement.textContent =
        province.activeFarms >= 1000 ? `${(province.activeFarms / 1000).toFixed(1)}k` : String(province.activeFarms);
      markerElement.addEventListener("click", () => setSelectedProvince(province));

      const popup = new mapboxgl.Popup({ offset: 18, closeButton: false }).setHTML(popupHtml(province));

      return new mapboxgl.Marker({ element: markerElement })
        .setLngLat([province.lng, province.lat])
        .setPopup(popup)
        .addTo(map);
    });
  }, [filteredProvinces]);

  return (
    <div className="flex min-h-[calc(100vh-72px)] bg-canvas">
      <aside className="hidden w-80 shrink-0 border-r border-hairline bg-white lg:flex lg:flex-col">
        <div className="border-b border-hairline p-5">
          <h1 className="flex items-center gap-2 text-lg font-semibold text-ink">
            <Filter size={18} className="text-primary" />
            Vietnam map
          </h1>
          <p className="mt-1 text-sm text-muted">{filteredProvinces.length} provinces visible</p>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <label className="flex h-10 items-center gap-2 rounded border border-border-strong px-3 focus-within:border-primary">
            <Search size={15} className="text-muted" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search province..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-soft"
            />
          </label>

          <FilterGroup
            label="Product"
            options={["All", ...products]}
            value={selectedProduct}
            onChange={setSelectedProduct}
          />
          <FilterGroup
            label="Farming type"
            options={["All", ...farmingTypes]}
            value={selectedFarmingType}
            onChange={setSelectedFarmingType}
          />
          <FilterGroup
            label="Region"
            options={["All", "North", "Central", "Highlands", "South"]}
            value={selectedRegion}
            onChange={setSelectedRegion}
          />

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedProduct("All");
              setSelectedFarmingType("All");
              setSelectedRegion("All");
              setSearchTerm("");
            }}
          >
            Clear filters
          </Button>
        </div>
      </aside>

      <main className="relative min-w-0 flex-1">
        <div ref={mapContainerRef} className="absolute inset-0" />

        {mapError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-green p-6">
            <div className="max-w-sm rounded-lg border border-hairline bg-white p-5 text-center shadow-sm">
              <MapPin className="mx-auto mb-3 text-primary" size={36} />
              <p className="font-semibold text-ink">Mapbox token missing</p>
              <p className="mt-1 text-sm text-muted">{mapError}</p>
            </div>
          </div>
        ) : null}

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStyle("terrain")}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded bg-white px-3 text-sm font-semibold shadow-sm",
              selectedStyle === "terrain" ? "text-primary" : "text-muted"
            )}
          >
            <Layers size={15} />
            Terrain
          </button>
          <button
            onClick={() => setSelectedStyle("satellite")}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded bg-white px-3 text-sm font-semibold shadow-sm",
              selectedStyle === "satellite" ? "text-primary" : "text-muted"
            )}
          >
            <Layers size={15} />
            Satellite
          </button>
        </div>

        {selectedProvince ? (
          <section className="absolute bottom-4 left-4 right-4 max-w-sm rounded-lg border border-hairline bg-white p-5 shadow-lg">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-ink">{selectedProvince.name}</h2>
                <p className="text-sm text-muted">{REGION_LABELS[selectedProvince.region]}</p>
              </div>
              <button
                onClick={() => setSelectedProvince(null)}
                className="flex h-8 w-8 items-center justify-center rounded hover:bg-surface-soft"
                aria-label="Close province details"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Metric label="Active farms" value={selectedProvince.activeFarms.toLocaleString("vi-VN")} />
              <Metric label="Avg price" value={formatPrice(selectedProvince.avgPrice)} />
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {selectedProvince.products.map((product) => (
                <Badge key={product} variant="organic">
                  {product}
                </Badge>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-ink">{label}</h2>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={cn(
              "rounded px-3 py-1.5 text-xs font-semibold transition-colors",
              value === option
                ? "bg-primary text-white"
                : "border border-hairline text-muted hover:border-primary hover:text-primary"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-surface-green p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-base font-bold text-primary">{value}</p>
    </div>
  );
}
