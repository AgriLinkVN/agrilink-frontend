"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { cn } from "@/lib/utils";
import { vietnamMapGeojson } from "@/lib/vietnam-map-data";

const MAP_WIDTH = 900;
const MAP_HEIGHT = 760;
const MAP_PADDING = 24;
const MAP_BACKGROUND = "#eef1ec";
const MAP_BACKGROUND_LAND = "#f8f9f6";
const MAP_CONTEXT_STROKE = "#cbd2c8";
const VIETNAM_FILL = "#2ba84a";
const VIETNAM_HIGHLIGHT = "#ffc107";
const VIETNAM_BORDER = "#34443a";

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

function getFeatureKey(feature: VietnamMapFeature, index: number) {
  return feature.properties?.code ?? feature.properties?.ten_tinh ?? `province-${index}`;
}

function getFeatureName(feature: VietnamMapFeature) {
  return feature.properties?.ten_tinh ?? feature.properties?.name ?? "Province";
}

function getFeatureCode(feature: VietnamMapFeature) {
  return feature.properties?.code ?? null;
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
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const hoveredCodeRef = useRef<string | null>(null);
  const [hoveredProvinceCode, setHoveredProvinceCode] = useState<string | null>(null);

  const { backgroundFeatures, features, pathGenerator } = useMemo(() => {
    const projection = geoMercator().fitExtent(
      [
        [MAP_PADDING, MAP_PADDING],
        [MAP_WIDTH - MAP_PADDING, MAP_HEIGHT - MAP_PADDING],
      ],
      geojsonData as GeoPermissibleObjects
    );

    return {
      backgroundFeatures: (backgroundGeojsonData?.features ?? []) as VietnamMapFeature[],
      features: geojsonData.features as VietnamMapFeature[],
      pathGenerator: geoPath(projection),
    };
  }, [backgroundGeojsonData, geojsonData]);

  const visibleProvinceCodeSet = useMemo(() => {
    if (!visibleProvinceCodes) {
      return null;
    }

    return new Set(visibleProvinceCodes);
  }, [visibleProvinceCodes]);

  const moveTooltip = useCallback((event: React.MouseEvent<SVGPathElement>, feature: VietnamMapFeature) => {
    if (!containerRef.current || !tooltipRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    tooltipRef.current.textContent = getFeatureName(feature);
    tooltipRef.current.style.display = "block";
    tooltipRef.current.style.left = `${event.clientX - rect.left + 14}px`;
    tooltipRef.current.style.top = `${event.clientY - rect.top - 8}px`;
  }, []);

  const handleProvinceEnter = useCallback(
    (event: React.MouseEvent<SVGPathElement>, feature: VietnamMapFeature) => {
      const code = getFeatureCode(feature);

      if (code && hoveredCodeRef.current !== code) {
        hoveredCodeRef.current = code;
        setHoveredProvinceCode(code);
      }

      moveTooltip(event, feature);
    },
    [moveTooltip]
  );

  const handleProvinceMove = useCallback(
    (event: React.MouseEvent<SVGPathElement>, feature: VietnamMapFeature) => {
      moveTooltip(event, feature);
    },
    [moveTooltip]
  );

  const handleProvinceLeave = useCallback(() => {
    hoveredCodeRef.current = null;
    setHoveredProvinceCode(null);

    if (tooltipRef.current) {
      tooltipRef.current.style.display = "none";
    }
  }, []);

  const handleProvinceClick = useCallback(
    (feature: VietnamMapFeature) => {
      const code = getFeatureCode(feature);

      if (code) {
        onProvinceClick?.(code);
      }
    },
    [onProvinceClick]
  );

  return (
    <div ref={containerRef} className={cn("relative h-full w-full bg-[#eef1ec]", className)}>
      <svg
        aria-label="Vietnam administrative map"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      >
        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill={MAP_BACKGROUND} />
        <rect
          x={18}
          y={18}
          width={MAP_WIDTH - 36}
          height={MAP_HEIGHT - 36}
          rx={8}
          fill={MAP_BACKGROUND_LAND}
          stroke={MAP_CONTEXT_STROKE}
          strokeWidth={1}
        />

        {backgroundFeatures.length > 0 ? (
          <g fill="#e1e5de" stroke={MAP_CONTEXT_STROKE} strokeLinejoin="round" strokeWidth={0.8}>
            {backgroundFeatures.map((feature, index) => {
              const pathData = pathGenerator(feature as GeoPermissibleObjects);

              if (!pathData) {
                return null;
              }

              return (
                <path
                  key={`background-${getFeatureKey(feature, index)}`}
                  d={pathData}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </g>
        ) : null}

        <g fill="#ffffff" stroke={MAP_CONTEXT_STROKE} strokeLinejoin="round" strokeWidth={2.5}>
          {features.map((feature, index) => {
            const pathData = pathGenerator(feature as GeoPermissibleObjects);

            if (!pathData) {
              return null;
            }

            return (
              <path
                key={`base-${getFeatureKey(feature, index)}`}
                d={pathData}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </g>

        <g stroke={VIETNAM_BORDER} strokeLinejoin="round" strokeWidth={0.9}>
          {features.map((feature, index) => {
            const pathData = pathGenerator(feature as GeoPermissibleObjects);

            if (!pathData) {
              return null;
            }

            const code = getFeatureCode(feature);
            const isSelected = code === selectedProvinceCode;
            const isHovered = code === hoveredProvinceCode;
            const isVisible = !visibleProvinceCodeSet || (code ? visibleProvinceCodeSet.has(code) : false);

            return (
              <path
                key={getFeatureKey(feature, index)}
                d={pathData}
                fill={isSelected || isHovered ? VIETNAM_HIGHLIGHT : VIETNAM_FILL}
                className="cursor-pointer transition-colors duration-150"
                opacity={isVisible || isSelected ? 1 : 0.16}
                stroke={isSelected ? "#111827" : VIETNAM_BORDER}
                strokeWidth={isSelected ? 1.8 : 0.9}
                vectorEffect="non-scaling-stroke"
                onClick={() => handleProvinceClick(feature)}
                onMouseEnter={(event) => handleProvinceEnter(event, feature)}
                onMouseLeave={handleProvinceLeave}
                onMouseMove={(event) => handleProvinceMove(event, feature)}
              >
                <title>{getFeatureName(feature)}</title>
              </path>
            );
          })}
        </g>
      </svg>
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-20 hidden rounded bg-[#1B4332] px-2.5 py-1 text-xs font-semibold text-white shadow-md"
      />
    </div>
  );
}
