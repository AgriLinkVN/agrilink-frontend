import React from 'react';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface VerificationBannerProps {
  status: 'pending' | 'verified' | 'rejected';
  reason?: string;
}

export function VerificationBanner({ status, reason }: VerificationBannerProps) {
  if (status === 'pending') {
    return (
      <div className="w-full flex items-center p-4 mb-6 rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-200">
        <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
        <span>Hồ sơ của bạn đang chờ quản trị viên phê duyệt. Quá trình này có thể mất 1-2 ngày làm việc.</span>
      </div>
    );
  }

  if (status === 'verified') {
    return (
      <div className="w-full flex items-center p-4 mb-6 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
        <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
        <span>Hồ sơ của bạn đã được xác thực thành công. Bạn có thể sử dụng tất cả tính năng của AgriLink.</span>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="w-full flex items-start p-4 mb-6 rounded-lg bg-red-100 text-red-800 border border-red-200">
        <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-1">Hồ sơ của bạn đã bị từ chối xác thực</p>
          {reason && <p className="text-sm">Lý do: {reason}</p>}
        </div>
      </div>
    );
  }

  return null;
}
