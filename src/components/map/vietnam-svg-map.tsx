"use client";

import { useMemo } from "react";
import { geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { cn } from "@/lib/utils";
import { vietnamMapGeojson } from "@/lib/vietnam-map-data";

const MAP_WIDTH = 900;
const MAP_HEIGHT = 760;
const MAP_PADDING = 24;

type VietnamMapFeature = Feature<
  Geometry,
  {
    code?: string;
    ten_tinh?: string;
    name?: string;
  }
>;

type VietnamSvgMapProps = {
  className?: string;
  geojsonData?: FeatureCollection;
};

function getFeatureKey(feature: VietnamMapFeature, index: number) {
  return feature.properties?.code ?? feature.properties?.ten_tinh ?? `province-${index}`;
}

function getFeatureName(feature: VietnamMapFeature) {
  return feature.properties?.ten_tinh ?? feature.properties?.name ?? "Province";
}

export function VietnamSvgMap({
  className,
  geojsonData = vietnamMapGeojson,
}: VietnamSvgMapProps) {
  const { features, pathGenerator } = useMemo(() => {
    const projection = geoMercator().fitExtent(
      [
        [MAP_PADDING, MAP_PADDING],
        [MAP_WIDTH - MAP_PADDING, MAP_HEIGHT - MAP_PADDING],
      ],
      geojsonData as GeoPermissibleObjects
    );

    return {
      features: geojsonData.features as VietnamMapFeature[],
      pathGenerator: geoPath(projection),
    };
  }, [geojsonData]);

  return (
    <div className={cn("relative h-full w-full bg-[#f4f5f1]", className)}>
      <svg
        aria-label="Vietnam administrative map"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      >
        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#f4f5f1" />
        <g stroke="#34443a" strokeLinejoin="round" strokeWidth={0.9}>
          {features.map((feature, index) => {
            const pathData = pathGenerator(feature as GeoPermissibleObjects);

            if (!pathData) {
              return null;
            }

            return (
              <path
                key={getFeatureKey(feature, index)}
                d={pathData}
                fill="#2ba84a"
                vectorEffect="non-scaling-stroke"
              >
                <title>{getFeatureName(feature)}</title>
              </path>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
