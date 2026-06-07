import type { FeatureCollection } from "geojson";
import vietnamGeojson from "@/data/vietnam-34-provinces.json";
import { vietnamProvinces } from "@/lib/vietnam-provinces";

const PROVINCE_NAME_ALIASES: Record<string, string> = {
  "ho chi minh": "ho chi minh city",
  "tp ho chi minh": "ho chi minh city",
};

export function normalizeProvinceName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/\b(tinh|thanh pho|tp)\b\.?/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const provinceCodeByName = new Map(
  vietnamProvinces.map((province) => [
    normalizeProvinceName(province.name),
    province.code,
  ])
);

export const vietnamMapGeojson = {
  ...(vietnamGeojson as FeatureCollection),
  features: (vietnamGeojson as FeatureCollection).features.map((feature) => {
    const rawName = String(feature.properties?.ten_tinh ?? feature.properties?.name ?? "");
    const normalizedName = normalizeProvinceName(rawName);
    const lookupName = PROVINCE_NAME_ALIASES[normalizedName] ?? normalizedName;

    return {
      ...feature,
      properties: {
        ...feature.properties,
        code: provinceCodeByName.get(lookupName),
      },
    };
  }),
} satisfies FeatureCollection;

export const vietnamMapProvinceCodes = new Set(
  vietnamMapGeojson.features
    .map((feature) => feature.properties?.code)
    .filter((code): code is string => typeof code === "string")
);
