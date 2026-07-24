"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Award, Check, ExternalLink, FileText, RefreshCcw, X } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api, getStoredFileDownloadUrl } from "@/lib/api";
import { CERT_TYPE_LABELS } from "@/lib/products-api";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

interface PendingCertification {
  id: string;
  productId: string;
  certType: string;
  certNumber: string | null;
  issuedBy: string | null;
  issuedDate: string | null;
  expiryDate: string | null;
  storedFileId: string | null;
  status: "pending" | "verified" | "rejected";
  rejectionReason: string | null;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    status: string;
    sellerId: string;
  };
}

const CERT_VARIANT: Record<string, "organic" | "vietgap" | "globalgap" | "default" | "outline"> = {
  organic: "organic",
  vietgap: "vietgap",
  globalgap: "globalgap",
  ocop: "default",
  other: "outline",
};

function formatDate(date: string | null) {
  if (!date) return "Chưa có";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("vi-VN");
}

export default function StateCertificationsPage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [actionId, setActionId] = useState<string | null>(null);
  const [documentActionId, setDocumentActionId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const certificationsQuery = useQuery({
    queryKey: ["state", "certifications", "pending"],
    queryFn: () =>
      api.get<PendingCertification[]>(
        "/products/certifications/pending",
        accessToken,
      ),
    enabled: !!accessToken,
    staleTime: 30_000,
  });

  const verifyMutation = useMutation({
    mutationFn: async ({
      certId,
      status,
      rejectionReason,
    }: {
      certId: string;
      status: "verified" | "rejected";
      rejectionReason?: string;
    }) => {
      if (!accessToken) throw new Error("Vui lòng đăng nhập để duyệt chứng nhận.");
      await api.patch(
        `/products/certifications/${certId}/verify`,
        {
          status,
          rejectionReason,
        },
        accessToken,
      );
      return { certId, status };
    },
    onMutate: ({ certId }) => {
      setActionId(certId);
      setActionError(null);
      setNotice(null);
    },
    onSuccess: ({ certId, status }) => {
      queryClient.setQueryData<PendingCertification[]>(
        ["state", "certifications", "pending"],
        (current) => (current ?? []).filter((item) => item.id !== certId),
      );
      setReasons((prev) => {
        const next = { ...prev };
        delete next[certId];
        return next;
      });
      setNotice(
        status === "verified"
          ? "Đã xác thực chứng nhận sản phẩm."
          : "Đã từ chối chứng nhận và lưu lý do xử lý.",
      );
    },
    onError: (err) => {
      setActionError(err instanceof Error ? err.message : "Không cập nhật được chứng nhận");
    },
    onSettled: () => setActionId(null),
  });

  const items = certificationsQuery.data ?? [];
  const loading = certificationsQuery.isPending && !!accessToken;
  const error =
    actionError ??
    (!accessToken ? "Vui lòng đăng nhập bằng tài khoản admin hoặc cơ quan quản lý." : null) ??
    (certificationsQuery.error instanceof Error
      ? certificationsQuery.error.message
      : null);

  const verify = async (certId: string, status: "verified" | "rejected") => {
    if (!accessToken) {
      setActionError("Vui lòng đăng nhập để duyệt chứng nhận.");
      return;
    }

    const rejectionReason = reasons[certId]?.trim();
    if (status === "rejected" && !rejectionReason) {
      setActionError("Vui lòng nhập lý do từ chối chứng nhận");
      return;
    }

    verifyMutation.mutate({
      certId,
      status,
      rejectionReason: status === "rejected" ? rejectionReason : undefined,
    });
  };

  const openCertificationDocument = async (cert: PendingCertification) => {
    if (!cert.storedFileId) return;
    if (!accessToken) {
      setActionError("Vui lòng đăng nhập để mở giấy chứng nhận.");
      return;
    }

    setDocumentActionId(cert.id);
    setActionError(null);
    setNotice(null);
    try {
      const data = await getStoredFileDownloadUrl(
        cert.storedFileId,
        accessToken,
      );
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Không mở được giấy chứng nhận");
    } finally {
      setDocumentActionId(null);
    }
  };

  return (
    <DashboardLayout
      role="state_agency"
      userName={user?.full_name ?? "Cơ quan quản lý"}
      pageTitle="Duyệt chứng nhận"
      pageDescription="Kiểm tra và xác thực chứng nhận VietGAP, hữu cơ, OCOP cho sản phẩm"
      actions={
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setActionError(null);
            setNotice(null);
            void certificationsQuery.refetch();
          }}
          loading={certificationsQuery.isFetching}
        >
          <RefreshCcw size={14} /> Tải lại
        </Button>
      }
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}
      {notice && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-primary">
          {notice}
        </div>
      )}

      <div className="bg-white rounded-xl border border-hairline card-shadow overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-hairline">
          <div>
            <h2 className="font-semibold text-ink">Chứng nhận chờ duyệt</h2>
            <p className="text-xs text-muted mt-1">{items.length} hồ sơ đang cần xử lý</p>
          </div>
          <Badge variant="harvest">Pending</Badge>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-muted">Đang tải chứng nhận...</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-green flex items-center justify-center mx-auto mb-4">
              <Award size={26} className="text-primary" />
            </div>
            <p className="text-sm font-semibold text-ink">Không có chứng nhận chờ duyệt</p>
            <p className="text-sm text-muted mt-1">Danh sách sẽ cập nhật khi người bán gửi chứng nhận mới.</p>
          </div>
        ) : (
          <div className="divide-y divide-hairline-soft">
            {items.map((cert) => {
              const certLabel = CERT_TYPE_LABELS[cert.certType] ?? cert.certType.toUpperCase();
              const isActing = actionId === cert.id;
              const rejectionReason = reasons[cert.id]?.trim() ?? "";

              return (
                <div key={cert.id} className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary-ultra-light flex items-center justify-center shrink-0">
                      <Award size={20} className="text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge variant={CERT_VARIANT[cert.certType] ?? "outline"}>
                          {certLabel}
                        </Badge>
                        {cert.certNumber && (
                          <span className="font-mono text-xs text-muted bg-surface-soft px-2 py-1 rounded">
                            {cert.certNumber}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-semibold text-ink">
                        {cert.product?.name ?? "Sản phẩm không xác định"}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-xs text-muted">
                        <span>Cấp bởi: <strong className="text-ink">{cert.issuedBy ?? "Chưa có"}</strong></span>
                        <span>Ngày cấp: <strong className="text-ink">{formatDate(cert.issuedDate)}</strong></span>
                        <span>Hết hạn: <strong className="text-ink">{formatDate(cert.expiryDate)}</strong></span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {cert.storedFileId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            loading={documentActionId === cert.id}
                            onClick={() => openCertificationDocument(cert)}
                          >
                            <FileText size={14} /> Xem giấy chứng nhận <ExternalLink size={12} />
                          </Button>
                        )}
                        {cert.product?.id && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/products/${cert.product.id}`} target="_blank">
                              Xem sản phẩm <ExternalLink size={12} />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="w-full lg:w-80 flex flex-col gap-3">
                      <textarea
                        value={reasons[cert.id] ?? ""}
                        onChange={(event) =>
                          setReasons((prev) => ({ ...prev, [cert.id]: event.target.value }))
                        }
                        placeholder="Lý do từ chối nếu hồ sơ không hợp lệ"
                        className={cn(
                          "min-h-20 resize-none rounded-lg border border-hairline bg-white px-3 py-2 text-sm outline-none",
                          "focus:border-primary focus:ring-2 focus:ring-primary/10",
                        )}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          loading={isActing}
                          onClick={() => verify(cert.id, "verified")}
                        >
                          <Check size={14} /> Duyệt
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                          loading={isActing}
                          disabled={!rejectionReason}
                          onClick={() => verify(cert.id, "rejected")}
                        >
                          <X size={14} /> Từ chối
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
