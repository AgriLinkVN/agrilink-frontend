"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface Props {
  productId: string;
  initialActive?: boolean;
}

export function WishlistButton({ productId, initialActive = false }: Props) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();
  const [optimisticActive, setOptimisticActive] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const wishlistIdsQueryKey = useMemo(
    () => ["wishlist", "ids", accessToken] as const,
    [accessToken],
  );
  const { data: wishlistIds, isLoading } = useQuery({
    queryKey: wishlistIdsQueryKey,
    queryFn: () => api.get<string[]>("/wishlist/ids", accessToken),
    enabled: !!accessToken,
    staleTime: 30_000,
  });
  const serverActive = accessToken
    ? wishlistIds?.includes(productId) ?? initialActive
    : false;
  const active = optimisticActive ?? serverActive;

  const toggleMutation = useMutation({
    mutationFn: async (next: boolean) => {
      if (!accessToken) throw new Error("Bạn cần đăng nhập để lưu sản phẩm.");
      if (next) await api.post(`/wishlist/${productId}`, undefined, accessToken);
      else await api.delete(`/wishlist/${productId}`, accessToken);
      return next;
    },
    onMutate: (next) => {
      setError(null);
      setOptimisticActive(next);
    },
    onSuccess: (next) => {
      queryClient.setQueryData<string[]>(wishlistIdsQueryKey, (current) => {
        const ids = new Set(current ?? []);
        if (next) ids.add(productId);
        else ids.delete(productId);
        return Array.from(ids);
      });
      setOptimisticActive(null);
    },
    onError: () => {
      setOptimisticActive(null);
      setError("Không thể cập nhật, vui lòng thử lại");
    },
  });

  const toggle = () => {
    setError(null);
    setShowLoginPrompt(false);

    if (!accessToken) {
      setShowLoginPrompt(true);
      return;
    }

    toggleMutation.mutate(!active);
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={toggle}
        disabled={toggleMutation.isPending || (!!accessToken && isLoading)}
        aria-label={active ? "Bỏ khỏi yêu thích" : "Lưu vào yêu thích"}
        aria-pressed={active}
        className={`p-2.5 rounded-full border transition ${
          active
            ? "border-rose-300 bg-rose-50 text-rose-500"
            : "border-hairline bg-white hover:bg-surface-soft text-muted"
        } ${toggleMutation.isPending ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <Heart
          size={18}
          className={active ? "fill-rose-500" : ""}
        />
      </button>
      {showLoginPrompt && (
        <p className="max-w-36 text-right text-xs text-rose-500">
          <Link
            href={`/auth/login?redirect=/products/${productId}`}
            className="font-semibold underline"
          >
            Đăng nhập
          </Link>{" "}
          để lưu sản phẩm
        </p>
      )}
      {error && <p className="max-w-36 text-right text-xs text-rose-500">{error}</p>}
    </div>
  );
}
