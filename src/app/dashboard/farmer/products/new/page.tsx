"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Check, FileText, Image as ImageIcon, Award, Eye,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { api, uploadPrivateDocument, uploadImageToStorage } from "@/lib/api";

import { StepBasicInfo } from "./components/step-basic-info";
import { StepUploadImages } from "./components/step-upload-images";
import { StepCertifications } from "./components/step-certifications";
import { StepPreview } from "./components/step-preview";
import { SuccessScreen } from "./components/success-screen";

import { ProductFormData, INITIAL_DATA } from "./types";

const STEPS = [
  { id: 1, label: "Thông tin", icon: FileText },
  { id: 2, label: "Hình ảnh", icon: ImageIcon },
  { id: 3, label: "Chứng nhận", icon: Award },
  { id: 4, label: "Xem trước", icon: Eye },
];

interface CreatedProduct {
  id: string;
}

export default function NewProductPage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateFormData = useCallback(
    (updates: Partial<ProductFormData>) => {
      setFormData((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const goToStep = (s: number) => {
    if (s >= 1 && s <= 4) setStep(s);
  };

  const handleAddAnother = () => {
    setFormData(INITIAL_DATA);
    setStep(1);
    setIsSuccess(false);
    setSubmitError(null);
  };

  const handleSubmit = async () => {
    if (!accessToken) {
      setSubmitError("Vui lòng đăng nhập để đăng sản phẩm.");
      return;
    }
    const missingDocument = formData.certifications.some(
      (certification) => certification.certType && !certification.documentFile,
    );
    if (missingDocument) {
      setSubmitError(
        "Mỗi chứng nhận cần có một tài liệu để cơ quan quản lý duyệt.",
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const uploadedImages = await Promise.all(
        formData.images.map(async (img, index) => {
          const url = await uploadImageToStorage(img.file, "product", accessToken);
          return {
            imageUrl: url,
            isPrimary: img.isPrimary,
            sortOrder: index,
          };
        })
      );

      const certifications = await Promise.all(
        formData.certifications
          .filter((c) => c.certType)
          .map(async (cert) => {
            if (!cert.documentFile) {
              throw new Error("Thiếu tài liệu chứng nhận.");
            }
            const storedFileId = await uploadPrivateDocument(
              cert.documentFile,
              "CERTIFICATION",
              accessToken,
            );
            return {
              certType: cert.certType,
              certNumber: cert.certNumber || null,
              issuedBy: cert.issuedBy || null,
              issuedDate: cert.issuedDate || null,
              expiryDate: cert.expiryDate || null,
              storedFileId,
            };
          })
      );

      const payload = {
        name: formData.name,
        description: formData.description || null,
        categoryId: formData.categoryId || null,
        farmingType: formData.farmingType || null,
        pricePerUnit: formData.price,
        unit: formData.unit,
        availableQuantity: formData.availableQuantity,
        minOrderQuantity: formData.minOrderQuantity || null,
        provinceId: formData.provinceId || null,
        harvestDate: formData.harvestDate || null,
      };

      const created = await api.post<CreatedProduct>("/products", payload, accessToken);

      await Promise.all([
        ...uploadedImages.map((image) =>
          api.post(`/products/${created.id}/images`, image, accessToken)
        ),
        ...certifications.map((certification) =>
          api.post(`/products/${created.id}/certifications`, certification, accessToken)
        ),
      ]);

      setIsSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      role="farmer"
      userName={user?.full_name ?? "Nông dân"}
      pageTitle="Đăng sản phẩm mới"
      pageDescription="Tạo tin đăng bán nông sản trên AgriLink"
      actions={
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/farmer/products">
            <ArrowLeft size={14} /> Quay lại danh sách
          </Link>
        </Button>
      }
    >
      <div className="mx-auto max-w-2xl">
        {isSuccess ? (
          <SuccessScreen data={formData} onAddAnother={handleAddAnother} />
        ) : (
          <>
            {/* Stepper */}
            <div className="-mx-2 mb-8 overflow-x-auto px-2 pb-2">
              <div className="flex min-w-[460px] items-center gap-1 sm:min-w-0">
                {STEPS.map((s, index) => {
                  const Icon = s.icon;
                  const isCompleted = s.id < step;
                  const isCurrent = s.id === step;

                  return (
                    <div key={s.id} className="flex flex-1 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (isCompleted) goToStep(s.id);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-all",
                          isCompleted && "cursor-pointer hover:bg-surface-green",
                          isCurrent && "bg-primary-ultra-light",
                          !isCompleted && !isCurrent && "opacity-50"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all",
                            isCompleted
                              ? "bg-primary text-white"
                              : isCurrent
                                ? "bg-primary text-white ring-4 ring-primary-ultra-light"
                                : "bg-surface-strong text-muted"
                          )}
                        >
                          {isCompleted ? <Check size={14} /> : <Icon size={14} />}
                        </div>
                        <span
                          className={cn(
                            "text-xs font-medium",
                            isCurrent
                              ? "text-primary"
                              : isCompleted
                                ? "text-ink"
                                : "text-muted"
                          )}
                        >
                          {s.label}
                        </span>
                      </button>
                      {index < STEPS.length - 1 && (
                        <div
                          className={cn(
                            "h-0.5 w-4 shrink-0",
                            isCompleted ? "bg-primary" : "bg-hairline"
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit error */}
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
                <p className="text-sm text-error">{submitError}</p>
              </div>
            )}

            {/* Steps */}
            {step === 1 && (
              <StepBasicInfo
                data={formData}
                onChange={updateFormData}
                onNext={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <StepUploadImages
                data={formData}
                onChange={updateFormData}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <StepCertifications
                data={formData}
                onChange={updateFormData}
                onNext={() => setStep(4)}
                onBack={() => setStep(2)}
              />
            )}
            {step === 4 && (
              <StepPreview
                data={formData}
                onBack={() => setStep(3)}
                onGoToStep={goToStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
