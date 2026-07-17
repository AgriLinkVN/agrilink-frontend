"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Phone, User, ArrowRight, Check, Key, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type UserRole } from "@/types";
import { useAuth } from "@/lib/auth-context";

const ROLES: { value: UserRole; label: string; icon: string; desc: string }[] = [
  { value: "farmer", label: "Nông dân / Hộ sản xuất", icon: "👨‍🌾", desc: "Đăng bán nông sản, xem giá, nhận đơn" },
  { value: "cooperative", label: "Hợp tác xã (HTX)", icon: "🏡", desc: "Quản lý thành viên, đăng lô hàng lớn" },
  { value: "buyer", label: "Người mua / Thương lái", icon: "🛒", desc: "Tìm nguồn hàng, đặt mua theo vùng" },
  { value: "enterprise", label: "Doanh nghiệp chế biến", icon: "🏭", desc: "Thu mua số lượng lớn, hợp đồng dài hạn" },
  { value: "supplier", label: "Nhà cung cấp nông cụ", icon: "🚜", desc: "Bán phân bón, thuốc BVTV, dụng cụ" },
  { value: "logistics", label: "Đối tác vận chuyển", icon: "🚚", desc: "Kết nối vận chuyển nông sản" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Format phone from 090... to +8490... for backend
  const formatPhone = (p: string) => {
    let clean = p.replace(/\D/g, "");
    if (clean.startsWith("0")) {
      clean = "84" + clean.slice(1);
    } else if (!clean.startsWith("84")) {
      clean = "84" + clean;
    }
    return "+" + clean;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return setError("Vui lòng nhập Họ và tên");
    if (!phone) return setError("Vui lòng nhập số điện thoại");
    
    setError("");
    setIsLoading(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: formatPhone(phone), type: "sms", purpose: "register" }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStep(3); // Go to OTP and Password step
      } else {
        setError(data.message || "Không thể gửi OTP. Vui lòng thử lại.");
      }
    } catch {
      setError("Lỗi kết nối đến máy chủ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) return setError("Vui lòng nhập đủ 6 số OTP");
    if (password.length < 6) return setError("Mật khẩu phải từ 6 ký tự trở lên");
    
    setError("");
    setIsLoading(true);
    
    try {
      // 1. Verify OTP
      const otpRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: formatPhone(phone), code: otpCode, purpose: "register" }),
      });
      
      if (!otpRes.ok) {
        const otpData = await otpRes.json();
        setError(otpData.message || "OTP không hợp lệ hoặc đã hết hạn.");
        setIsLoading(false);
        return;
      }
      
      // 2. Register
      const regRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: formatPhone(phone), 
          password: password,
          fullName: fullName,
          role: selectedRole 
        }),
      });
      
      const regData = await regRes.json();
      
      if (regRes.ok) {
        setSuccessMsg("Đăng ký thành công! Đang chuyển hướng...");
        
        // Auto login with the created credentials
        const loginResult = await login(formatPhone(phone), password, "password");
        if ("error" in loginResult) {
          // If auto-login fails, redirect to login page
          setTimeout(() => {
            router.push("/auth/login");
          }, 1500);
        } else {
          // If auto-login succeeds, redirect to dashboard
          setTimeout(() => {
            router.push(loginResult.dashboard);
          }, 1000);
        }
      } else {
        setError(regData.message || "Đăng ký thất bại. Số điện thoại có thể đã tồn tại.");
      }
    } catch {
      setError("Lỗi kết nối đến máy chủ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

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

        <p className="text-white/50 text-sm">© 2026 AgriLink Vietnam</p>
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
              <div key={s} className="flex items-center gap-1 sm:gap-2 w-full max-w-[200px]">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all shrink-0",
                  s < step ? "bg-primary text-white" : s === step ? "bg-primary text-white ring-4 ring-primary-ultra-light" : "bg-surface-strong text-muted"
                )}>
                  {s < step ? <Check size={14} /> : s}
                </div>
                <span className={cn("text-[10px] sm:text-xs font-medium hidden sm:block whitespace-nowrap", s === step ? "text-primary" : "text-muted")}>
                  {s === 1 ? "Vai trò" : s === 2 ? "Thông tin" : "Bảo mật & OTP"}
                </span>
                {s < 3 && <div className={cn("flex-1 h-0.5 min-w-4", s < step ? "bg-primary" : "bg-hairline")} />}
              </div>
            ))}
          </div>

          {error && (
            <div className="p-3 mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          
          {successMsg && (
            <div className="p-3 mb-6 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg">
              {successMsg}
            </div>
          )}

          {/* Step 1 — role selection */}
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold text-ink mb-2">Bạn là ai?</h1>
              <p className="text-muted mb-6">Chọn vai trò phù hợp để AgriLink cá nhân hóa trải nghiệm</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {ROLES.map(({ value, label, icon, desc }) => (
                  <button
                    key={value}
                    onClick={() => { setSelectedRole(value); setError(""); }}
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
              <h1 className="text-2xl font-bold text-ink mb-2">Thông tin cơ bản</h1>
              <p className="text-muted mb-6">Điền thông tin để tạo hồ sơ</p>

              <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                <Input 
                  label="Họ và tên *" 
                  type="text" 
                  placeholder="Nguyễn Văn A" 
                  leftIcon={<User size={16} />} 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
                <Input 
                  label="Số điện thoại *" 
                  type="tel" 
                  placeholder="0901 234 567" 
                  leftIcon={<Phone size={16} />} 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                />

                <div className="p-3 bg-surface-green rounded-lg border border-primary-light text-xs text-muted">
                  <span className="font-semibold text-primary">Vai trò đã chọn:</span>{" "}
                  {ROLES.find(r => r.value === selectedRole)?.label}
                  {" · "}
                  <button type="button" onClick={() => setStep(1)} className="text-primary underline">Thay đổi</button>
                </div>

                <div className="flex gap-3 mt-2">
                  <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={() => setStep(1)}>
                    Quay lại
                  </Button>
                  <Button type="submit" size="lg" className="flex-1" disabled={isLoading || !phone || !fullName}>
                    {isLoading ? "Đang gửi..." : "Gửi mã OTP"} <ArrowRight size={18} />
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3 — OTP & Password */}
          {step === 3 && (
            <div>
              <h1 className="text-2xl font-bold text-ink mb-2">Bảo mật & Xác thực</h1>
              <p className="text-muted mb-8">
                Mã OTP đã gửi tới <span className="font-semibold text-ink">{phone}</span>.
              </p>

              <form onSubmit={handleVerifyAndRegister} className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Nhập mã OTP *</label>
                  <div className="flex gap-3 justify-center">
                    {[...Array(6)].map((_, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        maxLength={1}
                        value={otp[i]}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        disabled={isLoading}
                        className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border-2 border-border-strong rounded-xl bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    ))}
                  </div>
                  <p className="text-center text-xs text-muted mt-3">
                    Không nhận được mã?{" "}
                    <button type="button" onClick={handleSendOtp} className="text-primary font-semibold hover:underline" disabled={isLoading}>
                      Gửi lại OTP
                    </button>
                  </p>
                </div>

                <Input 
                  label="Tạo mật khẩu *" 
                  type={showPwd ? "text" : "password"} 
                  placeholder="Tối thiểu 6 ký tự" 
                  leftIcon={<Key size={16} />} 
                  rightIcon={
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-muted hover:text-ink transition-colors">
                      {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />

                <div className="flex items-start gap-2 -mt-2">
                  <input 
                    type="checkbox" 
                    required 
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="accent-primary w-4 h-4 mt-0.5 cursor-pointer" 
                    id="terms"
                  />
                  <label htmlFor="terms" className="text-sm text-muted cursor-pointer select-none">
                    Tôi đồng ý với{" "}
                    <Link href="/terms" className="text-primary hover:underline">Điều khoản sử dụng</Link>
                    {" "}và{" "}
                    <Link href="/privacy" className="text-primary hover:underline">Chính sách bảo mật</Link>
                  </label>
                </div>

                <div className="flex gap-3 mt-2">
                  <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={() => setStep(2)}>
                    Quay lại
                  </Button>
                  <Button type="submit" size="lg" className="flex-1" disabled={isLoading || password.length < 6 || otp.join("").length < 6 || !agreedToTerms}>
                    {isLoading ? "Đang xử lý..." : "Đăng ký"} <Check size={18} />
                  </Button>
                </div>
              </form>
            </div>
          )}

          <p className="text-center text-sm text-muted mt-8">
            Đã có tài khoản?{" "}
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">Đăng nhập ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
