"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Upload, X, Star, ArrowRight, ArrowLeft, ImagePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { ProductFormData, ImageFile } from "../page";

interface StepUploadImagesProps {
  data: ProductFormData;
  onChange: (data: Partial<ProductFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const MAX_IMAGES = 8;
const MAX_SIZE_MB = 5;

export function StepUploadImages({
  data,
  onChange,
  onNext,
  onBack,
}: StepUploadImagesProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      setError(null);
      const remaining = MAX_IMAGES - data.images.length;
      if (remaining <= 0) {
        setError(`Tối đa ${MAX_IMAGES} ảnh`);
        return;
      }

      const newImages: ImageFile[] = [];
      const fileArray = Array.from(files).slice(0, remaining);

      for (const file of fileArray) {
        if (!file.type.startsWith("image/")) {
          setError("Chỉ chấp nhận file ảnh (JPG, PNG, WebP)");
          continue;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          setError(`Dung lượng tối đa ${MAX_SIZE_MB}MB mỗi ảnh`);
          continue;
        }
        newImages.push({
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
          isPrimary: data.images.length === 0 && newImages.length === 0,
        });
      }

      if (newImages.length > 0) {
        onChange({ images: [...data.images, ...newImages] });
      }
    },
    [data.images, onChange]
  );

  const removeImage = (id: string) => {
    const updated = data.images.filter((img) => img.id !== id);
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    onChange({ images: updated });
  };

  const setPrimary = (id: string) => {
    const updated = data.images.map((img) => ({
      ...img,
      isPrimary: img.id === id,
    }));
    onChange({ images: updated });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const canProceed = data.images.length >= 1;

  return (
    <div>
      <h2 className="text-xl font-bold text-ink mb-1">Hình ảnh sản phẩm</h2>
      <p className="text-sm text-muted mb-6">
        Thêm ảnh chất lượng cao để thu hút người mua. Tối đa {MAX_IMAGES} ảnh,
        mỗi ảnh không quá {MAX_SIZE_MB}MB.
      </p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
          dragOver
            ? "border-primary bg-surface-green"
            : "border-hairline bg-surface-soft hover:border-primary-light hover:bg-surface-green",
          data.images.length >= MAX_IMAGES && "opacity-50 pointer-events-none"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="w-14 h-14 rounded-2xl bg-primary-ultra-light flex items-center justify-center mx-auto mb-4">
          <ImagePlus size={28} className="text-primary" />
        </div>
        <p className="text-sm font-semibold text-ink mb-1">
          Kéo thả ảnh vào đây hoặc nhấn để chọn
        </p>
        <p className="text-xs text-muted">
          JPG, PNG hoặc WebP. Tối đa {MAX_SIZE_MB}MB mỗi ảnh.
        </p>
        <p className="text-xs text-muted mt-1">
          {data.images.length}/{MAX_IMAGES} ảnh đã tải lên
        </p>
      </div>

      {error && (
        <p className="text-sm text-error mt-2">{error}</p>
      )}

      {/* Image grid */}
      {data.images.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-ink">
              Ảnh đã tải ({data.images.length}/{MAX_IMAGES})
            </p>
            <p className="text-xs text-muted">
              Nhấn ngôi sao để chọn ảnh đại diện
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {data.images.map((img) => (
              <div
                key={img.id}
                className={cn(
                  "relative group rounded-xl overflow-hidden border-2 aspect-[4/3] bg-surface-soft",
                  img.isPrimary
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-hairline"
                )}
              >
                <Image
                  src={img.preview}
                  alt="Ảnh sản phẩm"
                  fill
                  className="object-cover"
                  unoptimized
                />

                {/* Primary badge */}
                {img.isPrimary && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> Ảnh chính
                  </div>
                )}

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {!img.isPrimary && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPrimary(img.id);
                      }}
                      className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                      title="Đặt làm ảnh chính"
                    >
                      <Star size={14} className="text-primary" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(img.id);
                    }}
                    className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                    title="Xóa ảnh"
                  >
                    <X size={14} className="text-error" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add more button */}
            {data.images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="aspect-[4/3] rounded-xl border-2 border-dashed border-hairline bg-surface-soft hover:border-primary-light hover:bg-surface-green transition-all flex flex-col items-center justify-center gap-2"
              >
                <Upload size={20} className="text-muted" />
                <span className="text-xs text-muted">Thêm ảnh</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-surface-green rounded-xl border border-primary-light">
        <p className="text-sm font-semibold text-primary mb-2">
          Mẹo chụp ảnh sản phẩm tốt
        </p>
        <ul className="text-xs text-muted space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            Chụp dưới ánh sáng tự nhiên, tránh bóng đổ
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            Chụp nhiều góc: tổng thể, cận cảnh, đóng gói
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            Nền trắng hoặc nền sạch giúp sản phẩm nổi bật
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            Ảnh rõ nét, kích thước tối thiểu 600x600px
          </li>
        </ul>
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
          disabled={!canProceed}
          onClick={onNext}
        >
          Tiếp theo: Chứng nhận <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}
