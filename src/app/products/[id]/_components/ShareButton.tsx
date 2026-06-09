"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

interface Props {
  productName: string;
}

export function ShareButton({ productName }: Props) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const shareToZalo = () => {
    const zaloShare = `https://zalo.me/share?url=${encodeURIComponent(url)}`;
    window.open(zaloShare, "_blank", "noopener,noreferrer");
  };

  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: productName, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    setOpen((o) => !o);
  };

  return (
    <div className="relative">
      <button
        onClick={nativeShare}
        aria-label="Chia sẻ sản phẩm"
        className="p-2.5 rounded-full border border-hairline bg-white hover:bg-surface-soft text-muted transition"
      >
        <Share2 size={18} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-hairline bg-white shadow-lg z-20 overflow-hidden">
          <button
            onClick={copyLink}
            className="flex items-center gap-2 w-full px-3 py-2.5 text-sm hover:bg-surface-soft"
          >
            {copied ? (
              <>
                <Check size={16} className="text-emerald-600" />
                Đã copy!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy đường dẫn
              </>
            )}
          </button>
          <button
            onClick={shareToZalo}
            className="flex items-center gap-2 w-full px-3 py-2.5 text-sm hover:bg-surface-soft border-t border-hairline"
          >
            <Share2 size={16} className="text-[#0068FF]" />
            Chia sẻ Zalo
          </button>
        </div>
      )}
    </div>
  );
}
