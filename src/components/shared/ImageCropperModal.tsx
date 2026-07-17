'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';
import { X, ZoomIn, ZoomOut, Check, Loader2 } from 'lucide-react';

interface ImageCropperModalProps {
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob) => void;
  isUploading?: boolean;
}

export function ImageCropperModal({ imageSrc, onClose, onCropComplete, isUploading }: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropCompleteHandler = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
      alert('Đã có lỗi xảy ra khi cắt ảnh.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">Chỉnh sửa ảnh đại diện</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition" disabled={isUploading}>
            <X size={18} />
          </button>
        </div>

        <div className="relative w-full h-80 bg-slate-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
          />
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <ZoomOut size={20} className="text-slate-400" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <ZoomIn size={20} className="text-slate-400" />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="px-5 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSave}
              disabled={isUploading}
              className="px-5 py-2.5 rounded-lg font-medium text-white bg-primary hover:bg-primary-active transition flex items-center gap-2"
            >
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
              {isUploading ? 'Đang lưu...' : 'Lưu ảnh'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
