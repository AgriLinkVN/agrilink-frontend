"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { FarmingBadge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import {
  Plus, Search, Package, Eye, Pencil, MoreHorizontal,
  Filter, ArrowUpDown,
} from "lucide-react";
import {
  MOCK_PRODUCTS,
  PRODUCT_STATUS_LABELS,
  UNIT_LABELS,
  getPrimaryImage,
} from "@/lib/products-api";
import type { FarmingType } from "@/types";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-[#F3F4F6] text-[#6B7280]",
  pending_approval: "bg-[#FEF9C3] text-[#854D0E]",
  active: "bg-[#D1FAE5] text-[#065F46]",
  out_of_stock: "bg-[#FEE2E2] text-[#991B1B]",
  rejected: "bg-[#FEE2E2] text-[#991B1B]",
  archived: "bg-[#F3F4F6] text-[#6B7280]",
  suspended: "bg-[#FEF3C7] text-[#92400E]",
};

export default function FarmerProductsPage() {
  const user = useAuthStore((s) => s.user);
  const [searchQuery, setSearchQuery] = useState("");

  const products = MOCK_PRODUCTS;
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      role="farmer"
      userName={user?.full_name ?? "Nông dân"}
      pageTitle="Sản phẩm của tôi"
      pageDescription={`${products.length} sản phẩm đang quản lý`}
      actions={
        <Button asChild>
          <Link href="/dashboard/farmer/products/new">
            <Plus size={16} /> Đăng sản phẩm mới
          </Link>
        </Button>
      }
    >
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 h-10 px-3 rounded-lg border border-hairline bg-white max-w-sm">
          <Search size={15} className="text-muted shrink-0" />
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-soft"
          />
        </div>
        <Button variant="secondary" size="sm">
          <Filter size={14} /> Lọc
        </Button>
        <Button variant="secondary" size="sm">
          <ArrowUpDown size={14} /> Sắp xếp
        </Button>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-xl border border-hairline card-shadow overflow-hidden">
        {/* Header */}
        <div className="hidden md:grid grid-cols-[1fr_120px_120px_100px_100px_80px] gap-4 px-5 py-3 bg-surface-soft border-b border-hairline text-xs font-semibold text-muted uppercase tracking-wide">
          <span>Sản phẩm</span>
          <span>Giá</span>
          <span>Tồn kho</span>
          <span>Canh tác</span>
          <span>Trạng thái</span>
          <span className="text-center">Thao tác</span>
        </div>

        {/* Rows */}
        {filtered.length > 0 ? (
          <div className="divide-y divide-hairline-soft">
            {filtered.map((product) => {
              const statusLabel =
                PRODUCT_STATUS_LABELS[product.status] ?? product.status;
              const statusStyle =
                STATUS_STYLES[product.status] ?? STATUS_STYLES.draft;
              const unitLabel =
                UNIT_LABELS[product.unit] ?? product.unit;

              return (
                <div
                  key={product.id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_120px_120px_100px_100px_80px] gap-3 md:gap-4 px-5 py-4 hover:bg-surface-soft transition-colors items-center"
                >
                  {/* Product info */}
                  <div className="flex items-center gap-3">
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
                      <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
                        <Eye size={12} />
                        <span>{product.viewCount.toLocaleString("vi-VN")} lượt xem</span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-sm font-bold text-primary">
                      {product.pricePerUnit.toLocaleString("vi-VN")}đ
                    </p>
                    <p className="text-xs text-muted">/{unitLabel}</p>
                  </div>

                  {/* Stock */}
                  <div>
                    <p className={cn(
                      "text-sm font-medium",
                      product.availableQuantity === 0 ? "text-error" : "text-ink"
                    )}>
                      {product.availableQuantity.toLocaleString("vi-VN")} {unitLabel}
                    </p>
                    {product.minOrderQuantity && (
                      <p className="text-xs text-muted">
                        Min: {product.minOrderQuantity} {unitLabel}
                      </p>
                    )}
                  </div>

                  {/* Farming type */}
                  <div>
                    {product.farmingType && (
                      <FarmingBadge type={product.farmingType as FarmingType} />
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold",
                      statusStyle
                    )}>
                      {statusLabel}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center gap-1">
                    <button className="w-8 h-8 rounded-lg hover:bg-surface-strong flex items-center justify-center transition-colors text-muted hover:text-ink">
                      <Pencil size={14} />
                    </button>
                    <button className="w-8 h-8 rounded-lg hover:bg-surface-strong flex items-center justify-center transition-colors text-muted hover:text-ink">
                      <MoreHorizontal size={14} />
                    </button>
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
              {searchQuery ? "Không tìm thấy sản phẩm" : "Chưa có sản phẩm nào"}
            </p>
            <p className="text-sm text-muted mb-4">
              {searchQuery
                ? "Thử tìm kiếm với từ khóa khác"
                : "Đăng sản phẩm đầu tiên để bắt đầu bán hàng"}
            </p>
            {!searchQuery && (
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
