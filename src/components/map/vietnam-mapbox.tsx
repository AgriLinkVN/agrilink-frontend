"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, MapRef } from "react-map-gl/mapbox";
import type {
    ExpressionSpecification,
    FillLayerSpecification,
    FilterSpecification,
    LineLayerSpecification,
    MapLayerMouseEvent,
    StyleSpecification,
} from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import mapboxOutdoorsClean from "@/data/mapbox-outdoors-clean.json";
import { cn } from "@/lib/utils";
import { vietnamMapGeojson } from "@/lib/vietnam-map-data";
import { vietnamProvinces } from "@/lib/vietnam-provinces";

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
    onReady?: () => void;
    onError?: (error: Error) => void;
};

const BASE_MAP_STYLE = mapboxOutdoorsClean as unknown as StyleSpecification;
const PROVINCE_SOURCE_ID = "agrilink-provinces";
const PROVINCE_FILL_LAYER_ID = "provinces-fill";
const PROVINCE_HOVER_LAYER_ID = "provinces-hover";
const PROVINCE_SELECTED_FILL_LAYER_ID = "provinces-selected-fill";
const PROVINCE_SELECTED_LINE_LAYER_ID = "provinces-selected-line";
const MIN_OVERVIEW_ZOOM = 5;
const MAX_DETAIL_ZOOM = 8.2;
const PROVINCE_LABEL_ZOOM = 6.5;
const VIETNAM_OVERVIEW_BOUNDS: [[number, number], [number, number]] = [
    [96.8, 5.6],
    [123.2, 24.8],
];

const PROVINCE_LABEL_CENTERS: Record<string, { lat: number; lng: number }> = {
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

const PROVINCE_LABELS = vietnamProvinces.map((province) => ({
    key: province.code,
    name: province.nameVi,
    ...(PROVINCE_LABEL_CENTERS[province.nameVi] ?? {
        lat: province.lat,
        lng: province.lng,
    }),
}));

const baseFillStyle: FillLayerSpecification = {
    id: PROVINCE_FILL_LAYER_ID,
    source: PROVINCE_SOURCE_ID,
    type: "fill",
    paint: {
        "fill-color": "#2ba84a",
        "fill-opacity": 0.6,
        "fill-outline-color": "#333333",
    },
};

const hoverFillStyle: FillLayerSpecification = {
    id: PROVINCE_HOVER_LAYER_ID,
    source: PROVINCE_SOURCE_ID,
    type: "fill",
    filter: ["==", ["get", "code"], ""],
    paint: {
        "fill-color": "#ffc107",
        "fill-opacity": 0.4,
    },
};

const selectedFillStyle: FillLayerSpecification = {
    id: PROVINCE_SELECTED_FILL_LAYER_ID,
    source: PROVINCE_SOURCE_ID,
    type: "fill",
    filter: ["==", ["get", "code"], ""],
    paint: {
        "fill-color": "#ffc107",
        "fill-opacity": 0.8,
    },
};

const selectedLineStyle: LineLayerSpecification = {
    id: PROVINCE_SELECTED_LINE_LAYER_ID,
    source: PROVINCE_SOURCE_ID,
    type: "line",
    filter: ["==", ["get", "code"], ""],
    paint: {
        "line-color": "#000000",
        "line-width": 2,
    },
};

const MAP_STYLE: StyleSpecification = {
    ...BASE_MAP_STYLE,
    sources: {
        ...BASE_MAP_STYLE.sources,
        [PROVINCE_SOURCE_ID]: {
            type: "geojson",
            data: vietnamMapGeojson,
        },
    },
    layers: [
        ...BASE_MAP_STYLE.layers,
        baseFillStyle,
        hoverFillStyle,
        selectedFillStyle,
        selectedLineStyle,
    ],
};

function getProvinceOpacity(
    visibleProvinceCodes: string[] | undefined
): number | ExpressionSpecification {
    if (!visibleProvinceCodes) return 0.6;

    return [
        "case",
        ["in", ["get", "code"], ["literal", visibleProvinceCodes]],
        0.6,
        0.05,
    ];
}

function getCoordinateBounds(coordinates: unknown) {
    const bounds = {
        minLng: 180,
        maxLng: -180,
        minLat: 90,
        maxLat: -90,
    };

    const visit = (value: unknown) => {
        if (!Array.isArray(value)) return;

        if (
            value.length >= 2 &&
            typeof value[0] === "number" &&
            typeof value[1] === "number"
        ) {
            const [lng, lat] = value;
            bounds.minLng = Math.min(bounds.minLng, lng);
            bounds.maxLng = Math.max(bounds.maxLng, lng);
            bounds.minLat = Math.min(bounds.minLat, lat);
            bounds.maxLat = Math.max(bounds.maxLat, lat);
            return;
        }

        value.forEach(visit);
    };

    visit(coordinates);
    return bounds.minLng === 180 ? null : bounds;
}

export function VietnamMapbox({
    className,
    selectedProvinceCode,
    visibleProvinceCodes,
    onProvinceClick,
    onReady,
    onError,
}: VietnamMapboxProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MapRef>(null);
    const readyNotifiedRef = useRef(false);
    const activeHoverCodeRef = useRef<string | null>(null);
    const hoverFrameRef = useRef<number | null>(null);
    const resizeFrameRef = useRef<number | null>(null);
    const pendingHoverCodeRef = useRef<string | null>(null);
    const [zoom, setZoom] = useState(6);
    const [provinceLayerReady, setProvinceLayerReady] = useState(false);

    const commitHover = useCallback((code: string | null) => {
        pendingHoverCodeRef.current = code;

        if (hoverFrameRef.current !== null) return;

        hoverFrameRef.current = requestAnimationFrame(() => {
            hoverFrameRef.current = null;

            const nextCode = pendingHoverCodeRef.current;
            if (activeHoverCodeRef.current === nextCode) return;

            activeHoverCodeRef.current = nextCode;

            const map = mapRef.current?.getMap();
            if (!map?.getLayer(PROVINCE_HOVER_LAYER_ID)) return;

            map.setFilter(PROVINCE_HOVER_LAYER_ID, [
                "==",
                ["get", "code"],
                nextCode ?? "",
            ]);
            map.getCanvas().style.cursor = nextCode ? "pointer" : "grab";
        });
    }, []);

    const onHover = useCallback((event: MapLayerMouseEvent) => {
        const hoveredFeature = event.features?.[0];
        const code = hoveredFeature?.properties?.code;
        commitHover(typeof code === "string" ? code : null);
    }, [commitHover]);

    const onClick = useCallback(
        (event: MapLayerMouseEvent) => {
            const clickedFeature = event.features?.[0];
            if (!clickedFeature) return;

            const code = clickedFeature.properties?.code;
            if (typeof code === "string") onProvinceClick?.(code);

            const bounds = getCoordinateBounds(
                "coordinates" in clickedFeature.geometry
                    ? clickedFeature.geometry.coordinates
                    : null
            );

            if (mapRef.current && bounds) {
                mapRef.current.fitBounds(
                    [
                        [bounds.minLng, bounds.minLat],
                        [bounds.maxLng, bounds.maxLat],
                    ],
                    { padding: 120, duration: 1000, maxZoom: MAX_DETAIL_ZOOM }
                );
            }
        },
        [onProvinceClick]
    );

    const onMapLoad = useCallback(() => {
        mapRef.current?.getMap().resize();
    }, []);

    const onMapRender = useCallback(() => {
        if (provinceLayerReady) return;

        const map = mapRef.current?.getMap();
        if (
            map?.getLayer(PROVINCE_FILL_LAYER_ID) &&
            map.isSourceLoaded(PROVINCE_SOURCE_ID)
        ) {
            setProvinceLayerReady(true);
            if (!readyNotifiedRef.current) {
                readyNotifiedRef.current = true;
                onReady?.();
            }
        }
    }, [onReady, provinceLayerReady]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || typeof ResizeObserver === "undefined") return;

        const resizeMap = () => {
            if (resizeFrameRef.current !== null) {
                cancelAnimationFrame(resizeFrameRef.current);
            }

            resizeFrameRef.current = requestAnimationFrame(() => {
                resizeFrameRef.current = null;
                mapRef.current?.getMap().resize();
            });
        };

        const resizeObserver = new ResizeObserver(resizeMap);
        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();

            if (resizeFrameRef.current !== null) {
                cancelAnimationFrame(resizeFrameRef.current);
            }
        };
    }, []);

    useEffect(() => {
        return () => {
            if (hoverFrameRef.current !== null) {
                cancelAnimationFrame(hoverFrameRef.current);
            }
        };
    }, []);

    const selectedFilter = useMemo(
        () => ["==", ["get", "code"], selectedProvinceCode || ""] as FilterSpecification,
        [selectedProvinceCode]
    );

    useEffect(() => {
        if (!provinceLayerReady) return;

        const map = mapRef.current?.getMap();
        if (!map?.getLayer(PROVINCE_FILL_LAYER_ID)) return;

        map.setPaintProperty(
            PROVINCE_FILL_LAYER_ID,
            "fill-opacity",
            getProvinceOpacity(visibleProvinceCodes)
        );
        map.setFilter(PROVINCE_SELECTED_FILL_LAYER_ID, selectedFilter);
        map.setFilter(PROVINCE_SELECTED_LINE_LAYER_ID, selectedFilter);
    }, [provinceLayerReady, selectedFilter, visibleProvinceCodes]);
    return (
        <div ref={containerRef} className={cn("relative h-full w-full", className)}>
            <div className="absolute inset-0">
                <Map
                    ref={mapRef}
                    initialViewState={{
                        bounds: VIETNAM_OVERVIEW_BOUNDS,
                        fitBoundsOptions: {
                            padding: 28,
                            maxZoom: MIN_OVERVIEW_ZOOM,
                        },
                    }}
                    minZoom={MIN_OVERVIEW_ZOOM}
                    maxZoom={MAX_DETAIL_ZOOM}
                    mapStyle={MAP_STYLE}
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    interactiveLayerIds={[PROVINCE_FILL_LAYER_ID]}
                    onLoad={onMapLoad}
                    onRender={onMapRender}
                    onError={(event) => {
                        onError?.(
                            event.error instanceof Error
                                ? event.error
                                : new Error("Mapbox không thể tải bản đồ.")
                        );
                    }}
                    onMouseMove={onHover}
                    onMouseLeave={() => commitHover(null)}
                    onClick={onClick}
                    onZoom={(event) => setZoom(event.viewState.zoom)}
                    cursor="grab"
                >
                    {provinceLayerReady && zoom >= PROVINCE_LABEL_ZOOM &&
                        PROVINCE_LABELS.map((label) => (
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

                    {provinceLayerReady && SPECIAL_LABELS.map((label) => (
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
