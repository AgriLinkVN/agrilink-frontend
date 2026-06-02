"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { cn } from "@/lib/utils";
import { vietnamMapGeojson } from "@/lib/vietnam-map-data";

const MAP_WIDTH = 900;
const MAP_HEIGHT = 760;
const MAP_PADDING = 12;
const MAP_SEA = "#72c8d6";
const MAP_LAND = "#d6eadf";
const MAP_CONTEXT_STROKE = "#315846";
const VIETNAM_FILL = "#6fc995";
const VIETNAM_HIGHLIGHT = "#ffc107";
const VIETNAM_BORDER = "#2f4f3f";
const VIETNAM_SELECTED_STROKE = "#111827";
const MIN_ZOOM = 6;
const MAX_ZOOM = 9;
const LABEL_ZOOM = 7;
const WHEEL_ZOOM_DELAY_MS = 160;

const MAP_VIEWPORT_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [94, 5],
          [94, 25.5],
          [123, 25.5],
          [123, 5],
          [94, 5],
        ]],
      },
      properties: {},
    },
  ],
} satisfies FeatureCollection;

const SPECIAL_LABELS = [
  { key: "hoang-sa", name: "Đặc khu Hoàng Sa\n(Đà Nẵng)", lng: 112.29481598689127, lat: 16.16155528039385 },
  { key: "truong-sa", name: "Đặc khu Trường Sa\n(Khánh Hòa)", lng: 114.39907007004128, lat: 9.319750888077948 },
  { key: "con-dao", name: "Đặc khu Côn Đảo\n(TP. Hồ Chí Minh)", lng: 106.61382823842214, lat: 8.588880528131396 },
  { key: "phu-quoc", name: "Đặc khu Phú Quốc\n(An Giang)", lng: 103.99613687098773, lat: 10.166821896243544 },
  { key: "bien-dong", name: "Biển Đông (Việt Nam)", lng: 112.1099906601973, lat: 15.2538292200829 },
];

type VietnamMapFeature = Feature<
  Geometry,
  {
    code?: string;
    ten_tinh?: string;
    name?: string;
  }
>;

type VietnamSvgMapProps = {
  backgroundGeojsonData?: FeatureCollection;
  className?: string;
  geojsonData?: FeatureCollection;
  selectedProvinceCode?: string | null;
  visibleProvinceCodes?: string[];
  onProvinceClick?: (code: string) => void;
};

type VietnamMapPath = {
  code: string | null;
  d: string;
  feature: VietnamMapFeature;
  key: string;
  name: string;
};

type MapLabel = {
  key: string;
  name: string;
  x: number;
  y: number;
};

type ZoomedMapLabel = MapLabel & {
  screenX: number;
  screenY: number;
};

function getFeatureKey(feature: VietnamMapFeature, index: number) {
  return feature.properties?.code ?? feature.properties?.ten_tinh ?? `province-${index}`;
}

function getFeatureName(feature: VietnamMapFeature) {
  return feature.properties?.ten_tinh ?? feature.properties?.name ?? "Province";
}

function getFeatureCode(feature: VietnamMapFeature) {
  return feature.properties?.code ?? null;
}

function applyRestingPathStyle(path: SVGPathElement) {
  path.style.fill = path.dataset.baseFill ?? VIETNAM_FILL;
  path.style.opacity = path.dataset.baseOpacity ?? "1";
  path.style.stroke = path.dataset.baseStroke ?? VIETNAM_BORDER;
  path.style.strokeWidth = path.dataset.baseStrokeWidth ?? "0.9";
}

function applyHoverPathStyle(path: SVGPathElement) {
  path.style.fill = VIETNAM_HIGHLIGHT;
  path.style.opacity = "1";
}

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

function getZoomedCoordinate(value: number, scale: number, center: number) {
  return center + (value - center) * scale;
}

export function VietnamSvgMap({
  backgroundGeojsonData,
  className,
  geojsonData = vietnamMapGeojson,
  selectedProvinceCode,
  visibleProvinceCodes,
  onProvinceClick,
}: VietnamSvgMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const provinceLayerRef = useRef<SVGGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const hoveredPathRef = useRef<SVGPathElement | null>(null);
  const tooltipFrameRef = useRef<number | null>(null);
  const wheelZoomTimeoutRef = useRef<number | null>(null);
  const pendingTooltipRef = useRef<{ left: number; name: string; top: number } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(MIN_ZOOM);

  const zoomScale = 1 + (zoomLevel - MIN_ZOOM) * 0.72;
  const labelsVisible = zoomLevel >= LABEL_ZOOM;

  const { backgroundPaths, provinceLabels, provincePaths, specialLabels } = useMemo(() => {
    const projection = geoMercator().fitExtent(
      [
        [MAP_PADDING, MAP_PADDING],
        [MAP_WIDTH - MAP_PADDING, MAP_HEIGHT - MAP_PADDING],
      ],
      MAP_VIEWPORT_GEOJSON as GeoPermissibleObjects
    );
    const pathGenerator = geoPath(projection);
    const buildPath = (feature: VietnamMapFeature, index: number): VietnamMapPath | null => {
      const pathData = pathGenerator(feature as GeoPermissibleObjects);

      if (!pathData) {
        return null;
      }

      return {
        code: getFeatureCode(feature),
        d: pathData,
        feature,
        key: getFeatureKey(feature, index),
        name: getFeatureName(feature),
      };
    };
    const projectLabel = (label: { key: string; name: string; lng: number; lat: number }): MapLabel | null => {
      const point = projection([label.lng, label.lat]);

      if (!point) {
        return null;
      }

      return {
        key: label.key,
        name: label.name,
        x: point[0],
        y: point[1],
      };
    };
    const contextFeatures = (backgroundGeojsonData?.features ?? []) as VietnamMapFeature[];
    const mappedProvincePaths = (geojsonData.features as VietnamMapFeature[])
      .map(buildPath)
      .filter((path): path is VietnamMapPath => path !== null);

    return {
      backgroundPaths: contextFeatures
        .map(buildPath)
        .filter((path): path is VietnamMapPath => path !== null),
      provinceLabels: mappedProvincePaths.map((path) => {
        const [x, y] = pathGenerator.centroid(path.feature as GeoPermissibleObjects);

        return {
          key: path.key,
          name: path.name,
          x,
          y,
        };
      }),
      provincePaths: mappedProvincePaths,
      specialLabels: SPECIAL_LABELS.map(projectLabel).filter((label): label is MapLabel => label !== null),
    };
  }, [backgroundGeojsonData, geojsonData]);

  const visibleProvinceCodeSet = useMemo(() => {
    if (!visibleProvinceCodes) {
      return null;
    }

    return new Set(visibleProvinceCodes);
  }, [visibleProvinceCodes]);

  const getZoomedLabel = useCallback(
    (label: MapLabel): ZoomedMapLabel => ({
      ...label,
      screenX: getZoomedCoordinate(label.x, zoomScale, MAP_WIDTH / 2),
      screenY: getZoomedCoordinate(label.y, zoomScale, MAP_HEIGHT / 2),
    }),
    [zoomScale]
  );

  const zoomedProvinceLabels = useMemo(
    () => provinceLabels.map(getZoomedLabel),
    [getZoomedLabel, provinceLabels]
  );

  const zoomedSpecialLabels = useMemo(
    () => specialLabels.map(getZoomedLabel),
    [getZoomedLabel, specialLabels]
  );

  const hideTooltip = useCallback(() => {
    pendingTooltipRef.current = null;

    if (tooltipFrameRef.current !== null) {
      window.cancelAnimationFrame(tooltipFrameRef.current);
      tooltipFrameRef.current = null;
    }

    if (tooltipRef.current) {
      tooltipRef.current.style.display = "none";
    }
  }, []);

  const moveTooltip = useCallback((event: React.MouseEvent<SVGPathElement>, provinceName: string) => {
    if (labelsVisible || !containerRef.current || !tooltipRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    pendingTooltipRef.current = {
      left: event.clientX - rect.left + 14,
      name: provinceName,
      top: event.clientY - rect.top - 8,
    };

    if (tooltipFrameRef.current !== null) {
      return;
    }

    tooltipFrameRef.current = window.requestAnimationFrame(() => {
      tooltipFrameRef.current = null;

      if (!tooltipRef.current || !pendingTooltipRef.current) {
        return;
      }

      const { left, name, top } = pendingTooltipRef.current;
      tooltipRef.current.textContent = name;
      tooltipRef.current.style.display = "block";
      tooltipRef.current.style.left = `${left}px`;
      tooltipRef.current.style.top = `${top}px`;
    });
  }, [labelsVisible]);

  const handleProvinceEnter = useCallback(
    (event: React.MouseEvent<SVGPathElement>, provinceName: string) => {
      const path = event.currentTarget;
      const isSelected = path.dataset.selected === "true";

      if (hoveredPathRef.current !== path) {
        if (hoveredPathRef.current) {
          applyRestingPathStyle(hoveredPathRef.current);
        }

        if (isSelected) {
          hoveredPathRef.current = null;
        } else {
          hoveredPathRef.current = path;
          applyHoverPathStyle(path);
        }
      }

      moveTooltip(event, provinceName);
    },
    [moveTooltip]
  );

  const handleProvinceMove = useCallback(
    (event: React.MouseEvent<SVGPathElement>, provinceName: string) => {
      moveTooltip(event, provinceName);
    },
    [moveTooltip]
  );

  const handleProvinceLeave = useCallback(() => {
    if (hoveredPathRef.current) {
      applyRestingPathStyle(hoveredPathRef.current);
      hoveredPathRef.current = null;
    }

    hideTooltip();
  }, [hideTooltip]);

  const handleProvinceClick = useCallback(
    (feature: VietnamMapFeature) => {
      const code = getFeatureCode(feature);

      if (code) {
        onProvinceClick?.(code);
      }
    },
    [onProvinceClick]
  );

  const updateZoom = useCallback((direction: 1 | -1) => {
    setZoomLevel((currentZoom) => clampZoom(currentZoom + direction));
  }, []);

  const handleWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (wheelZoomTimeoutRef.current !== null) {
      return;
    }

    updateZoom(event.deltaY < 0 ? 1 : -1);
    wheelZoomTimeoutRef.current = window.setTimeout(() => {
      wheelZoomTimeoutRef.current = null;
    }, WHEEL_ZOOM_DELAY_MS);
  }, [updateZoom]);

  useEffect(() => {
    provinceLayerRef.current
      ?.querySelectorAll<SVGPathElement>("path[data-province-path='true']")
      .forEach(applyRestingPathStyle);

    hoveredPathRef.current = null;

    hideTooltip();
  }, [hideTooltip, labelsVisible, selectedProvinceCode, visibleProvinceCodes]);

  useEffect(() => {
    return () => {
      if (wheelZoomTimeoutRef.current !== null) {
        window.clearTimeout(wheelZoomTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full w-full", className)}
      onWheel={handleWheel}
      style={{ backgroundColor: MAP_SEA }}
    >
      <svg
        aria-label="Bản đồ hành chính Việt Nam"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="group"
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      >
        <defs>
          <linearGradient id="agri-map-sea" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#7bd4df" />
            <stop offset="100%" stopColor="#67bfce" />
          </linearGradient>
          <pattern id="agri-map-terrain" width="72" height="72" patternUnits="userSpaceOnUse">
            <path d="M-8 24 C 12 10, 28 10, 48 24 S 82 38, 96 22" fill="none" stroke="#8edbb2" strokeOpacity="0.5" strokeWidth="10" />
            <path d="M-12 54 C 10 42, 28 42, 48 56 S 78 70, 94 50" fill="none" stroke="#f8f5df" strokeOpacity="0.65" strokeWidth="8" />
            <path d="M10 6 C 28 18, 44 18, 62 4" fill="none" stroke="#6ec7a4" strokeOpacity="0.28" strokeWidth="5" />
          </pattern>
          <filter id="agri-map-soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#173b2c" floodOpacity="0.22" />
          </filter>
        </defs>

        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#agri-map-sea)" />

        <g
          style={{
            transform: `scale(${zoomScale})`,
            transformBox: "view-box",
            transformOrigin: "center",
            transition: "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {backgroundPaths.length > 0 ? (
            <g fill="none" stroke={MAP_CONTEXT_STROKE} strokeLinejoin="round" strokeOpacity={0.42} strokeWidth={1.2}>
              {backgroundPaths.map((path) => (
                <path
                  key={`background-${path.key}`}
                  d={path.d}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
          ) : null}

          <g fill={MAP_LAND} filter="url(#agri-map-soft-shadow)" opacity={0.8} stroke={MAP_CONTEXT_STROKE} strokeLinejoin="round" strokeOpacity={0.35} strokeWidth={2.5}>
            {provincePaths.map((path) => (
              <path
                key={`base-${path.key}`}
                d={path.d}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>

          <g ref={provinceLayerRef} stroke={VIETNAM_BORDER} strokeLinejoin="round" strokeOpacity={0.86} strokeWidth={0.9}>
            {provincePaths.map((path) => {
              const code = path.code;
              const isSelected = code === selectedProvinceCode;
              const isVisible = !visibleProvinceCodeSet || (code ? visibleProvinceCodeSet.has(code) : false);
              const baseFill = isSelected ? VIETNAM_HIGHLIGHT : VIETNAM_FILL;
              const baseOpacity = isVisible || isSelected ? 1 : 0.16;
              const baseStroke = isSelected ? VIETNAM_SELECTED_STROKE : VIETNAM_BORDER;
              const baseStrokeWidth = isSelected ? 1.8 : 0.9;

              return (
                <path
                  key={path.key}
                  d={path.d}
                  data-base-fill={baseFill}
                  data-base-opacity={baseOpacity}
                  data-base-stroke={baseStroke}
                  data-base-stroke-width={baseStrokeWidth}
                  data-province-path="true"
                  data-selected={isSelected}
                  fill={baseFill}
                  className="cursor-pointer focus:outline-none"
                  opacity={baseOpacity}
                  role={code ? "button" : undefined}
                  aria-label={code ? `Chọn ${path.name}` : undefined}
                  aria-pressed={code ? isSelected : undefined}
                  stroke={baseStroke}
                  strokeWidth={baseStrokeWidth}
                  tabIndex={code ? 0 : -1}
                  vectorEffect="non-scaling-stroke"
                  onClick={() => handleProvinceClick(path.feature)}
                  onBlur={(event) => applyRestingPathStyle(event.currentTarget)}
                  onFocus={(event) => applyHoverPathStyle(event.currentTarget)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleProvinceClick(path.feature);
                    }
                  }}
                  onMouseEnter={(event) => handleProvinceEnter(event, path.name)}
                  onMouseLeave={handleProvinceLeave}
                  onMouseMove={(event) => handleProvinceMove(event, path.name)}
                />
              );
            })}
          </g>
        </g>

        {labelsVisible ? (
          <g pointerEvents="none">
            {zoomedProvinceLabels.map((label) => (
              <g
                key={`province-label-${label.key}`}
                style={{
                  transform: `translate(${label.screenX}px, ${label.screenY}px)`,
                  transition: "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <text
                  fill="#333"
                  fontFamily="Inter, Arial, sans-serif"
                  fontSize={15}
                  fontWeight={700}
                  textAnchor="middle"
                >
                  {label.name}
                </text>
              </g>
            ))}
          </g>
        ) : null}

        <g pointerEvents="none">
          {zoomedSpecialLabels.map((label) => (
            <g
              key={`special-label-${label.key}`}
              style={{
                transform: `translate(${label.screenX}px, ${label.screenY - 7}px)`,
                transition: "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <text
                fill="#145875"
                fontFamily="Inter, Arial, sans-serif"
                fontSize={13}
                fontWeight={400}
                textAnchor="middle"
              >
                {label.name.split("\n").map((line, index) => (
                  <tspan key={line} x={0} dy={index === 0 ? 0 : 14}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          ))}
        </g>
      </svg>
      <div className="absolute bottom-4 right-4 z-20 flex flex-col overflow-hidden rounded border border-black/10 bg-white shadow-md">
        <button
          type="button"
          aria-label="Phóng to bản đồ"
          className="flex h-10 w-10 items-center justify-center text-2xl leading-none text-[#34443a] hover:bg-slate-50 disabled:text-slate-300"
          disabled={zoomLevel >= MAX_ZOOM}
          onClick={() => updateZoom(1)}
        >
          +
        </button>
        <div className="h-px bg-black/10" />
        <button
          type="button"
          aria-label="Thu nhỏ bản đồ"
          className="flex h-10 w-10 items-center justify-center text-2xl leading-none text-[#34443a] hover:bg-slate-50 disabled:text-slate-300"
          disabled={zoomLevel <= MIN_ZOOM}
          onClick={() => updateZoom(-1)}
        >
          -
        </button>
      </div>
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-20 hidden rounded bg-[#1B4332] px-2.5 py-1 text-xs font-semibold text-white shadow-md"
      />
    </div>
  );
}
