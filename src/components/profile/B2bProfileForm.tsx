'use client';

import React, { useState } from 'react';
import { CloudinaryUpload } from '../shared/CloudinaryUpload';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface B2bProfileState {
  taxCode: string;
  address: string;
  companyName: string; 
  businessLicenseUrl: string; 
  cooperativeName: string; 
  representativeName: string; 
  representativePhone: string; 
  cooperativeCertUrl: string; 
  representativeCccdFrontUrl: string; 
  representativeCccdBackUrl: string; 
}

interface B2bProfileFormProps {
  role: 'COOPERATIVE' | 'ENTERPRISE' | 'SUPPLIER';
}

export function B2bProfileForm({ role }: B2bProfileFormProps) {
  const [formData, setFormData] = useState<B2bProfileState>({
    taxCode: '',
    address: '',
    companyName: '',
    businessLicenseUrl: '',
    cooperativeName: '',
    representativeName: '',
    representativePhone: '',
    cooperativeCertUrl: '',
    representativeCccdFrontUrl: '',
    representativeCccdBackUrl: '',
  });

  const isCooperative = role === 'COOPERATIVE';
  const isEnterprise = role === 'ENTERPRISE';
  const isSupplier = role === 'SUPPLIER';

  const token = useAuthStore((s) => s.accessToken);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = (field: keyof B2bProfileState, url: string) => {
    setFormData((prev) => ({ ...prev, [field]: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!token) {
        alert("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
        return;
      }
      await api.put('/profiles/b2b', formData, token);
      alert(`Đã lưu thông tin hồ sơ ${role} thành công!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lưu hồ sơ thất bại');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">
        Cập nhật Hồ sơ {isCooperative ? 'Hợp tác xã' : role === 'ENTERPRISE' ? 'Doanh nghiệp' : 'Nhà cung cấp'}
      </h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">Thông tin Doanh nghiệp / Tổ chức</h3>
        
        {(isEnterprise || isSupplier) && (
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-700">Tên Doanh nghiệp / Công ty</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              required
            />
          </div>
        )}

        {isCooperative && (
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-700">Tên Hợp tác xã</label>
            <input
              type="text"
              name="cooperativeName"
              value={formData.cooperativeName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              required
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-700">Mã số thuế</label>
            <input
              type="text"
              name="taxCode"
              value={formData.taxCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-700">Địa chỉ đăng ký kinh doanh</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              required
            />
          </div>
        </div>

        {isCooperative && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-slate-700">Tên người đại diện</label>
              <input
                type="text"
                name="representativeName"
                value={formData.representativeName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-slate-700">SĐT người đại diện</label>
              <input
                type="text"
                name="representativePhone"
                value={formData.representativePhone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                required
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-700 border-t border-slate-200 pt-6">Giấy tờ pháp lý (Hình ảnh)</h3>
        
        {isEnterprise && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CloudinaryUpload 
              label="Ảnh Giấy phép Kinh doanh" 
              value={formData.businessLicenseUrl} 
              onChange={(url) => handleUpload('businessLicenseUrl', url)} 
              type="business_license"
            />
          </div>
        )}

        {isCooperative && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CloudinaryUpload 
              label="Ảnh Giấy chứng nhận HTX" 
              value={formData.cooperativeCertUrl} 
              onChange={(url) => handleUpload('cooperativeCertUrl', url)} 
              type="document"
            />
          </div>
        )}

        {isSupplier && (
          <>
            <h4 className="text-md font-semibold text-slate-600 mt-6 mb-2">Định danh Người đại diện</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CloudinaryUpload 
                label="Ảnh CCCD Mặt trước (Đại diện)" 
                value={formData.representativeCccdFrontUrl} 
                onChange={(url) => handleUpload('representativeCccdFrontUrl', url)} 
                type="cccd"
              />
              <CloudinaryUpload 
                label="Ảnh CCCD Mặt sau (Đại diện)" 
                value={formData.representativeCccdBackUrl} 
                onChange={(url) => handleUpload('representativeCccdBackUrl', url)} 
                type="cccd"
              />
            </div>
          </>
        )}
      </div>

      <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-slate-200 mt-8">
        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
        >
          Lưu Hồ sơ B2B
        </button>
      </div>
    </form>
  );
}
