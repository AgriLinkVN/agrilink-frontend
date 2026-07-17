"use client";

import { useMemo, useState } from "react";
import type { ElementType } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { FarmingBadge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowUpDown,
  Ban,
  Eye,
  ExternalLink,
  Filter,
  Package,
  Pencil,
  Plus,
  RefreshCcw,
  RotateCcw,
  Search,
  Send,
} from "lucide-react";
import {
  CERT_STATUS_LABELS,
  PRODUCT_STATUS_LABELS,
  UNIT_LABELS,
  getPrimaryImage,
} from "@/lib/products-api";
import type { Product, ProductListResponse } from "@/lib/products-api";
import type { FarmingType } from "@/types";

type ProductStatus =
  | "all"
  | "draft"
  | "pending_approval"
  | "active"
  | "out_of_stock"
  | "rejected"
  | "archived"
  | "suspended";

type ProductStatusTarget = "pending_approval" | "active" | "out_of_stock";

const STATUS_FILTERS: Array<{ value: ProductStatus; label: string }> = [
  { value: "all", label: "Tất cả" },
  { value: "draft", label: PRODUCT_STATUS_LABELS.draft },
  { value: "pending_approval", label: PRODUCT_STATUS_LABELS.pending_approval },
  { value: "active", label: PRODUCT_STATUS_LABELS.active },
  { value: "out_of_stock", label: PRODUCT_STATUS_LABELS.out_of_stock },
  { value: "rejected", label: PRODUCT_STATUS_LABELS.rejected },
];

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-[#F3F4F6] text-[#6B7280]",
  pending_approval: "bg-[#FEF9C3] text-[#854D0E]",
  active: "bg-[#D1FAE5] text-[#065F46]",
  out_of_stock: "bg-[#FEE2E2] text-[#991B1B]",
  rejected: "bg-[#FEE2E2] text-[#991B1B]",
  archived: "bg-[#F3F4F6] text-[#6B7280]",
  suspended: "bg-[#FEF3C7] text-[#92400E]",
};

const ACTION_COPY: Record<
  ProductStatusTarget,
  { label: string; icon: ElementType; variant: "primary" | "secondary" | "ghost" }
> = {
  pending_approval: { label: "Gửi duyệt", icon: Send, variant: "secondary" },
  active: { label: "Mở bán lại", icon: RotateCcw, variant: "primary" },
  out_of_stock: { label: "Hết hàng", icon: Ban, variant: "ghost" },
};

function getNextStatus(product: Product): ProductStatusTarget | null {
  if (product.status === "draft" || product.status === "rejected") {
    return "pending_approval";
  }
  if (product.status === "active") return "out_of_stock";
  if (product.status === "out_of_stock") return "active";
  return null;
}

function buildProductsQuery() {
  const params = new URLSearchParams({
    page: "1",
    limit: "100",
    sortBy: "createdAt",
    order: "DESC",
  });

  return params.toString();
}

function getCertificationSummary(product: Product) {
  const certifications = product.certifications ?? [];
  if (certifications.length === 0) return "Chưa có chứng nhận";

  const counts = certifications.reduce<Record<string, number>>((acc, cert) => {
    const status = cert.status ?? (cert.isVerified ? "verified" : "pending");
    acc[status] = (acc[status] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([status, count]) => `${count} ${CERT_STATUS_LABELS[status] ?? status}`)
    .join(" · ");
}

export default function FarmerProductsPage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus>("all");
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const productsQueryKey = ["farmer", "products", accessToken] as const;
  const {
    data: productResult,
    isPending,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: productsQueryKey,
    queryFn: () => api.get<ProductListResponse>(`/products/me?${buildProductsQuery()}`, accessToken),
    enabled: !!accessToken,
    staleTime: 30_000,
  });
  const products = useMemo(() => productResult?.data ?? [], [productResult?.data]);
  const total = productResult?.total ?? products.length;
  const loading = !!accessToken && isPending;
  const error =
    actionError ??
    (!accessToken ? "Vui lòng đăng nhập bằng tài khoản người bán để quản lý sản phẩm." : null) ??
    (queryError instanceof Error ? queryError.message : null);

  const statusCounts = useMemo(() => {
    return products.reduce<Record<string, number>>(
      (acc, product) => {
        acc.all += 1;
        acc[product.status] = (acc[product.status] ?? 0) + 1;
        return acc;
      },
      { all: 0 },
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    const trimmedSearch = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;
      const matchesSearch =
        !trimmedSearch ||
        product.name.toLowerCase().includes(trimmedSearch) ||
        product.description?.toLowerCase().includes(trimmedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [products, searchQuery, statusFilter]);

  const statusMutation = useMutation({
    mutationFn: async ({
      product,
      nextStatus,
    }: {
      product: Product;
      nextStatus: ProductStatusTarget;
    }) => {
      if (!accessToken) throw new Error("Vui lòng đăng nhập để đổi trạng thái sản phẩm.");
      if (nextStatus === "active" && product.availableQuantity <= 0) {
        throw new Error("Sản phẩm cần có tồn kho lớn hơn 0 trước khi mở bán lại.");
      }
      const updated = await api.patch<Product>(
        `/products/${product.id}/status`,
        { status: nextStatus },
        accessToken,
      );
      return { product, updated };
    },
    onMutate: ({ product }) => {
      setActionId(product.id);
      setActionError(null);
    },
    onSuccess: ({ product, updated }) => {
      queryClient.setQueryData<ProductListResponse>(productsQueryKey, (current) => {
        if (!current) return current;
        return {
          ...current,
          data: current.data.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  ...updated,
                  images: updated.images?.length ? updated.images : item.images,
                  certifications: updated.certifications?.length
                    ? updated.certifications
                    : item.certifications,
                }
              : item,
          ),
        };
      });
    },
    onError: (err) => {
      setActionError(err instanceof Error ? err.message : "Không cập nhật được trạng thái sản phẩm");
    },
    onSettled: () => setActionId(null),
  });

  const updateStatus = async (product: Product, nextStatus: ProductStatusTarget) => {
    statusMutation.mutate({ product, nextStatus });
  };

  return (
    <DashboardLayout
      role="farmer"
      userName={user?.full_name ?? "Nông dân"}
      pageTitle="Sản phẩm của tôi"
      pageDescription={`${total} sản phẩm đang quản lý`}
      actions={
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={() => {
              setActionError(null);
              void refetch();
            }}
            loading={isFetching}
          >
            <RefreshCcw size={14} /> Tải lại
          </Button>
          <Button className="flex-1 sm:flex-none" asChild>
            <Link href="/dashboard/farmer/products/new">
              <Plus size={16} /> Đăng sản phẩm mới
            </Link>
          </Button>
        </div>
      }
    >
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-error">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mb-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() => setStatusFilter(status.value)}
              className={cn(
                "h-9 rounded-lg border px-3 text-sm font-semibold transition-colors",
                statusFilter === status.value
                  ? "border-primary bg-primary text-white"
                  : "border-hairline bg-white text-muted hover:text-ink hover:bg-surface-soft",
              )}
            >
              {status.label}
              <span className="ml-2 text-xs opacity-80">
                {statusCounts[status.value] ?? 0}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-hairline bg-white px-3 sm:min-w-[220px] lg:w-72">
            <Search size={15} className="text-muted shrink-0" />
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-soft"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <Button variant="secondary" size="sm" disabled className="w-full sm:w-auto">
            <Filter size={14} /> Lọc
          </Button>
          <Button variant="secondary" size="sm" disabled className="w-full sm:w-auto">
            <ArrowUpDown size={14} /> Sắp xếp
          </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-hairline card-shadow overflow-hidden">
        <div className="hidden lg:grid grid-cols-[minmax(260px,1fr)_120px_120px_120px_120px_180px] gap-4 px-5 py-3 bg-surface-soft border-b border-hairline text-xs font-semibold text-muted uppercase tracking-wide">
          <span>Sản phẩm</span>
          <span>Giá</span>
          <span>Tồn kho</span>
          <span>Canh tác</span>
          <span>Trạng thái</span>
          <span className="text-right">Thao tác</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-muted">Đang tải sản phẩm...</div>
        ) : filteredProducts.length > 0 ? (
          <div className="divide-y divide-hairline-soft">
            {filteredProducts.map((product) => {
              const statusLabel =
                PRODUCT_STATUS_LABELS[product.status] ?? product.status;
              const statusStyle =
                STATUS_STYLES[product.status] ?? STATUS_STYLES.draft;
              const unitLabel = UNIT_LABELS[product.unit] ?? product.unit;
              const nextStatus = getNextStatus(product);
              const action = nextStatus ? ACTION_COPY[nextStatus] : null;
              const ActionIcon = action?.icon;
              const actionDisabled =
                nextStatus === "active" && product.availableQuantity <= 0;
              const isActing = actionId === product.id;

              return (
                <div
                  key={product.id}
                  className="grid grid-cols-1 gap-3 px-4 py-4 transition-colors hover:bg-surface-soft sm:px-5 lg:grid-cols-[minmax(260px,1fr)_120px_120px_120px_120px_180px] lg:gap-4 lg:items-center"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-soft shrink-0">
                      <Image
                        src={getPrimaryImage(product)}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">
                        {product.name}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                        <span className="inline-flex items-center gap-1">
                          <Eye size={12} />
                          {product.viewCount.toLocaleString("vi-VN")} lượt xem
                        </span>
                        {product.category?.name && <span>{product.category.name}</span>}
                        <span>{getCertificationSummary(product)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-primary">
                      {product.pricePerUnit.toLocaleString("vi-VN")}đ
                    </p>
                    <p className="text-xs text-muted">/{unitLabel}</p>
                  </div>

                  <div>
                    <p
                      className={cn(
                        "text-sm font-medium",
                        product.availableQuantity === 0 ? "text-error" : "text-ink",
                      )}
                    >
                      {product.availableQuantity.toLocaleString("vi-VN")} {unitLabel}
                    </p>
                    {product.minOrderQuantity && (
                      <p className="text-xs text-muted">
                        Min: {product.minOrderQuantity} {unitLabel}
                      </p>
                    )}
                  </div>

                  <div>
                    {product.farmingType ? (
                      <FarmingBadge type={product.farmingType as FarmingType} />
                    ) : (
                      <span className="text-xs text-muted">Chưa chọn</span>
                    )}
                  </div>

                  <div>
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold",
                        statusStyle,
                      )}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-start gap-1 lg:justify-end">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/products/${product.id}`} target="_blank" title="Xem trang public">
                        <ExternalLink size={14} />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" disabled title="Chỉnh sửa sản phẩm">
                      <Pencil size={14} />
                    </Button>
                    {action && ActionIcon && (
                      <Button
                        variant={action.variant}
                        size="sm"
                        className="min-w-[132px] flex-1 sm:flex-none"
                        loading={isActing}
                        disabled={actionDisabled}
                        title={
                          actionDisabled
                            ? "Cần cập nhật tồn kho lớn hơn 0 trước khi mở bán"
                            : undefined
                        }
                        onClick={() => nextStatus && updateStatus(product, nextStatus)}
                      >
                        <ActionIcon size={14} /> {action.label}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-green flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-primary" />
            </div>
            <p className="text-sm font-semibold text-ink mb-1">
              {searchQuery || statusFilter !== "all"
                ? "Không tìm thấy sản phẩm"
                : "Chưa có sản phẩm nào"}
            </p>
            <p className="text-sm text-muted mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Thử đổi bộ lọc hoặc từ khóa tìm kiếm"
                : "Đăng sản phẩm đầu tiên để bắt đầu bán hàng"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Button asChild>
                <Link href="/dashboard/farmer/products/new">
                  <Plus size={16} /> Đăng sản phẩm mới
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
