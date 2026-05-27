"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  User, Phone, Mail, MapPin, FileText, Bell, Shield,
  Camera, Check, ChevronRight, Star, Package, ShoppingBag
} from "lucide-react";

const TABS = [
  { id: "profile", label: "Hồ sơ cá nhân", icon: User },
  { id: "documents", label: "Giấy tờ & KYC", icon: FileText },
  { id: "notifications", label: "Thông báo", icon: Bell },
  { id: "security", label: "Bảo mật", icon: Shield },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-surface-soft">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Profile header card */}
        <div className="bg-white rounded-2xl border border-hairline card-shadow mb-6 overflow-hidden">
          <div className="hero-gradient h-28" />
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-12 mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl border-4 border-white bg-primary-light flex items-center justify-center text-white text-3xl font-bold card-shadow">
                  N
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-active transition-colors">
                  <Camera size={14} />
                </button>
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-ink">Nguyễn Văn Hùng</h1>
                  <Badge variant="organic">✅ Đã xác thực</Badge>
                  <Badge variant="vietgap">Nông dân</Badge>
                </div>
                <p className="text-sm text-muted mt-1 flex items-center gap-1">
                  <MapPin size={13} className="text-primary" /> Cái Bè, Tiền Giang
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-6 text-center pb-1">
                {[
                  { value: "4.8", label: "Điểm tin cậy", icon: Star },
                  { value: "12", label: "Sản phẩm", icon: Package },
                  { value: "38", label: "Đơn hàng", icon: ShoppingBag },
                ].map(({ value, label, icon: Icon }) => (
                  <div key={label}>
                    <p className="text-xl font-bold text-ink">{value}</p>
                    <p className="text-xs text-muted">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tab sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-hairline card-shadow p-2">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left",
                    activeTab === id ? "bg-primary-ultra-light text-primary" : "text-muted hover:text-ink hover:bg-surface-soft"
                  )}
                >
                  <Icon size={17} />
                  {label}
                  {activeTab === id && <ChevronRight size={14} className="ml-auto text-primary" />}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="bg-white rounded-xl border border-hairline card-shadow p-6">
                <h2 className="text-lg font-bold text-ink mb-6">Thông tin cá nhân</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <Input label="Họ và tên" defaultValue="Nguyễn Văn Hùng" leftIcon={<User size={16} />} />
                  <Input label="Số điện thoại" defaultValue="0901 234 567" leftIcon={<Phone size={16} />} disabled />
                  <Input label="Email" defaultValue="hung.nguyen@gmail.com" leftIcon={<Mail size={16} />} />
                  <div>
                    <label className="text-sm font-medium text-ink mb-1.5 block">Tỉnh thành</label>
                    <select className="w-full h-12 px-3.5 rounded-lg border border-border-strong bg-white text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors">
                      <option>Tiền Giang</option>
                      <option>Lâm Đồng</option>
                      <option>Bình Thuận</option>
                    </select>
                  </div>
                  <Input label="Địa chỉ chi tiết" defaultValue="Xã Hòa Hưng, Huyện Cái Bè" leftIcon={<MapPin size={16} />} />
                  <div>
                    <label className="text-sm font-medium text-ink mb-1.5 block">Giới thiệu bản thân</label>
                    <textarea
                      defaultValue="Nông dân trồng xoài cát Hòa Lộc tại Cái Bè, Tiền Giang. Kinh nghiệm 15 năm, canh tác theo tiêu chuẩn VietGAP."
                      className="w-full h-24 px-3.5 py-3 rounded-lg border border-border-strong bg-white text-sm resize-none outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    />
                  </div>
                </div>
                <Button>Lưu thay đổi</Button>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="bg-white rounded-xl border border-hairline card-shadow p-6">
                <h2 className="text-lg font-bold text-ink mb-6">Giấy tờ & Xác thực danh tính (KYC)</h2>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Căn cước công dân (CCCD)", status: "verified", date: "01/01/2025" },
                    { label: "Địa chỉ cư trú", status: "verified", date: "01/01/2025" },
                    { label: "Chứng nhận VietGAP", status: "verified", date: "15/03/2025", expires: "15/03/2027" },
                    { label: "Chứng nhận OCOP 4 sao", status: "pending" },
                    { label: "Hợp đồng thuê đất (nếu có)", status: "not_uploaded" },
                  ].map(({ label, status, date, expires }) => (
                    <div key={label} className="flex items-center justify-between p-4 rounded-xl border border-hairline hover:bg-surface-soft transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
                          status === "verified" ? "bg-surface-green" :
                          status === "pending" ? "bg-[#FEF9C3]" : "bg-surface-strong"
                        )}>
                          <FileText size={18} className={
                            status === "verified" ? "text-primary" :
                            status === "pending" ? "text-[#854D0E]" : "text-muted"
                          } />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink">{label}</p>
                          {date && <p className="text-xs text-muted">Ngày cấp: {date}{expires ? ` · Hết hạn: ${expires}` : ""}</p>}
                        </div>
                      </div>
                      <div>
                        {status === "verified" && <Badge variant="organic"><Check size={10} /> Đã xác thực</Badge>}
                        {status === "pending" && <Badge variant="harvest">Đang xét duyệt</Badge>}
                        {status === "not_uploaded" && <Button size="sm" variant="secondary">Tải lên</Button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-xl border border-hairline card-shadow p-6">
                <h2 className="text-lg font-bold text-ink mb-6">Cài đặt thông báo</h2>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Đơn hàng mới", desc: "Khi có người đặt mua sản phẩm của bạn", enabled: true },
                    { label: "Biến động giá ±10%", desc: "Khi giá thị trường thay đổi đáng kể", enabled: true },
                    { label: "Sản phẩm được duyệt", desc: "Khi Admin phê duyệt sản phẩm của bạn", enabled: true },
                    { label: "Tin nhắn mới", desc: "Khi có tin nhắn từ người mua", enabled: true },
                    { label: "Bản tin nông nghiệp", desc: "Thông tin kỹ thuật và thị trường hàng tuần", enabled: false },
                    { label: "Khuyến mãi & Ưu đãi", desc: "Gói Premium và tính năng mới", enabled: false },
                  ].map(({ label, desc, enabled }) => (
                    <div key={label} className="flex items-center justify-between p-4 rounded-xl border border-hairline">
                      <div>
                        <p className="text-sm font-semibold text-ink">{label}</p>
                        <p className="text-xs text-muted">{desc}</p>
                      </div>
                      <button className={cn("w-12 h-6 rounded-full transition-colors relative", enabled ? "bg-primary" : "bg-surface-strong")}>
                        <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all", enabled ? "left-7" : "left-1")} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white rounded-xl border border-hairline card-shadow p-6">
                <h2 className="text-lg font-bold text-ink mb-6">Bảo mật tài khoản</h2>
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-ink mb-4">Đổi mật khẩu</h3>
                    <div className="flex flex-col gap-3">
                      <Input label="Mật khẩu hiện tại" type="password" placeholder="••••••••" />
                      <Input label="Mật khẩu mới" type="password" placeholder="Tối thiểu 8 ký tự" />
                      <Input label="Xác nhận mật khẩu mới" type="password" placeholder="••••••••" />
                      <Button size="sm" className="self-start">Cập nhật mật khẩu</Button>
                    </div>
                  </div>

                  <div className="border-t border-hairline pt-6">
                    <h3 className="text-sm font-semibold text-ink mb-4">Phiên đăng nhập</h3>
                    <div className="flex flex-col gap-3">
                      {[
                        { device: "iPhone 14 Pro — Safari", location: "Cái Bè, Tiền Giang", time: "Ngay bây giờ", current: true },
                        { device: "Samsung Galaxy A54 — Chrome", location: "TP.HCM", time: "2 ngày trước", current: false },
                        { device: "Máy tính — Windows Chrome", location: "Hà Nội", time: "5 ngày trước", current: false },
                      ].map(({ device, location, time, current }) => (
                        <div key={device} className="flex items-center justify-between p-3 rounded-lg border border-hairline">
                          <div>
                            <p className="text-sm font-medium text-ink">{device}</p>
                            <p className="text-xs text-muted">{location} · {time}</p>
                          </div>
                          {current ? (
                            <Badge variant="organic">Thiết bị này</Badge>
                          ) : (
                            <button className="text-xs text-error hover:underline">Đăng xuất</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
