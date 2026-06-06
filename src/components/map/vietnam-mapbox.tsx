"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import Map, { Layer, Marker, MapRef, Source } from "react-map-gl/mapbox";
import type { Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { cn } from "@/lib/utils";
import { vietnamMapGeojson } from "@/lib/vietnam-map-data";

const SPECIAL_LABELS = [
    {
        key: "hoang-sa",
        name: "Đặc khu Hoàng Sa\n(Đà Nẵng)",
        lng: 112.29481598689127,
        lat: 16.16155528039385,
    },
    {
        key: "truong-sa",
        name: "Đặc khu Trường Sa\n(Khánh Hòa)",
        lng: 114.39907007004128,
        lat: 9.319750888077948,
    },
    {
        key: "con-dao",
        name: "Đặc khu Côn Đảo\n(TP. Hồ Chí Minh)",
        lng: 106.61382823842214,
        lat: 8.588880528131396,
    },
    {
        key: "phu-quoc",
        name: "Đặc khu Phú Quốc\n(An Giang)",
        lng: 103.99613687098773,
        lat: 10.166821896243544,
    },
    {
        key: "bien-dong",
        name: "Biển Đông (Việt Nam)",
        lng: 112.1099906601973,
        lat: 15.2538292200829,
    },
];

export type VietnamMapboxProps = {
    className?: string;
    selectedProvinceCode?: string | null;
    visibleProvinceCodes?: string[];
    onProvinceClick?: (code: string) => void;
};

const MAP_STYLE = "mapbox://styles/mapbox/outdoors-v12";
const MIN_OVERVIEW_ZOOM = 5;
const MAX_DETAIL_ZOOM = 8.2;
const PROVINCE_LABEL_ZOOM = 6.5;
const VIETNAM_OVERVIEW_BOUNDS: [[number, number], [number, number]] = [
    [96.8, 5.6],
    [123.2, 24.8],
];

function cleanBaseMapStyle(map: MapboxMap) {
    const style = map.getStyle();
    if (!style?.layers) return;

    for (const layer of style.layers) {
        const id = layer.id;

        if (layer.type === "symbol") {
            const keepCountryLabel =
                id.includes("country-label") || id.includes("continent-label");

            if (!keepCountryLabel) {
                map.setLayoutProperty(id, "visibility", "none");
            } else {
                map.setLayoutProperty(id, "text-field", [
                    "coalesce",
                    ["get", "name_vi"],
                    ["get", "name"],
                ]);
            }
            continue;
        }

        const shouldHide =
            id.includes("admin-1-boundary") ||
            id.includes("contour") ||
            id.includes("hillshade") ||
            id.includes("road") ||
            id.includes("path") ||
            id.includes("trail");

        if (shouldHide) {
            map.setLayoutProperty(id, "visibility", "none");
        }
    }
}

const baseFillStyle: any = {
    id: "provinces-fill",
    type: "fill",
    paint: {
        "fill-color": "#2ba84a",
        "fill-opacity": 0.6,
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
    const activeHoverCodeRef = useRef<string | null>(null);
    const hoverFrameRef = useRef<number | null>(null);
    const pendingHoverCodeRef = useRef<string | null>(null);
    const [zoom, setZoom] = useState(6);
    const [mapReady, setMapReady] = useState(false);

    const mapData = useMemo(() => vietnamMapGeojson, []);

    const provinceLabels = useMemo(() => {
        const customCenters: Record<string, { lat: number; lng: number }> = {
            "Khánh Hòa": { lat: 12.124579, lng: 109.272056 },
            "TP. Hồ Chí Minh": { lat: 10.720388, lng: 106.721878 },
            "Đà Nẵng": { lat: 15.656788, lng: 108.075071 },
            "Phú Thọ": { lat: 21.107451, lng: 105.083018 },
            "Hải Phòng": { lat: 20.77218, lng: 106.500041 },
            "Điện Biên": { lat: 21.733556, lng: 103.155499 },
            "An Giang": { lat: 10.316131, lng: 104.761799 },
            "Đồng Tháp": { lat: 10.483982, lng: 105.728057 },
            "Tây Ninh": { lat: 11.223456, lng: 106.170975 },
        };

        return vietnamMapGeojson.features
            .map((feature: any) => {
                const name = feature.properties?.ten_tinh || feature.properties?.name;

                if (customCenters[name]) {
                    return {
                        key: feature.properties?.code || name,
                        name,
                        lng: customCenters[name].lng,
                        lat: customCenters[name].lat,
                    };
                }

                let minLng = 180;
                let maxLng = -180;
                let minLat = 90;
                let maxLat = -90;

                const extractCoords = (coords: any[]) => {
                    if (!Array.isArray(coords)) return;

                    if (
                        coords.length === 2 &&
                        typeof coords[0] === "number" &&
                        typeof coords[1] === "number"
                    ) {
                        const [lng, lat] = coords;
                        if (lng < minLng) minLng = lng;
                        if (lng > maxLng) maxLng = lng;
                        if (lat < minLat) minLat = lat;
                        if (lat > maxLat) maxLat = lat;
                        return;
                    }

                    coords.forEach(extractCoords);
                };

                if (feature.geometry?.coordinates) {
                    extractCoords(feature.geometry.coordinates);
                }

                return {
                    key: feature.properties?.code || name,
                    name,
                    lng: minLng !== 180 ? (minLng + maxLng) / 2 : 0,
                    lat: minLat !== 90 ? (minLat + maxLat) / 2 : 0,
                };
            })
            .filter((label) => label.lat !== 0);
    }, []);

    const commitHover = useCallback((code: string | null) => {
        pendingHoverCodeRef.current = code;

        if (hoverFrameRef.current !== null) return;

        hoverFrameRef.current = requestAnimationFrame(() => {
            hoverFrameRef.current = null;

            const nextCode = pendingHoverCodeRef.current;
            if (activeHoverCodeRef.current === nextCode) return;

            activeHoverCodeRef.current = nextCode;

            const map = mapRef.current?.getMap();
            if (!map?.getLayer("provinces-hover")) return;

            map.setFilter("provinces-hover", ["==", "code", nextCode ?? ""]);
            map.getCanvas().style.cursor = nextCode ? "pointer" : "grab";
        });
    }, []);

    const onHover = useCallback((event: any) => {
        const hoveredFeature = event.features?.[0];
        commitHover(hoveredFeature?.properties?.code ?? null);
    }, [commitHover]);

    const onClick = useCallback(
        (event: any) => {
            const clickedFeature = event.features?.[0];
            if (!clickedFeature) return;

            const code = clickedFeature.properties?.code;
            if (code) onProvinceClick?.(code);

            let minLng = 180;
            let maxLng = -180;
            let minLat = 90;
            let maxLat = -90;

            const extractCoords = (coords: any[]) => {
                if (!Array.isArray(coords)) return;

                if (
                    coords.length === 2 &&
                    typeof coords[0] === "number" &&
                    typeof coords[1] === "number"
                ) {
                    const [lng, lat] = coords;
                    if (lng < minLng) minLng = lng;
                    if (lng > maxLng) maxLng = lng;
                    if (lat < minLat) minLat = lat;
                    if (lat > maxLat) maxLat = lat;
                    return;
                }

                coords.forEach(extractCoords);
            };

            if (!clickedFeature.geometry?.coordinates) return;

            extractCoords(clickedFeature.geometry.coordinates);

            if (mapRef.current && minLng !== 180) {
                mapRef.current.fitBounds(
                    [
                        [minLng, minLat],
                        [maxLng, maxLat],
                    ],
                    { padding: 120, duration: 1000, maxZoom: MAX_DETAIL_ZOOM }
                );
            }
        },
        [onProvinceClick]
    );

    const onMapLoad = useCallback((event: any) => {
        const map = event.target as MapboxMap;

        cleanBaseMapStyle(map);
        map.fitBounds(VIETNAM_OVERVIEW_BOUNDS, {
            padding: 28,
            animate: false,
            maxZoom: MIN_OVERVIEW_ZOOM,
        });
        requestAnimationFrame(() => setMapReady(true));
    }, []);

    const selectedFilter = useMemo(
        () => ["==", "code", selectedProvinceCode || ""],
        [selectedProvinceCode]
    );

    return (
        <div className={cn("relative h-full w-full", className)}>
            <div
                className={cn(
                    "absolute inset-0 transition-opacity duration-150",
                    mapReady ? "opacity-100" : "opacity-0"
                )}
            >
                <Map
                    ref={mapRef}
                    initialViewState={{
                        longitude: 106.025002,
                        latitude: 16.036903,
                        zoom: MIN_OVERVIEW_ZOOM,
                    }}
                    minZoom={MIN_OVERVIEW_ZOOM}
                    maxZoom={MAX_DETAIL_ZOOM}
                    mapStyle={MAP_STYLE}
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    interactiveLayerIds={["provinces-fill"]}
                    onLoad={onMapLoad}
                    onMouseMove={onHover}
                    onMouseLeave={() => commitHover(null)}
                    onClick={onClick}
                    onZoom={(event) => setZoom(event.viewState.zoom)}
                    cursor="grab"
                >
                    <Source type="geojson" data={mapData as any}>
                        <Layer {...baseFillStyle} />
                        <Layer {...hoverFillStyle} filter={["==", "code", ""]} />
                        <Layer {...selectedFillStyle} filter={selectedFilter as any} />
                        <Layer {...selectedLineStyle} filter={selectedFilter as any} />
                    </Source>

                    {zoom >= PROVINCE_LABEL_ZOOM &&
                        provinceLabels.map((label) => (
                            <Marker
                                key={`prov-label-${label.key}`}
                                longitude={label.lng}
                                latitude={label.lat}
                                anchor="center"
                            >
                                <div
                                    style={{
                                        color: "#333",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textShadow:
                                            "1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white",
                                        pointerEvents: "none",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {label.name}
                                </div>
                            </Marker>
                        ))}

                    {SPECIAL_LABELS.map((label) => (
                        <Marker
                            key={label.key}
                            longitude={label.lng}
                            latitude={label.lat}
                            anchor="center"
                        >
                            <div
                                style={{
                                    color: "#145875",
                                    fontSize: "13px",
                                    fontWeight: "normal",
                                    textAlign: "center",
                                    lineHeight: "1.2",
                                    textShadow:
                                        "1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white",
                                    pointerEvents: "none",
                                }}
                            >
                                {label.name.split("\n").map((line, index) => (
                                    <div key={index}>{line}</div>
                                ))}
                            </div>
                        </Marker>
                    ))}
                </Map>
            </div>
        </div>
    );
}

export default VietnamMapbox;
