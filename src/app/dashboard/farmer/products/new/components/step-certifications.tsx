"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Award, ArrowRight, ArrowLeft, Plus, X, FileText,
  Calendar, Building2, ShieldCheck, Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CERT_TYPE_LABELS } from "@/lib/products-api";
import type { ProductFormData, CertificationEntry } from "../types";

interface StepCertificationsProps {
  data: ProductFormData;
  onChange: (data: Partial<ProductFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const CERT_OPTIONS = Object.entries(CERT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

function emptyCert(): CertificationEntry {
  return {
    id: crypto.randomUUID(),
    certType: "",
    certNumber: "",
    issuedBy: "",
    issuedDate: "",
    expiryDate: "",
    documentFile: null,
  };
}

export function StepCertifications({
  data,
  onChange,
  onNext,
  onBack,
}: StepCertificationsProps) {
  const addCert = () => {
    onChange({ certifications: [...data.certifications, emptyCert()] });
  };

  const updateCert = (id: string, updates: Partial<CertificationEntry>) => {
    onChange({
      certifications: data.certifications.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    });
  };

  const removeCert = (id: string) => {
    onChange({
      certifications: data.certifications.filter((c) => c.id !== id),
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-ink mb-1">Chứng nhận chất lượng</h2>
      <p className="text-sm text-muted mb-6">
        Thêm các chứng nhận để tăng độ tin cậy cho sản phẩm. Bước này không bắt
        buộc.
      </p>

      {/* Info banner */}
      <div className="p-4 bg-surface-green rounded-xl border border-primary-light mb-6">
        <div className="flex items-start gap-3">
          <ShieldCheck size={20} className="text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-primary">
              Sản phẩm có chứng nhận được ưu tiên hiển thị
            </p>
            <p className="text-xs text-muted mt-1">
              Người mua có xu hướng chọn sản phẩm đã được chứng nhận VietGAP,
              GlobalGAP hoặc Hữu cơ. Sản phẩm có chứng nhận sẽ được gắn huy
              hiệu và ưu tiên trong kết quả tìm kiếm.
            </p>
          </div>
        </div>
      </div>

      {/* Certifications list */}
      {data.certifications.length > 0 && (
        <div className="flex flex-col gap-4 mb-6">
          {data.certifications.map((cert, index) => (
            <div
              key={cert.id}
              className="bg-white rounded-xl border border-hairline p-5 relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-ultra-light flex items-center justify-center">
                    <Award size={16} className="text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-ink">
                    Chứng nhận #{index + 1}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeCert(cert.id)}
                  className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors"
                >
                  <X size={16} className="text-error" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {/* Loại chứng nhận */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">
                    Loại chứng nhận *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CERT_OPTIONS.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          updateCert(cert.id, { certType: value })
                        }
                        className={cn(
                          "px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                          cert.certType === value
                            ? "border-primary bg-surface-green text-primary"
                            : "border-hairline bg-white text-muted hover:border-primary-light"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Số chứng nhận & Đơn vị cấp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Số chứng nhận"
                    placeholder="VD: VG-2025-001234"
                    leftIcon={<FileText size={16} />}
                    value={cert.certNumber}
                    onChange={(e) =>
                      updateCert(cert.id, { certNumber: e.target.value })
                    }
                  />
                  <Input
                    label="Đơn vị cấp"
                    placeholder="VD: Chi cục QLCL Nông sản"
                    leftIcon={<Building2 size={16} />}
                    value={cert.issuedBy}
                    onChange={(e) =>
                      updateCert(cert.id, { issuedBy: e.target.value })
                    }
                  />
                </div>

                {/* Ngày cấp & Ngày hết hạn */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Ngày cấp"
                    type="date"
                    leftIcon={<Calendar size={16} />}
                    value={cert.issuedDate}
                    onChange={(e) =>
                      updateCert(cert.id, { issuedDate: e.target.value })
                    }
                  />
                  <Input
                    label="Ngày hết hạn"
                    type="date"
                    leftIcon={<Calendar size={16} />}
                    value={cert.expiryDate}
                    onChange={(e) =>
                      updateCert(cert.id, { expiryDate: e.target.value })
                    }
                  />
                </div>

                {/* Upload giấy chứng nhận */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">
                    File giấy chứng nhận (tùy chọn)
                  </label>
                  {cert.documentFile ? (
                    <div className="flex items-center gap-3 p-3 bg-surface-soft rounded-lg border border-hairline">
                      <FileText size={16} className="text-primary shrink-0" />
                      <span className="text-sm text-ink truncate flex-1">
                        {cert.documentFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCert(cert.id, { documentFile: null })
                        }
                        className="text-muted hover:text-error shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-3 p-3 bg-surface-soft rounded-lg border border-dashed border-hairline cursor-pointer hover:border-primary-light hover:bg-surface-green transition-all">
                      <Upload size={16} className="text-muted" />
                      <span className="text-sm text-muted">
                        Tải lên ảnh hoặc PDF giấy chứng nhận
                      </span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) updateCert(cert.id, { documentFile: file });
                          e.target.value = "";
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add certification button */}
      <button
        type="button"
        onClick={addCert}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-hairline bg-surface-soft hover:border-primary-light hover:bg-surface-green text-sm font-medium text-muted hover:text-primary transition-all"
      >
        <Plus size={16} />
        Thêm chứng nhận
      </button>

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
        <Button size="lg" className="flex-1" onClick={onNext}>
          Tiếp theo: Xem trước <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}
