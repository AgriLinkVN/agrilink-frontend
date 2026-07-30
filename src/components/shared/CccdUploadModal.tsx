'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { X, Camera, UploadCloud, Check, Loader2, RotateCcw, AlertCircle } from 'lucide-react';
import { uploadPrivateDocument } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors/get-error-message';
import { useAuthStore } from '@/store/authStore';

interface CccdUploadResult {
  frontFileId: string;
  backFileId: string;
}

interface CccdUploadModalProps {
  onClose: () => void;
  onSuccess: (data: CccdUploadResult) => void;
}

type TabType = 'upload' | 'camera';
type StepType = 'front' | 'back';

export function CccdUploadModal({ onClose, onSuccess }: CccdUploadModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [step, setStep] = useState<StepType>('front');
  const [frontImage, setFrontImage] = useState<File | Blob | null>(null);
  const [backImage, setBackImage] = useState<File | Blob | null>(null);
  const [frontPreview, setFrontPreview] = useState<string>('');
  const [backPreview, setBackPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Camera state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cameraRequestRef = useRef(0);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const token = useAuthStore((s) => s.accessToken);

  const releaseCamera = useCallback(() => {
    cameraRequestRef.current += 1;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const stopCamera = useCallback(() => {
    releaseCamera();
    setIsCameraActive(false);
  }, [releaseCamera]);

  const startCamera = useCallback(async () => {
    const requestId = cameraRequestRef.current + 1;
    cameraRequestRef.current = requestId;
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      if (cameraRequestRef.current !== requestId) {
        mediaStream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
      setErrorMsg('');
    } catch (error: unknown) {
      console.error('Camera access error:', error);
      if (cameraRequestRef.current !== requestId) return;
      setIsCameraActive(false);
      setErrorMsg('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập hoặc thiết bị của bạn. Trên một số trình duyệt, tính năng này yêu cầu HTTPS.');
    }
  }, []);

  useEffect(() => releaseCamera, [releaseCamera]);

  const changeTab = useCallback(
    (tab: TabType) => {
      if (tab === 'upload') {
        stopCamera();
      } else if (tab !== activeTab) {
        void startCamera();
      }
      setActiveTab(tab);
    },
    [activeTab, startCamera, stopCamera],
  );

  useEffect(
    () => () => {
      if (frontPreview) URL.revokeObjectURL(frontPreview);
    },
    [frontPreview],
  );

  useEffect(
    () => () => {
      if (backPreview) URL.revokeObjectURL(backPreview);
    },
    [backPreview],
  );

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw the current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to blob
    canvas.toBlob((blob) => {
      if (!blob) return;
      const previewUrl = URL.createObjectURL(blob);
      if (step === 'front') {
        setFrontImage(blob);
        setFrontPreview(previewUrl);
        setStep('back');
      } else {
        setBackImage(blob);
        setBackPreview(previewUrl);
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  }, [step, stopCamera]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, side: StepType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg('Dung lượng ảnh phải nhỏ hơn 4MB.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    if (side === 'front') {
      setFrontImage(file);
      setFrontPreview(previewUrl);
      if (!backImage) setStep('back');
    } else {
      setBackImage(file);
      setBackPreview(previewUrl);
    }
    setErrorMsg('');
  };

  const resetCapture = () => {
    setFrontImage(null);
    setBackImage(null);
    setFrontPreview('');
    setBackPreview('');
    setStep('front');
    setErrorMsg('');
    if (activeTab === 'camera') {
      void startCamera();
    }
  };

  const handleSubmit = async () => {
    if (!frontImage || !backImage) {
      setErrorMsg('Vui lòng cung cấp đủ ảnh mặt trước và mặt sau.');
      return;
    }
    if (!token) {
      setErrorMsg('Bạn chưa đăng nhập.');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    try {
      const frontFile =
        frontImage instanceof File
          ? frontImage
          : new File([frontImage], 'cccd-front.jpg', { type: 'image/jpeg' });
      const backFile =
        backImage instanceof File
          ? backImage
          : new File([backImage], 'cccd-back.jpg', { type: 'image/jpeg' });

      const [frontFileId, backFileId] = await Promise.all([
        uploadPrivateDocument(frontFile, 'KYC_IDENTITY', token),
        uploadPrivateDocument(backFile, 'KYC_IDENTITY', token),
      ]);

      onSuccess({ frontFileId, backFileId });
      onClose();
    } catch (error: unknown) {
      console.error(error);
      setErrorMsg(
        getErrorMessage(
          error,
          'Không thể tải CCCD. Vui lòng thử lại với ảnh rõ nét hơn.',
        ),
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-bold text-xl text-slate-800">Cập nhật Căn cước công dân</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition ${activeTab === 'upload' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-500 hover:bg-slate-50'}`}
              onClick={() => changeTab('upload')}
            >
              <UploadCloud size={18} /> Tải file từ máy
            </button>
            <button
              className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition ${activeTab === 'camera' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-500 hover:bg-slate-50'}`}
              onClick={() => changeTab('camera')}
            >
              <Camera size={18} /> Chụp từ Camera
            </button>
          </div>

          <div className="p-6">
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex gap-2 items-start text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB: UPLOAD */}
            {activeTab === 'upload' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mặt trước */}
                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-slate-700 text-sm">Mặt trước CCCD <span className="text-red-500">*</span></span>
                  <label className="relative flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-primary transition group overflow-hidden bg-slate-50">
                    {frontPreview ? (
                      <Image src={frontPreview} alt="Mặt trước" fill unoptimized className="object-contain" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-primary">
                        <UploadCloud size={32} className="mb-2" />
                        <span className="text-sm font-medium">Bấm để tải ảnh lên</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'front')} />
                  </label>
                </div>

                {/* Mặt sau */}
                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-slate-700 text-sm">Mặt sau CCCD <span className="text-red-500">*</span></span>
                  <label className="relative flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-primary transition group overflow-hidden bg-slate-50">
                    {backPreview ? (
                      <Image src={backPreview} alt="Mặt sau" fill unoptimized className="object-contain" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-primary">
                        <UploadCloud size={32} className="mb-2" />
                        <span className="text-sm font-medium">Bấm để tải ảnh lên</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'back')} />
                  </label>
                </div>
              </div>
            )}

            {/* TAB: CAMERA */}
            {activeTab === 'camera' && (
              <div className="flex flex-col items-center">
                {(!frontImage || !backImage) ? (
                  <>
                    <div className="w-full mb-4 text-center">
                      <h4 className="font-bold text-lg text-primary">
                        {step === 'front' ? 'Bước 1: Chụp mặt TRƯỚC CCCD' : 'Bước 2: Chụp mặt SAU CCCD'}
                      </h4>
                      <p className="text-slate-500 text-sm">Vui lòng căn chỉnh thẻ vào trong khung hình sáng và rõ nét.</p>
                    </div>

                    <div className="relative w-full max-w-md bg-black rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center">
                      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
                      
                      {/* ID Card Overlay Frame (ratio 1.586) */}
                      <div className="absolute w-[80%] aspect-[1.586] border-2 border-primary/80 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] z-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
                      </div>

                      {!isCameraActive && (
                        <div className="absolute inset-0 flex items-center justify-center text-white z-20">
                          <Loader2 size={32} className="animate-spin opacity-50" />
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={captureImage}
                      disabled={!isCameraActive}
                      className="mt-6 w-16 h-16 bg-white border-4 border-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
                    >
                      <div className="w-12 h-12 bg-primary rounded-full"></div>
                    </button>
                    
                    {/* Hidden canvas for image extraction */}
                    <canvas ref={canvasRef} className="hidden"></canvas>
                  </>
                ) : (
                  <div className="w-full">
                    <h4 className="font-bold text-center text-lg text-emerald-600 mb-4">Đã chụp xong 2 mặt</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium mb-2">Mặt trước</span>
                        <div className="relative w-full aspect-[1.586]">
                          <Image src={frontPreview} fill unoptimized className="rounded-lg border border-slate-200 object-contain" alt="Mặt trước" />
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium mb-2">Mặt sau</span>
                        <div className="relative w-full aspect-[1.586]">
                          <Image src={backPreview} fill unoptimized className="rounded-lg border border-slate-200 object-contain" alt="Mặt sau" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button 
            onClick={resetCapture} 
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium px-3 py-2"
          >
            <RotateCcw size={16} /> Chụp/Tải lại
          </button>

          <button
            onClick={handleSubmit}
            disabled={!frontImage || !backImage || isUploading}
            className={`px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition shadow-sm
              ${(!frontImage || !backImage || isUploading) 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-primary-active'}`}
          >
            {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
            {isUploading ? 'Đang xác thực OCR...' : 'Xác nhận & Gửi đi'}
          </button>
        </div>
      </div>
    </div>
  );
}
