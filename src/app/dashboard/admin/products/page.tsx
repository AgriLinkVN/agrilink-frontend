"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { Check, X, Eye, Loader2, AlertTriangle, Info } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { format } from "date-fns";

type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  seller: { id: string; fullName: string };
  status: string;
  updatedAt: string;
};

export default function AdminPendingProductsPage() {
  const token = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [detailProduct, setDetailProduct] = useState<any>(null);

  const fetchDetail = async (productId: string) => {
    if (!token) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/v1/admin/products/${productId}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const data = await res.json();
    setDetailProduct(data?.data ?? data);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin-pending-products", page],
    queryFn: () =>
      api.get<{ data: Product[]; total: number; page: number; limit: number }>(
        `/admin/products/pending?page=${page}&limit=20`,
        token
      ),
    enabled: !!token,
  });

  // Listen to WebSocket for real-time updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onNewNotif = () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending-products"] });
    };

    socket.on("new_notification", onNewNotif);
    return () => {
      socket.off("new_notification", onNewNotif);
    };
  }, [queryClient]);

  const updateStatusMutation = useMutation({
    mutationFn: (variables: { id: string; status: "active" | "rejected"; reason?: string }) =>
      api.patch(
        `/admin/products/${variables.id}/status`,
        { status: variables.status, rejectionReason: variables.reason },
        token
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending-products"] });
      setIsRejectModalOpen(false);
      setRejectReason("");
      setSelectedProduct(null);
    },
  });

  const handleApprove = (product: Product) => {
    if (confirm(`Bạn có chắc chắn muốn DUYỆT sản phẩm "${product.name}"?`)) {
      updateStatusMutation.mutate({ id: product.id, status: "active" });
    }
  };

  const handleRejectClick = (product: Product) => {
    setSelectedProduct(product);
    setIsRejectModalOpen(true);
  };

  const submitReject = () => {
    if (!selectedProduct) return;
    if (!rejectReason.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }
    updateStatusMutation.mutate({
      id: selectedProduct.id,
      status: "rejected",
      reason: rejectReason,
    });
  };

  return (
    <DashboardLayout
      role="admin"
      userName="Admin AgriLink"
      pageTitle="Duyệt sản phẩm"
      pageDescription="Quản lý danh sách sản phẩm chờ kiểm duyệt từ người bán"
    >
      <div className="bg-white rounded-xl border border-hairline card-shadow overflow-hidden">
        <div className="p-5 border-b border-hairline flex items-center justify-between">
          <h2 className="font-semibold text-ink">Danh sách chờ duyệt ({data?.total || 0})</h2>
        </div>

        {isLoading ? (
          <div className="p-10 flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="p-10 text-center text-muted flex flex-col items-center">
            <Check className="w-12 h-12 text-surface-green mb-3" />
            <p>Không có sản phẩm nào đang chờ duyệt.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-soft text-muted font-medium border-b border-hairline">
                <tr>
                  <th className="px-5 py-3">Sản phẩm</th>
                  <th className="px-5 py-3">Người bán</th>
                  <th className="px-5 py-3">Giá</th>
                  <th className="px-5 py-3">Ngày gửi</th>
                  <th className="px-5 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline-soft text-ink">
                {data?.data.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-soft transition-colors">
                    <td className="px-5 py-4 font-semibold">{p.name}</td>
                    <td className="px-5 py-4">{p.seller?.fullName || "N/A"}</td>
                    <td className="px-5 py-4 font-bold text-primary">
                      {Number(p.price).toLocaleString("vi-VN")}đ/{p.unit}
                    </td>
                    <td className="px-5 py-4 text-muted">
                      {format(new Date(p.updatedAt), "dd/MM/yyyy HH:mm")}
                    </td>
                    <td className="px-5 py-4 flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="primary"
                        className="h-8 gap-1"
                        onClick={() => handleApprove(p)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <Check size={14} /> Duyệt
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 gap-1 bg-[#FEE2E2] text-error hover:bg-error hover:text-white border-0"
                        onClick={() => handleRejectClick(p)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <X size={14} /> Từ chối
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 px-2"
                        onClick={() => fetchDetail(p.id)}
                      >
                        <Eye size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <Dialog.Root open={!!detailProduct} onOpenChange={() => setDetailProduct(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-xl sm:rounded-xl max-h-[85vh] overflow-y-auto">
            {detailProduct && (
              <>
                <Dialog.Title className="text-lg font-semibold">{detailProduct.name}</Dialog.Title>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted">Trạng thái</p>
                    <p className="font-semibold">{detailProduct.status}</p>
                  </div>
                  <div>
                    <p className="text-muted">Giá</p>
                    <p className="font-semibold text-primary">{Number(detailProduct.pricePerUnit ?? detailProduct.price).toLocaleString("vi-VN")}đ/{detailProduct.unit}</p>
                  </div>
                  <div>
                    <p className="text-muted">Người bán</p>
                    <p className="font-semibold">{detailProduct.seller?.fullName ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted">Số lượng</p>
                    <p className="font-semibold">{detailProduct.availableQuantity} {detailProduct.unit}</p>
                  </div>
                  {detailProduct.variety && (
                    <div>
                      <p className="text-muted">Giống</p>
                      <p className="font-semibold">{detailProduct.variety}</p>
                    </div>
                  )}
                  {detailProduct.farmingType && (
                    <div>
                      <p className="text-muted">Phương thức canh tác</p>
                      <p className="font-semibold">{detailProduct.farmingType}</p>
                    </div>
                  )}
                </div>
                {detailProduct.description && (
                  <div>
                    <p className="text-muted text-sm">Mô tả</p>
                    <p className="text-sm mt-1">{detailProduct.description}</p>
                  </div>
                )}
                {detailProduct.rejectionReason && (
                  <div className="p-3 bg-[#FEE2E2] rounded-lg">
                    <p className="text-sm font-semibold text-error">Lý do từ chối</p>
                    <p className="text-sm">{detailProduct.rejectionReason}</p>
                  </div>
                )}
                {detailProduct.images?.length > 0 && (
                  <div>
                    <p className="text-sm text-muted mb-2">Hình ảnh</p>
                    <div className="grid grid-cols-3 gap-2">
                      {detailProduct.images.map((img: any) => (
                        <img key={img.id} src={img.imageUrl} alt="" className="rounded-lg w-full h-32 object-cover border" />
                      ))}
                    </div>
                  </div>
                )}
                {detailProduct.certifications?.length > 0 && (
                  <div>
                    <p className="text-sm text-muted mb-2">Chứng nhận</p>
                    {detailProduct.certifications.map((cert: any) => (
                      <div key={cert.id} className="text-xs text-muted flex gap-2 items-center">
                        <span className="font-semibold">{cert.certType}</span>
                        {cert.certNumber && <span>— {cert.certNumber}</span>}
                        {cert.isVerified ? <Check size={12} className="text-primary"/> : <X size={12} className="text-error"/>}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Reject Modal using Radix Dialog */}
      <Dialog.Root open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-xl">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-error">
                <AlertTriangle size={20} />
                <Dialog.Title className="text-lg font-semibold">
                  Từ chối sản phẩm
                </Dialog.Title>
              </div>
              <Dialog.Description className="text-sm text-muted">
                Sản phẩm "{selectedProduct?.name}" sẽ bị trả về trạng thái từ chối. Vui lòng nhập lý do để người bán có thể khắc phục.
              </Dialog.Description>
            </div>
            
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="reason" className="text-sm font-semibold text-ink">
                  Lý do từ chối <span className="text-error">*</span>
                </label>
                <textarea
                  id="reason"
                  rows={4}
                  className="w-full p-3 rounded-lg border border-hairline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none text-sm text-ink"
                  placeholder="Ví dụ: Hình ảnh sản phẩm không rõ ràng, mô tả thiếu thông tin..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
              <div className="flex bg-surface-soft p-3 rounded-lg gap-3">
                <Info className="w-5 h-5 text-muted shrink-0" />
                <p className="text-xs text-muted">Lý do này sẽ được gửi trực tiếp qua thông báo hệ thống cho người bán.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button 
                variant="secondary" 
                onClick={() => setIsRejectModalOpen(false)}
                disabled={updateStatusMutation.isPending}
              >
                Hủy bỏ
              </Button>
              <Button 
                variant="destructive"
                className="bg-error text-white hover:bg-error/90"
                onClick={submitReject}
                disabled={updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Xác nhận từ chối
              </Button>
            </div>
            <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Đóng</span>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </DashboardLayout>
  );
}
