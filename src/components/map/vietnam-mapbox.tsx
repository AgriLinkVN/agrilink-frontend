"use client";

import React, { useMemo, useState, useRef, useCallback, useEffect } from "react";
import Map, { Source, Layer, Marker, MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import { cn } from "@/lib/utils";
import { vietnamMapGeojson } from "@/lib/vietnam-map-data";

const SPECIAL_LABELS = [
  { key: "hoang-sa", name: "Đặc khu Hoàng Sa\n(Đà Nẵng)", lng: 112.29481598689127, lat: 16.16155528039385 },
  { key: "truong-sa", name: "Đặc khu Trường Sa\n(Khánh Hòa)", lng: 114.39907007004128, lat: 9.319750888077948 },
  { key: "con-dao", name: "Đặc khu Côn Đảo\n(TP. Hồ Chí Minh)", lng: 106.61382823842214, lat: 8.588880528131396 },
  { key: "phu-quoc", name: "Đặc khu Phú Quốc\n(An Giang)", lng: 103.99613687098773, lat: 10.166821896243544 },
  { key: "bien-dong", name: "Biển Đông (Việt Nam)", lng: 112.1099906601973, lat: 15.2538292200829 },
];

export type VietnamMapboxProps = {
  className?: string;
  selectedProvinceCode?: string | null;
  visibleProvinceCodes?: string[];
  onProvinceClick?: (code: string) => void;
};

// Bảng màu chuẩn từ src.txt (BĐNSV)
const baseFillStyle: any = {
  id: "provinces-fill",
  type: "fill",
  paint: {
    "fill-color": "#2ba84a",
    "fill-opacity": 0.6, // Tăng nhẹ so với 0.3 gốc để bù trừ nền sáng của Mapbox
    "fill-outline-color": "#333333",
  },
};

const hoverFillStyle: any = {
  id: "provinces-hover",
  type: "fill",
  paint: {
    "fill-color": "#ffc107",
    "fill-opacity": 0.4,
  },
};

const selectedFillStyle: any = {
  id: "provinces-selected-fill",
  type: "fill",
  paint: {
    "fill-color": "#ffc107",
    "fill-opacity": 0.8,
  },
};

const selectedLineStyle: any = {
  id: "provinces-selected-line",
  type: "line",
  paint: {
    "line-color": "#000000",
    "line-width": 2,
  },
};

export function VietnamMapbox({
  className,
  selectedProvinceCode,
  visibleProvinceCodes,
  onProvinceClick,
}: VietnamMapboxProps) {
  const mapRef = useRef<MapRef>(null);
  const [hoverInfo, setHoverInfo] = useState<string | null>(null);
  const [zoom, setZoom] = useState(6);

  // Filter visible provinces (optional - currently showing all but keeping logic just in case)
  const mapData = useMemo(() => {
    return vietnamMapGeojson;
  }, []);

  // Calculate centroids for labels
  const provinceLabels = useMemo(() => {
    const customCenters: Record<string, { lat: number, lng: number }> = {
      "Khánh Hòa": { lat: 12.124579, lng: 109.272056 },
      "TP. Hồ Chí Minh": { lat: 10.720388, lng: 106.721878 },
      "Đà Nẵng": { lat: 15.656788, lng: 108.075071 },
      "Phú Thọ": { lat: 21.107451, lng: 105.083018 },
      "Hải Phòng": { lat: 20.772180, lng: 106.500041 },
      "Điện Biên": { lat: 21.733556, lng: 103.155499 },
      "An Giang": { lat: 10.316131, lng: 104.761799 },
      "Đồng Tháp": { lat: 10.483982, lng: 105.728057 },
      "Tây Ninh": { lat: 11.223456, lng: 106.170975 }
    };

    return vietnamMapGeojson.features.map((feature: any) => {
      const name = feature.properties?.ten_tinh || feature.properties?.name;
      if (customCenters[name]) {
        return {
          key: feature.properties?.code || name,
          name: name,
          lng: customCenters[name].lng,
          lat: customCenters[name].lat,
        };
      }

      // Calculate bounding box center
      let minLng = 180, maxLng = -180, minLat = 90, maxLat = -90;
      
      const extractCoords = (coords: any[]) => {
        if (Array.isArray(coords)) {
          if (coords.length === 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number') {
            const [lng, lat] = coords;
            if (lng < minLng) minLng = lng;
            if (lng > maxLng) maxLng = lng;
            if (lat < minLat) minLat = lat;
            if (lat > maxLat) maxLat = lat;
          } else {
            coords.forEach(extractCoords);
          }
        }
      };
      
      if (feature.geometry?.coordinates) {
        extractCoords(feature.geometry.coordinates);
      }
      
      return {
        key: feature.properties?.code || name,
        name: name,
        lng: minLng !== 180 ? (minLng + maxLng) / 2 : 0,
        lat: minLat !== 90 ? (minLat + maxLat) / 2 : 0,
      };
    }).filter(label => label.lat !== 0);
  }, []);

  const onHover = useCallback((event: any) => {
    const { features } = event;
    const hoveredFeature = features && features[0];
    if (hoveredFeature) {
      setHoverInfo(hoveredFeature.properties.code);
    } else {
      setHoverInfo(null);
    }
  }, []);

  const onClick = useCallback((event: any) => {
    const { features } = event;
    const clickedFeature = features && features[0];
    if (clickedFeature) {
      const code = clickedFeature.properties.code;
      if (code && onProvinceClick) {
        onProvinceClick(code);
      }

      // Safe bounding box extraction
      let minLng = 180, maxLng = -180, minLat = 90, maxLat = -90;
      
      const extractCoords = (coords: any[]) => {
        if (Array.isArray(coords)) {
          if (coords.length === 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number') {
            const [lng, lat] = coords;
            if (lng < minLng) minLng = lng;
            if (lng > maxLng) maxLng = lng;
            if (lat < minLat) minLat = lat;
            if (lat > maxLat) maxLat = lat;
          } else {
            coords.forEach(extractCoords);
          }
        }
      };

      if (clickedFeature.geometry?.coordinates) {
        extractCoords(clickedFeature.geometry.coordinates);

        if (mapRef.current && minLng !== 180) {
          mapRef.current.fitBounds(
            [[minLng, minLat], [maxLng, maxLat]],
            { padding: 150, duration: 1200, maxZoom: 7.5 }
          );
        }
      }
    }
  }, [onProvinceClick]);

  const onMapLoad = useCallback((e: any) => {
    const map = e.target;
    const style = map.getStyle();
    if (style && style.layers) {
      // Bóc tách toàn bộ nhãn tên, ranh giới cũ, địa hình, và đường xá để có nền sạch như BĐNSV
      const cleanedLayers = style.layers.filter((layer: any) => {
        if (layer.type === "symbol") return false;
        if (layer.id.includes("admin") || layer.id.includes("boundary")) return false;
        if (layer.id.includes("contour") || layer.id.includes("hillshade")) return false;
        if (layer.id.includes("road") || layer.id.includes("path") || layer.id.includes("trail")) return false;
        return true;
      });
      map.setStyle({ ...style, layers: cleanedLayers });
    }
  }, []);

  // Filters for layers
  const hoverFilter = useMemo(() => ["==", "code", hoverInfo || ""], [hoverInfo]);
  const selectedFilter = useMemo(() => ["==", "code", selectedProvinceCode || ""], [selectedProvinceCode]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 106.025002,
          latitude: 16.036903,
          zoom: 5.5,
        }}
        minZoom={5}
        maxZoom={10}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        interactiveLayerIds={["provinces-fill"]}
        onLoad={onMapLoad}
        onMouseMove={onHover}
        onMouseLeave={() => setHoverInfo(null)}
        onClick={onClick}
        onZoom={(e) => setZoom(e.viewState.zoom)}
        cursor={hoverInfo ? "pointer" : "grab"}
      >
        <Source type="geojson" data={mapData as any}>
          {/* Base Provinces */}
          <Layer {...baseFillStyle} />
          
          {/* Hovered Province */}
          <Layer {...hoverFillStyle} filter={hoverFilter as any} />
          
          {/* Selected Province */}
          <Layer {...selectedFillStyle} filter={selectedFilter as any} />
          <Layer {...selectedLineStyle} filter={selectedFilter as any} />
        </Source>

        {/* Dynamic Province Labels (Visible when zoom >= 6.5) */}
        {zoom >= 6.5 && provinceLabels.map((label) => (
          <Marker
            key={`prov-label-${label.key}`}
            longitude={label.lng}
            latitude={label.lat}
            anchor="center"
          >
            <div style={{
              color: "#333",
              fontSize: "14px",
              fontWeight: "bold",
              textShadow: "1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white",
              pointerEvents: "none",
              whiteSpace: "nowrap"
            }}>
              {label.name}
            </div>
          </Marker>
        ))}

        {/* Special Zone Labels (Always visible) */}
        {SPECIAL_LABELS.map((label) => (
          <Marker
            key={label.key}
            longitude={label.lng}
            latitude={label.lat}
            anchor="center"
          >
            <div style={{
              color: "#145875",
              fontSize: "13px",
              fontWeight: "normal",
              textAlign: "center",
              lineHeight: "1.2",
              textShadow: "1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white",
              pointerEvents: "none"
            }}>
              {label.name.split('\n').map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}

export default VietnamMapbox;
