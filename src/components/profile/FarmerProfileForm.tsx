'use client';

import React, { useState } from 'react';
import { CloudinaryUpload } from '../shared/CloudinaryUpload';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface FarmerProfileState {
  residenceAddress: string;
  bio: string;
  cccdNumber: string;
  cccdFrontUrl: string;
  cccdBackUrl: string;
}

export function FarmerProfileForm() {
  const [formData, setFormData] = useState<FarmerProfileState>({
    residenceAddress: '',
    bio: '',
    cccdNumber: '',
    cccdFrontUrl: '',
    cccdBackUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = (field: keyof FarmerProfileState, url: string) => {
    setFormData((prev) => ({ ...prev, [field]: url }));
  };

  const token = useAuthStore((s) => s.accessToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!token) {
        alert("Bạn chưa đăng nhập. Vui lòng đăng nhập lại!");
        return;
      }
      await api.put('/profiles/farmer', formData, token);
      alert('Đã lưu thông tin Hồ sơ Nông dân thành công!');
    } catch (error: any) {
      alert(`Lỗi: ${error.message || 'Lưu hồ sơ thất bại'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Cập nhật Hồ sơ Nông dân</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">Thông tin cơ bản</h3>
        
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-slate-700">Địa chỉ cư trú</label>
          <input
            type="text"
            name="residenceAddress"
            value={formData.residenceAddress}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            placeholder="Ví dụ: Thôn A, Xã B, Huyện C, Tỉnh D"
            required
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-slate-700">Giới thiệu bản thân / Nông trại</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            placeholder="Mô tả ngắn gọn về quy mô, loại cây trồng..."
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-700 border-t border-slate-200 pt-6">Thông tin định danh (KYC)</h3>
        
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-slate-700">Số Căn cước công dân (12 số)</label>
          <input
            type="text"
            name="cccdNumber"
            value={formData.cccdNumber}
            onChange={handleChange}
            maxLength={12}
            pattern="\d{12}"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            placeholder="Nhập đủ 12 số CCCD"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CloudinaryUpload 
            label="Ảnh CCCD Mặt trước" 
            value={formData.cccdFrontUrl} 
            onChange={(url) => handleUpload('cccdFrontUrl', url)} 
            type="cccd"
          />
          <CloudinaryUpload 
            label="Ảnh CCCD Mặt sau" 
            value={formData.cccdBackUrl} 
            onChange={(url) => handleUpload('cccdBackUrl', url)} 
            type="cccd"
          />
        </div>
      </div>

      <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-slate-200 mt-8">
        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
        >
          Lưu Hồ sơ Nông dân
        </button>
      </div>
    </form>
  );
}
