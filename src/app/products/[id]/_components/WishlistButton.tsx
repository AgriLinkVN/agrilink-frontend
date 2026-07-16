"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface Props {
  productId: string;
  initialActive?: boolean;
}

export function WishlistButton({ productId, initialActive = false }: Props) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [active, setActive] = useState(initialActive);
  const [loadingState, setLoadingState] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadState = async () => {
      if (!accessToken) {
        setActive(false);
        return;
      }

      setLoadingState(true);
      try {
        const ids = await api.get<string[]>("/wishlist/ids", accessToken);
        if (!cancelled) setActive(ids.includes(productId));
      } catch {
        if (!cancelled) setActive(initialActive);
      } finally {
        if (!cancelled) setLoadingState(false);
      }
    };

    void loadState();

    return () => {
      cancelled = true;
    };
  }, [accessToken, initialActive, productId]);

  const toggle = () => {
    setError(null);
    setShowLoginPrompt(false);

    if (!accessToken) {
      setShowLoginPrompt(true);
      return;
    }

    const next = !active;
    setActive(next);

    startTransition(async () => {
      try {
        if (next) await api.post(`/wishlist/${productId}`, undefined, accessToken);
        else await api.delete(`/wishlist/${productId}`, accessToken);
      } catch {
        setActive(!next);
        setError("Không thể cập nhật, vui lòng thử lại");
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={toggle}
        disabled={pending || loadingState}
        aria-label={active ? "Bỏ khỏi yêu thích" : "Lưu vào yêu thích"}
        aria-pressed={active}
        className={`p-2.5 rounded-full border transition ${
          active
            ? "border-rose-300 bg-rose-50 text-rose-500"
            : "border-hairline bg-white hover:bg-surface-soft text-muted"
        } ${pending ? "opacity-60 cursor-not-allowed" : ""}`}
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
