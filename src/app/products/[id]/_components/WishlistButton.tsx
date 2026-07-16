"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface Props {
  productId: string;
  initialActive?: boolean;
}

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
const BASE = `${BACKEND}/api/v1`;

export function WishlistButton({ productId, initialActive = false }: Props) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [active, setActive] = useState(initialActive);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggle = () => {
    setError(null);
    const next = !active;
    startTransition(async () => {
      try {
        if (!accessToken) {
          setError("Vui lòng đăng nhập để lưu sản phẩm");
          return;
        }
        const res = await fetch(`${BASE}/wishlist/${encodeURIComponent(productId)}`, {
          method: next ? "POST" : "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setActive(next);
      } catch {
        setError("Không thể cập nhật, vui lòng thử lại");
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={toggle}
        disabled={pending}
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
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
