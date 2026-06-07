'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AffectedBulkListing {
  id: string;
  title: string;
  quantity: number;
  unit: string;
}

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  affected: AffectedBulkListing[];
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal cảnh báo khi suspend/remove member hoặc leave HTX trong khi thành viên
 * còn contribution trong bulk listing đang `active`. Tương ứng response 409
 * `MEMBER_HAS_ACTIVE_CONTRIBUTIONS` từ backend (BA addendum v2.1 §1.1, §1.3).
 */
export function ConfirmContributionsDialog({
  open,
  title,
  description,
  confirmLabel,
  affected,
  loading,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onCancel]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-3 p-5 border-b border-hairline">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-ink text-base">{title}</h3>
            <p className="text-sm text-muted mt-1">{description}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-muted hover:text-ink p-1 rounded-md hover:bg-surface-soft"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 max-h-64 overflow-y-auto bg-orange-50/40">
          <p className="text-xs font-semibold uppercase text-orange-600 mb-2">
            {affected.length} lô hàng đang active bị ảnh hưởng
          </p>
          <ul className="flex flex-col divide-y divide-orange-100">
            {affected.map((b) => (
              <li
                key={b.id}
                className="flex items-center gap-3 py-2.5 text-sm"
              >
                <Package size={16} className="text-orange-500 shrink-0" />
                <span className="font-medium text-ink truncate flex-1">
                  {b.title}
                </span>
                <span className="text-xs text-muted tabular-nums shrink-0">
                  {b.quantity.toLocaleString('vi-VN')} {b.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 bg-surface-soft border-t border-hairline">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={loading}>
            Huỷ
          </Button>
          <Button
            variant="destructive"
            size="sm"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
