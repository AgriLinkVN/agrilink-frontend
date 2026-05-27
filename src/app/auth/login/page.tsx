"use client";

import Link from "next/link";
import { useState } from "react";
import { Leaf, Phone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [method, setMethod] = useState<"password" | "otp">("password");

  return (
    <div className="min-h-screen bg-surface-soft flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex w-[480px] shrink-0 hero-gradient flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Leaf size={22} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white">AgriLink</span>
        </Link>

        <div>
          <blockquote className="text-white/90 text-xl font-medium leading-relaxed mb-6">
            "Lần đầu tiên tôi biết giá xoài thực sự là bao nhiêu — và tôi bán được giá gấp đôi thương lái trả."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">N</div>
            <div>
              <p className="text-white font-semibold text-sm">Nguyễn Văn Hùng</p>
              <p className="text-white/60 text-xs">Nông dân, Tiền Giang</p>
            </div>
          </div>
        </div>

        <p className="text-white/50 text-sm">© 2025 AgriLink Vietnam</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-primary">AgriLink</span>
          </Link>

          <h1 className="text-2xl font-bold text-ink mb-2">Đăng nhập</h1>
          <p className="text-muted mb-8">Chào mừng trở lại hệ sinh thái nông nghiệp số</p>

          {/* Method toggle */}
          <div className="flex bg-surface-strong rounded-lg p-1 mb-6">
            {(["password", "otp"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                  method === m
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                {m === "password" ? "Mật khẩu" : "OTP điện thoại"}
              </button>
            ))}
          </div>

          <form className="flex flex-col gap-4">
            <Input
              label="Số điện thoại"
              type="tel"
              placeholder="0901 234 567"
              leftIcon={<Phone size={16} />}
            />

            {method === "password" ? (
              <Input
                label="Mật khẩu"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                leftIcon={<Lock size={16} />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
            ) : (
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    label="Mã OTP"
                    type="text"
                    placeholder="Nhập mã 6 số"
                    maxLength={6}
                  />
                </div>
                <div className="self-end">
                  <Button variant="secondary" size="sm" className="h-12 whitespace-nowrap">
                    Gửi OTP
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-primary w-4 h-4 rounded" />
                <span className="text-muted">Ghi nhớ đăng nhập</span>
              </label>
              <Link href="/auth/forgot-password" className="text-primary hover:underline font-medium">
                Quên mật khẩu?
              </Link>
            </div>

            <Button size="lg" className="mt-2 w-full">
              Đăng nhập <ArrowRight size={18} />
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Chưa có tài khoản?{" "}
            <Link href="/auth/register" className="text-primary font-semibold hover:underline">
              Đăng ký miễn phí
            </Link>
          </p>

          <div className="mt-8 p-4 bg-surface-green rounded-xl border border-primary-light">
            <p className="text-xs text-muted text-center leading-relaxed">
              🔒 Thông tin đăng nhập được mã hóa SSL. AgriLink không lưu trữ mật khẩu dạng plaintext và tuân thủ PDPA Việt Nam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
