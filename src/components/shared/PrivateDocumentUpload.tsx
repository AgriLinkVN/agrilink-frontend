'use client';

import { useRef, useState } from 'react';
import { FileCheck2, Loader2, UploadCloud, X } from 'lucide-react';
import { type PrivateStorageAssetType, uploadPrivateDocument } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface PrivateDocumentUploadProps {
  label: string;
  value?: string;
  onChange: (fileId: string) => void;
  assetType: PrivateStorageAssetType;
}

export function PrivateDocumentUpload({
  label,
  value,
  onChange,
  assetType,
}: PrivateDocumentUploadProps) {
  const token = useAuthStore((state) => state.accessToken);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const fileId = await uploadPrivateDocument(file, assetType, token);
      setFileName(file.name);
      onChange(fileId);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Tải tài liệu thất bại.',
      );
      event.target.value = '';
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFileName('');
    setError(null);
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {value ? (
        <div className="flex h-20 w-full max-w-sm items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4">
          <FileCheck2 className="h-6 w-6 shrink-0 text-emerald-700" />
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
            {fileName || 'Tài liệu riêng tư đã tải lên'}
          </span>
          <button
            type="button"
            onClick={clearFile}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-white hover:text-red-600"
            aria-label={`Xóa ${label}`}
            title={`Xóa ${label}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex h-32 w-full max-w-sm cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:bg-slate-100">
          {isUploading ? (
            <Loader2 className="mb-2 h-7 w-7 animate-spin text-emerald-600" />
          ) : (
            <UploadCloud className="mb-2 h-7 w-7 text-slate-400" />
          )}
          <span className="text-sm font-semibold text-emerald-700">
            {isUploading ? 'Đang tải lên' : 'Chọn tài liệu'}
          </span>
          <span className="mt-1 text-xs text-slate-400">
            PDF, PNG hoặc JPEG, tối đa 10 MB
          </span>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="application/pdf,image/png,image/jpeg"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
