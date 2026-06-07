import { SearchClient } from "./search-client";
import type {
  ApiFarmingType,
  SearchFilter,
  SortBy,
  SortOrder,
} from "@/types/search";

const FARMING_TYPES: ApiFarmingType[] = [
  "organic",
  "vietgap",
  "globalgap",
  "traditional",
];
const SORT_BY: SortBy[] = ["createdAt", "pricePerUnit", "name"];
const ORDER: SortOrder[] = ["ASC", "DESC"];

function pickString(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

function pickNumber(v: string | string[] | undefined): number | undefined {
  const s = pickString(v);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const farming = pickString(sp.farming) as ApiFarmingType | undefined;
  const sortBy = pickString(sp.sortBy) as SortBy | undefined;
  const order = pickString(sp.order) as SortOrder | undefined;

  const initialFilter: SearchFilter = {
    search: pickString(sp.q),
    categoryId: pickString(sp.category),
    provinceId: pickString(sp.province),
    minPrice: pickNumber(sp.minPrice),
    maxPrice: pickNumber(sp.maxPrice),
    farmingType: farming && FARMING_TYPES.includes(farming) ? farming : undefined,
    sortBy: sortBy && SORT_BY.includes(sortBy) ? sortBy : "createdAt",
    order: order && ORDER.includes(order) ? order : "DESC",
  };

  return <SearchClient initialFilter={initialFilter} />;
}
