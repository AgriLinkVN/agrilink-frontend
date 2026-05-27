"use client";

import Link from "next/link";
import { useState } from "react";
import { Leaf, Phone, User, Mail, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type UserRole } from "@/types";

const ROLES: { value: UserRole; label: string; icon: string; desc: string }[] = [
  { value: "farmer", label: "Nông dân / Hộ sản xuất", icon: "👨‍🌾", desc: "Đăng bán nông sản, xem giá, nhận đơn" },
  { value: "cooperative", label: "Hợp tác xã (HTX)", icon: "🏡", desc: "Quản lý thành viên, đăng lô hàng lớn" },
  { value: "buyer", label: "Người mua / Thương lái", icon: "🛒", desc: "Tìm nguồn hàng, đặt mua theo vùng" },
  { value: "enterprise", label: "Doanh nghiệp chế biến", icon: "🏭", desc: "Thu mua số lượng lớn, hợp đồng dài hạn" },
  { value: "supplier", label: "Nhà cung cấp nông cụ", icon: "🚜", desc: "Bán phân bón, thuốc BVTV, dụng cụ" },
  { value: "logistics", label: "Đối tác vận chuyển", icon: "🚚", desc: "Kết nối vận chuyển nông sản" },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  return (
    <div className="min-h-screen bg-surface-soft flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex w-[480px] shrink-0 hero-gradient flex-col p-12 gap-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Leaf size={22} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white">AgriLink</span>
        </Link>

        <div className="flex-1 flex flex-col justify-center gap-6">
          <h2 className="text-3xl font-bold text-white">Miễn phí 12 tháng đầu cho nông dân & HTX</h2>
          <div className="flex flex-col gap-4">
            {[
              "Đăng sản phẩm không giới hạn",
              "Xem giá thị trường realtime",
              "Chat trực tiếp với người mua",
              "QR truy xuất nguồn gốc",
              "Hỗ trợ kỹ thuật 24/7",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary-ultra-light flex items-center justify-center shrink-0">
                  <Check size={12} className="text-primary" />
                </div>
                <span className="text-white/90 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/50 text-sm">© 2025 AgriLink Vietnam · Dự án khởi nghiệp sinh viên</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-start justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-lg py-8">
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-primary">AgriLink</span>
          </Link>

          {/* Progress steps */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                  s < step ? "bg-primary text-white" : s === step ? "bg-primary text-white ring-4 ring-primary-ultra-light" : "bg-surface-strong text-muted"
                )}>
                  {s < step ? <Check size={14} /> : s}
                </div>
                <span className={cn("text-xs font-medium hidden sm:block", s === step ? "text-primary" : "text-muted")}>
                  {s === 1 ? "Chọn vai trò" : s === 2 ? "Thông tin" : "Xác thực OTP"}
                </span>
                {s < 3 && <div className={cn("flex-1 h-0.5 min-w-8", s < step ? "bg-primary" : "bg-hairline")} />}
              </div>
            ))}
          </div>

          {/* Step 1 — role selection */}
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold text-ink mb-2">Bạn là ai?</h1>
              <p className="text-muted mb-6">Chọn vai trò phù hợp để AgriLink cá nhân hóa trải nghiệm</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {ROLES.map(({ value, label, icon, desc }) => (
                  <button
                    key={value}
                    onClick={() => setSelectedRole(value)}
                    className={cn(
                      "text-left p-4 rounded-xl border-2 transition-all",
                      selectedRole === value
                        ? "border-primary bg-surface-green"
                        : "border-hairline bg-white hover:border-primary-light hover:bg-surface-soft"
                    )}
                  >
                    <span className="text-2xl mb-2 block">{icon}</span>
                    <p className={cn("text-sm font-semibold mb-1", selectedRole === value ? "text-primary" : "text-ink")}>
                      {label}
                    </p>
                    <p className="text-xs text-muted leading-relaxed">{desc}</p>
                    {selectedRole === value && (
                      <div className="mt-2 flex items-center gap-1 text-primary text-xs font-semibold">
                        <Check size={12} /> Đã chọn
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <Button size="lg" className="w-full" disabled={!selectedRole} onClick={() => setStep(2)}>
                Tiếp theo <ArrowRight size={18} />
              </Button>
            </div>
          )}

          {/* Step 2 — user info */}
          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold text-ink mb-2">Thông tin cá nhân</h1>
              <p className="text-muted mb-6">Điền đầy đủ để xác thực tài khoản</p>

              <form className="flex flex-col gap-4">
                <Input label="Họ và tên" placeholder="Nguyễn Văn A" leftIcon={<User size={16} />} />
                <Input label="Số điện thoại *" type="tel" placeholder="0901 234 567" leftIcon={<Phone size={16} />} hint="Dùng để nhận OTP xác thực" />
                <Input label="Email (tùy chọn)" type="email" placeholder="example@gmail.com" leftIcon={<Mail size={16} />} />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">Mật khẩu *</label>
                  <input
                    type="password"
                    placeholder="Tối thiểu 8 ký tự"
                    className="h-12 px-3.5 rounded-lg border border-border-strong bg-white text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>

                <div className="p-3 bg-surface-green rounded-lg border border-primary-light text-xs text-muted">
                  <span className="font-semibold text-primary">Vai trò đã chọn:</span>{" "}
                  {ROLES.find(r => r.value === selectedRole)?.label}
                  {" · "}
                  <button type="button" onClick={() => setStep(1)} className="text-primary underline">Thay đổi</button>
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" className="accent-primary w-4 h-4 mt-0.5" />
                  <span className="text-sm text-muted">
                    Tôi đồng ý với{" "}
                    <Link href="/terms" className="text-primary hover:underline">Điều khoản sử dụng</Link>
                    {" "}và{" "}
                    <Link href="/privacy" className="text-primary hover:underline">Chính sách bảo mật</Link>
                  </span>
                </div>

                <div className="flex gap-3 mt-2">
                  <Button variant="secondary" size="lg" className="flex-1" onClick={() => setStep(1)}>
                    Quay lại
                  </Button>
                  <Button size="lg" className="flex-1" onClick={() => setStep(3)}>
                    Gửi OTP <ArrowRight size={18} />
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3 — OTP */}
          {step === 3 && (
            <div>
              <h1 className="text-2xl font-bold text-ink mb-2">Xác thực số điện thoại</h1>
              <p className="text-muted mb-8">
                Mã OTP đã gửi tới <span className="font-semibold text-ink">0901 234 xxx</span>. Có hiệu lực trong 5 phút.
              </p>

              {/* OTP boxes */}
              <div className="flex gap-3 justify-center mb-8">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-12 h-14 text-center text-xl font-bold border-2 border-border-strong rounded-xl bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                ))}
              </div>

              <Button size="lg" className="w-full mb-4">
                Xác nhận & Tạo tài khoản <Check size={18} />
              </Button>

              <p className="text-center text-sm text-muted">
                Không nhận được mã?{" "}
                <button className="text-primary font-semibold hover:underline">Gửi lại OTP</button>
              </p>

              <button onClick={() => setStep(2)} className="w-full mt-4 text-sm text-muted hover:text-ink transition-colors">
                ← Quay lại bước trước
              </button>
            </div>
          )}

          <p className="text-center text-sm text-muted mt-6">
            Đã có tài khoản?{" "}
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
