/** Types for P3 — Cooperatives module. camelCase matching backend entity serialization. */

export type MemberStatus = 'pending' | 'active' | 'suspended' | 'left';
export type FarmingType = 'organic' | 'traditional' | 'vietgap' | 'globalgap';
export type ProductUnit = 'kg' | 'ton' | 'box' | 'bunch' | 'liter' | 'piece';
export type BulkStatus =
  | 'draft'
  | 'pending_approval'
  | 'active'
  | 'out_of_stock'
  | 'rejected'
  | 'archived'
  | 'suspended';

export interface FarmerLite {
  id: string;
  fullName: string | null;
  phone?: string;
  avatarUrl?: string | null;
}

export interface CooperativeLite {
  id: string;
  fullName: string | null;
  avatarUrl?: string | null;
}

export interface CooperativeMember {
  id: string;
  cooperativeId: string;
  farmerId: string;
  status: MemberStatus;
  joinRequestNote: string | null;
  approvedAt: string | null;
  rejectedReason: string | null;
  createdAt: string;
  farmer?: FarmerLite;
  cooperative?: CooperativeLite;
}

export interface BulkListing {
  id: string;
  cooperativeId: string;
  /** UUID — matches P2 ProductCategory.id (which is UUID at runtime despite SQL doc saying INT). */
  categoryId: string | null;
  title: string;
  description: string | null;
  totalQuantity: number;
  unit: ProductUnit;
  pricePerUnit: number;
  farmingType: FarmingType | null;
  provinceId: number | null;
  harvestDateFrom: string | null;
  harvestDateTo: string | null;
  status: BulkStatus;
  createdAt: string;
  cooperative?: CooperativeLite;
  contributions?: BulkListingContribution[];
}

export interface BulkListingContribution {
  id: string;
  bulkListingId: string;
  farmerId: string;
  productId: string | null;
  quantity: number;
  unit: ProductUnit;
  createdAt: string;
  farmer?: FarmerLite;
}

export interface HarvestSchedule {
  id: string;
  cooperativeId: string | null;
  farmerId: string;
  productId: string | null;
  expectedDate: string;
  estimatedQty: number | null;
  unit: ProductUnit | null;
  actualDate: string | null;
  actualQty: number | null;
  note: string | null;
  createdAt: string;
  farmer?: FarmerLite;
}

export interface ProductionReport {
  totalEstimated: number;
  totalActual: number;
  byMember: Array<{
    farmerId: string;
    farmerName: string | null;
    estimated: number;
    actual: number;
  }>;
  byMonth: Array<{ month: string; estimated: number; actual: number }>;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ── Payloads ─────────────────────────────────────────────────────────────────

export interface RequestJoinPayload {
  note?: string;
}

export interface CreateBulkListingPayload {
  title: string;
  description?: string;
  categoryId?: string;
  totalQuantity: number;
  unit: ProductUnit;
  pricePerUnit: number;
  farmingType?: FarmingType;
  provinceId?: number;
  harvestDateFrom?: string;
  harvestDateTo?: string;
}

export interface ContributePayload {
  quantity: number;
  unit: ProductUnit;
  productId?: string;
}

export interface CreateHarvestPayload {
  farmerId?: string;
  productId?: string;
  expectedDate: string;
  estimatedQty?: number;
  unit?: ProductUnit;
  note?: string;
}

export interface RecordActualPayload {
  actualDate: string;
  actualQty: number;
  note?: string;
}
