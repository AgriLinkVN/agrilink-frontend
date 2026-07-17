'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { uploadImageToStorage, type StorageImageType } from '@/lib/api';

interface CloudinaryUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  type?: StorageImageType;
}

export function CloudinaryUpload({ label, value, onChange, type = 'product' }: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const token = useAuthStore.getState().accessToken;
      const secureUrl = await uploadImageToStorage(file, type, token);
      onChange(secureUrl);
    } catch (error) {
      console.error('Lỗi khi upload:', error);
      alert('Tải ảnh lên thất bại do lỗi mạng. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      
      {value ? (
        <div className="relative w-full max-w-sm h-48 rounded-lg overflow-hidden border border-slate-200 group">
          <Image src={value} alt="Uploaded" fill sizes="384px" className="object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full max-w-sm h-48 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
            ) : (
              <UploadCloud className="w-8 h-8 text-slate-400 mb-3" />
            )}
            <p className="mb-2 text-sm text-slate-500">
              <span className="font-semibold text-emerald-600">Nhấn để tải lên</span> hoặc kéo thả file
            </p>
            <p className="text-xs text-slate-400">PNG, JPG, JPEG (Tối đa 5MB)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/png, image/jpeg, image/jpg" 
            onChange={handleFileChange} 
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}
