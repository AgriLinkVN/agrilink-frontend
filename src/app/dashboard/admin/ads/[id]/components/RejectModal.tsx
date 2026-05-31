'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Props {
  onConfirm: (reason: string) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

export function RejectModal({ onConfirm, onClose, isSubmitting }: Props) {
  const [reason, setReason] = useState('');
  const isValid = reason.trim().length >= 20;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" />
            <h2 className="font-semibold text-ink">Từ chối chiến dịch</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-muted hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <p className="text-sm text-muted">
            Cung cấp lý do từ chối rõ ràng để nhà cung cấp có thể cải thiện chiến dịch.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">
              Lý do từ chối <span className="text-error">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="VD: Hình ảnh banner không đáp ứng tiêu chuẩn chất lượng. Vui lòng sử dụng ảnh rõ nét, kích thước tối thiểu 1200x628px..."
              className={cn(
                'w-full px-3.5 py-3 rounded-lg border bg-white text-sm text-ink placeholder:text-muted-soft focus:outline-none focus:ring-2 resize-none transition-colors',
                isValid
                  ? 'border-border-strong focus:border-primary focus:ring-primary/20'
                  : reason.length > 0
                  ? 'border-error focus:border-error focus:ring-error/20'
                  : 'border-border-strong focus:border-primary focus:ring-primary/20',
              )}
            />
            <div className="flex justify-between items-center">
              {reason.length > 0 && !isValid ? (
                <p className="text-xs text-error">Tối thiểu 20 ký tự ({20 - reason.trim().length} còn thiếu)</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-muted ml-auto">{reason.length}/500</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-hairline">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(reason.trim())}
            disabled={!isValid}
            loading={isSubmitting}
          >
            Xác nhận từ chối
          </Button>
        </div>
      </div>
    </div>
  );
}
