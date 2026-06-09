"use client";

import { Phone, MessageCircle } from "lucide-react";

interface Props {
  phone: string | null | undefined;
  sellerName?: string | null;
  /** "sidebar" = sticky right column (desktop); "mobile-bar" = fixed bottom (mobile) */
  variant?: "sidebar" | "mobile-bar";
}

/** Vietnam phone validation — 10 digits starting with 0 (basic). */
function isValidVNPhone(phone: string): boolean {
  return /^0\d{9}$/.test(phone.replace(/\s+/g, ""));
}

/** "0912345678" → "0912 345 678" */
function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return phone;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function ContactButtons({ phone, variant = "sidebar" }: Props) {
  if (!phone || !isValidVNPhone(phone)) {
    return (
      <div
        className={
          variant === "mobile-bar"
            ? "fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-hairline p-3 shadow-lg"
            : "rounded-xl border border-hairline p-4 bg-surface-soft"
        }
      >
        <p className="text-sm text-muted text-center">
          Người bán chưa cập nhật số điện thoại liên hệ.
        </p>
      </div>
    );
  }

  const normalized = normalizePhone(phone);
  const displayPhone = formatPhoneDisplay(normalized);
  const zaloUrl = `https://zalo.me/${normalized}`;

  const callBtn = (
    <a
      href={`tel:${normalized}`}
      className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary text-white font-semibold py-3 px-4 shadow hover:bg-primary/90 transition"
    >
      <Phone size={18} />
      <span>Gọi {displayPhone}</span>
    </a>
  );

  const zaloBtn = (
    <a
      href={zaloUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#0068FF] text-white font-semibold py-3 px-4 shadow hover:bg-[#0055D4] transition"
    >
      <MessageCircle size={18} />
      <span>Chat Zalo</span>
    </a>
  );

  if (variant === "mobile-bar") {
    return (
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-hairline p-3 grid grid-cols-2 gap-2 shadow-lg">
        <a
          href={`tel:${normalized}`}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary text-white font-semibold py-3 shadow"
        >
          <Phone size={18} />
          <span className="text-sm">Gọi điện</span>
        </a>
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0068FF] text-white font-semibold py-3 shadow"
        >
          <MessageCircle size={18} />
          <span className="text-sm">Zalo</span>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-2xl border border-hairline p-4 bg-white shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted font-semibold">
        Liên hệ người bán
      </p>
      {callBtn}
      {zaloBtn}
      <p className="text-xs text-muted text-center pt-1">
        AgriLink kết nối trực tiếp — không thu phí trung gian.
      </p>
    </div>
  );
}
