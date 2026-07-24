export const PRODUCT_UNITS = [
  "kg",
  "ton",
  "box",
  "bunch",
  "liter",
  "piece",
] as const;

export const REGION_KEYS = [
  "north",
  "central",
  "highlands",
  "south",
] as const;

export const FARMING_TYPES = [
  "organic",
  "vietgap",
  "globalgap",
  "traditional",
] as const;

export const TRACE_STAGES = [
  "planting",
  "cultivation",
  "harvest",
  "quality",
  "packing",
  "transport",
] as const;

export type DataMode = "mock" | "api";
export type ProductUnit = (typeof PRODUCT_UNITS)[number];
export type RegionKey = (typeof REGION_KEYS)[number];
export type FarmingType = (typeof FARMING_TYPES)[number];
export type TraceStage = (typeof TRACE_STAGES)[number];

export interface DataSourceMetadata {
  mode: DataMode;
  asOfDate: string;
  disclosure: string;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
}

export interface ProductSummary {
  id: string;
  categoryId: string;
  name: string;
  unit: ProductUnit;
  farmingType: FarmingType;
  provinceCodes: string[];
}

export interface ProvinceSummary {
  code: string;
  name: string;
  region: RegionKey;
  center: {
    lat: number;
    lng: number;
  };
  productIds: string[];
  farmingTypes: FarmingType[];
  activeFarms: number;
  isDemo: boolean;
}

export interface MarketPricePoint {
  id: string;
  productId: string;
  categoryId: string;
  provinceCode: string;
  date: string;
  unit: ProductUnit;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  sourceLabel: string;
  isDemo: boolean;
}

export interface TraceEvent {
  id: string;
  stage: TraceStage;
  occurredAt: string;
  locationLabel: string;
  title: string;
  description: string;
  evidenceUrls?: string[];
}

export interface TraceBatch {
  qrCode: string;
  batchCode: string;
  productId: string;
  provinceCode: string;
  producer: {
    id: string;
    displayName: string;
    farmLabel: string;
  };
  certifications: string[];
  events: TraceEvent[];
  isDemo: boolean;
}

export interface ProductQuery {
  categoryId?: string;
}

export interface MarketPriceQuery {
  provinceCode?: string;
  categoryId?: string;
  productId?: string;
  from?: string;
  to?: string;
}

export interface DemoFixtures {
  categories: CategorySummary[];
  products: ProductSummary[];
  provinces: ProvinceSummary[];
  marketPrices: MarketPricePoint[];
  traceBatches: TraceBatch[];
}
