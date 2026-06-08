"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge, FarmingBadge } from "@/components/ui/badge";
import {
  ArrowLeft, Check, Package, MapPin, Calendar, Eye,
  Award, Layers, ShoppingBag,
  FileText, Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  FARMING_TYPE_LABELS,
  UNIT_LABELS,
  CERT_TYPE_LABELS,
  FALLBACK_CATEGORIES,
} from "@/lib/products-api";
import { vietnamProvinces } from "@/lib/vietnam-provinces";
import type { ProductFormData } from "../page";
import type { FarmingType } from "@/types";

interface StepPreviewProps {
  data: ProductFormData;
  onBack: () => void;
  onGoToStep: (step: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

function InfoRow({
  icon: Icon,
  label,
  value,
  onEdit,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-hairline-soft last:border-0">
      <div className="w-8 h-8 rounded-lg bg-surface-green flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-medium text-ink mt-0.5">{value}</p>
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="text-primary hover:text-primary-active shrink-0 mt-1"
        >
          <Pencil size={14} />
        </button>
      )}
    </div>
  );
}

export function StepPreview({
  data,
  onBack,
  onGoToStep,
  onSubmit,
  isSubmitting,
}: StepPreviewProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const primaryImage = data.images.find((img) => img.isPrimary) ?? data.images[0];
  const province = vietnamProvinces.find((p) => p.code === data.provinceId);
  const category = FALLBACK_CATEGORIES.find((c) => c.id === data.categoryId);
  const farmingLabel = data.farmingType
    ? FARMING_TYPE_LABELS[data.farmingType]
    : null;
  const unitLabel = data.unit ? UNIT_LABELS[data.unit] ?? data.unit : "";

  return (
    <div>
      <h2 className="text-xl font-bold text-ink mb-1">Xem trước sản phẩm</h2>
      <p className="text-sm text-muted mb-6">
        Kiểm tra lại thông tin trước khi đăng bán. Nhấn vào biểu tượng bút chì
        để chỉnh sửa.
      </p>

      {/* Product preview card */}
      <div className="bg-white rounded-xl border border-hairline card-shadow overflow-hidden">
        {/* Image gallery */}
        <div className="relative">
          {data.images.length > 0 ? (
            <div>
              <div className="relative aspect-[16/9] bg-surface-soft">
                <Image
                  src={data.images[selectedImage]?.preview ?? primaryImage?.preview ?? ""}
                  alt={data.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {data.farmingType && (
                  <div className="absolute top-3 left-3">
                    <FarmingBadge type={data.farmingType as FarmingType} />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge variant="outline">
                    <Eye size={10} /> Xem trước
                  </Badge>
                </div>
              </div>

              {data.images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {data.images.map((img, i) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setSelectedImage(i)}
                      className={cn(
                        "w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all",
                        i === selectedImage
                          ? "border-primary ring-1 ring-primary/20"
                          : "border-hairline opacity-70 hover:opacity-100"
                      )}
                    >
                      <Image
                        src={img.preview}
                        alt=""
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-[16/9] bg-surface-soft flex items-center justify-center">
              <p className="text-muted text-sm">Chưa có ảnh</p>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-bold text-ink">{data.name || "Chưa đặt tên"}</h3>
              {category && (
                <span className="text-xs text-muted">{category.name}</span>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-primary">
                {data.price > 0
                  ? `${data.price.toLocaleString("vi-VN")}đ`
                  : "—"}
              </p>
              {unitLabel && (
                <p className="text-xs text-muted">/{unitLabel}</p>
              )}
            </div>
          </div>

          {data.description && (
            <p className="text-sm text-body-text leading-relaxed mb-4">
              {data.description}
            </p>
          )}

          <div className="border-t border-hairline pt-3">
            <InfoRow
              icon={Package}
              label="Tồn kho"
              value={
                data.availableQuantity > 0
                  ? `${data.availableQuantity.toLocaleString("vi-VN")} ${unitLabel}`
                  : "Chưa nhập"
              }
              onEdit={() => onGoToStep(1)}
            />
            {data.minOrderQuantity > 0 && (
              <InfoRow
                icon={ShoppingBag}
                label="Đặt hàng tối thiểu"
                value={`${data.minOrderQuantity.toLocaleString("vi-VN")} ${unitLabel}`}
                onEdit={() => onGoToStep(1)}
              />
            )}
            {farmingLabel && (
              <InfoRow
                icon={Layers}
                label="Phương thức canh tác"
                value={farmingLabel}
                onEdit={() => onGoToStep(1)}
              />
            )}
            {province && (
              <InfoRow
                icon={MapPin}
                label="Vùng sản xuất"
                value={province.nameVi}
                onEdit={() => onGoToStep(1)}
              />
            )}
            {data.harvestDate && (
              <InfoRow
                icon={Calendar}
                label="Ngày thu hoạch dự kiến"
                value={new Date(data.harvestDate).toLocaleDateString("vi-VN")}
                onEdit={() => onGoToStep(1)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Certifications summary */}
      {data.certifications.length > 0 && (
        <div className="mt-4 bg-white rounded-xl border border-hairline card-shadow p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award size={16} className="text-primary" />
              <h4 className="text-sm font-semibold text-ink">
                Chứng nhận ({data.certifications.length})
              </h4>
            </div>
            <button
              type="button"
              onClick={() => onGoToStep(3)}
              className="text-primary hover:text-primary-active"
            >
              <Pencil size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {data.certifications.map((cert) => (
              <div
                key={cert.id}
                className="flex items-center gap-3 p-3 bg-surface-soft rounded-lg"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-ultra-light flex items-center justify-center shrink-0">
                  <Award size={14} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink">
                    {cert.certType
                      ? CERT_TYPE_LABELS[cert.certType] ?? cert.certType
                      : "Chưa chọn loại"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    {cert.certNumber && <span>Số: {cert.certNumber}</span>}
                    {cert.issuedBy && <span>• {cert.issuedBy}</span>}
                  </div>
                </div>
                {cert.documentFile && (
                  <FileText size={14} className="text-primary shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary checklist */}
      <div className="mt-4 p-4 bg-surface-green rounded-xl border border-primary-light">
        <p className="text-sm font-semibold text-primary mb-3">
          Kiểm tra trước khi đăng
        </p>
        {[
          {
            ok: data.name.trim() !== "",
            label: "Tên sản phẩm",
            step: 1,
          },
          {
            ok: data.price > 0,
            label: "Giá bán",
            step: 1,
          },
          {
            ok: data.images.length >= 1,
            label: `Ảnh sản phẩm (${data.images.length} ảnh)`,
            step: 2,
          },
          {
            ok: data.farmingType !== "",
            label: "Phương thức canh tác",
            step: 1,
          },
          {
            ok: data.availableQuantity > 0,
            label: "Tồn kho",
            step: 1,
          },
        ].map(({ ok, label, step }) => (
          <div
            key={label}
            className="flex items-center gap-2 py-1.5"
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                ok ? "bg-primary text-white" : "bg-hairline text-muted"
              )}
            >
              <Check size={12} />
            </div>
            <span
              className={cn(
                "text-sm",
                ok ? "text-ink" : "text-muted"
              )}
            >
              {label}
            </span>
            {!ok && (
              <button
                type="button"
                onClick={() => onGoToStep(step)}
                className="text-xs text-primary hover:underline ml-auto"
              >
                Bổ sung
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-8">
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={onBack}
        >
          <ArrowLeft size={18} /> Quay lại
        </Button>
        <Button
          size="lg"
          className="flex-1"
          onClick={onSubmit}
          loading={isSubmitting}
          disabled={
            data.name.trim() === "" ||
            data.price <= 0 ||
            data.images.length === 0
          }
        >
          {isSubmitting ? (
            "Đang đăng..."
          ) : (
            <>
              Đăng sản phẩm <Check size={18} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
