"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Leaf, Mail, Lock, Eye, EyeOff, ArrowRight,
  ChevronRight, ShieldCheck, Loader2, CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors/get-error-message";

/* ─── Types ─── */
type Method = "password" | "otp";
type OtpStep = "idle" | "sent" | "verified";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  /* form state */
  const [method, setMethod] = useState<Method>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpStep, setOtpStep] = useState<OtpStep>("idle");
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);



  /* OTP countdown */
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ── Handlers ── */
  const handleSendOtp = async () => {
    if (!email.includes("@")) { setError("Vui lòng nhập email hợp lệ."); return; }
    setError("");
    try {
      setLoading(true);
      await api.post("/auth/send-otp", {
        target: email.trim().toLowerCase(),
        purpose: "login",
        type: "email",
      });
      setOtpStep("sent");
      setCountdown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Lỗi kết nối máy chủ"));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpKey = (i: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otpDigits];
    if (value.length > 1) {
      // paste
      value.slice(0, 6).split("").forEach((c, j) => { if (i + j < 6) next[i + j] = c; });
      setOtpDigits(next);
      otpRefs.current[Math.min(i + value.length, 5)]?.focus();
      return;
    }
    next[i] = value;
    setOtpDigits(next);
    if (value && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpBackspace = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const credential = method === "password" ? password : otpDigits.join("");
    const result = await login(email, credential, method);

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push(result.dashboard), 900);
    }
  }

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-surface-soft flex overflow-hidden">

      {/* ══════════════════════════════════════
          LEFT  —  Brand / Visual Panel
          ══════════════════════════════════════ */}
      <div className="hidden lg:flex w-[480px] xl:w-[540px] shrink-0 relative flex-col overflow-hidden">
        {/* Background image */}
        <Image
          src="https://images.pexels.com/photos/2382665/pexels-photo-2382665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Ruộng bậc thang Việt Nam"
          fill
          priority
          sizes="(min-width: 1280px) 540px, 480px"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ animation: "heroKenBurns 30s ease-in-out infinite alternate" }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2219]/95 via-[#1B4332]/50 to-[#2D6A4F]/20" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10 xl:p-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/25 transition-colors">
              <Leaf size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">AgriLink</span>
          </Link>

          {/* Middle spacer */}
          <div className="flex-1" />

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-4 mb-10"
            style={{ animation: "heroFadeUp 0.7s ease backwards" }}
          >
            {[["10,000+", "Nông dân"], ["34", "Tỉnh thành"], ["500+", "HTX"]].map(([n, l]) => (
              <div key={l} className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-white">{n}</div>
                <div className="text-white/60 text-xs mt-0.5">{l}</div>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div style={{ animation: "heroFadeUp 0.7s ease 0.2s backwards" }}>
            <div className="inline-flex items-center gap-2 bg-primary-ultra-light/20 border border-primary-ultra-light/40 rounded-full px-3.5 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-ultra-light animate-pulse" />
              <span className="text-primary-ultra-light text-xs font-semibold tracking-wide">Nền tảng Nông nghiệp Số #1 Việt Nam</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-snug mb-4">
              Kết nối Nông nghiệp,<br />Kiến tạo Tương lai
            </h2>
            <blockquote className="text-white/75 text-sm leading-relaxed border-l-2 border-primary-light pl-4 mb-5">
              &ldquo;Lần đầu tiên tôi biết giá xoài thực sự là bao nhiêu — và tôi bán được giá gấp đôi thương lái trả.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">N</div>
              <div>
                <p className="text-white text-sm font-semibold">Nguyễn Văn Hùng</p>
                <p className="text-white/55 text-xs">Nông dân, Tiền Giang</p>
              </div>
            </div>
          </div>

          <p className="text-white/35 text-xs mt-10">© 2025 AgriLink Vietnam</p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT  —  Form Panel
          ══════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div
          className="w-full max-w-md"
          style={{ animation: "heroFadeUp 0.6s ease backwards" }}
        >
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-primary">AgriLink</span>
          </Link>

          {/* ── Success State ── */}
          {success ? (
            <div
              className="bg-white rounded-3xl card-shadow p-10 text-center"
              style={{ animation: "heroFadeUp 0.4s ease" }}
            >
              <div className="w-20 h-20 rounded-full bg-primary-ultra-light flex items-center justify-center mx-auto mb-5"
                style={{ animation: "heroFadeUp 0.5s cubic-bezier(0.68,-0.55,0.27,1.55)" }}>
                <CheckCircle2 size={40} className="text-primary" />
              </div>
              <h2 className="text-2xl font-extrabold text-ink mb-2">Đăng nhập thành công!</h2>
              <p className="text-muted text-sm mb-6">Đang chuyển hướng đến trang quản lý...</p>
              <div className="flex justify-center">
                <Loader2 size={20} className="animate-spin text-primary" />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl card-shadow p-8 sm:p-10">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-ink mb-1.5">Đăng nhập</h1>
                <p className="text-muted text-sm">Chào mừng trở lại hệ sinh thái nông nghiệp số</p>
              </div>

              {/* Method toggle */}
              <div className="flex bg-surface-strong rounded-xl p-1 mb-7">
                {(["password", "otp"] as Method[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setMethod(m); setError(""); setOtpStep("idle"); }}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${method === m
                      ? "bg-white text-primary shadow-sm"
                      : "text-muted hover:text-ink"
                      }`}
                  >
                    {m === "password" ? "  Mật khẩu" : "  OTP Email"}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {/* Email */}
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail size={16} />}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  required
                />

                {/* Password method */}
                {method === "password" && (
                  <Input
                    label="Mật khẩu"
                    type={showPwd ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    leftIcon={<Lock size={16} />}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    rightIcon={
                      <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-muted hover:text-ink transition-colors">
                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                    required
                  />
                )}

                {/* OTP method */}
                {method === "otp" && (
                  <div className="space-y-4">
                    {otpStep === "idle" && (
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full border-primary text-primary hover:bg-surface-green bg-transparent border-2"
                        onClick={handleSendOtp}
                      >
                        Gửi mã OTP <ChevronRight size={16} />
                      </Button>
                    )}

                    {otpStep === "sent" && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-ink">Mã OTP (6 chữ số)</label>
                          {countdown > 0 ? (
                            <span className="text-xs text-muted font-mono">Gửi lại sau {fmt(countdown)}</span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="text-xs text-primary font-semibold hover:underline"
                            >
                              Gửi lại mã
                            </button>
                          )}
                        </div>
                        {/* 6-box OTP */}
                        <div className="flex gap-2">
                          {otpDigits.map((d, i) => (
                            <input
                              key={i}
                              ref={(el) => { otpRefs.current[i] = el; }}
                              type="text"
                              inputMode="numeric"
                              maxLength={6}
                              value={d}
                              onChange={(e) => handleOtpKey(i, e.target.value)}
                              onKeyDown={(e) => handleOtpBackspace(i, e)}
                              className={`flex-1 min-w-0 w-full h-12 text-center text-lg font-bold rounded-xl border-2 bg-white text-ink focus:outline-none transition-all duration-150 ${d
                                ? "border-primary bg-surface-green scale-105"
                                : "border-hairline focus:border-primary focus:bg-surface-green focus:scale-105"
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div
                    className="flex items-start gap-2 text-sm text-error bg-[#FEE2E2] px-3.5 py-3 rounded-xl"
                    style={{ animation: "heroFadeUp 0.2s ease" }}
                  >
                    <span className="shrink-0 mt-0.5">⚠️</span>
                    {error}
                  </div>
                )}

                {/* Remember / Forgot */}
                {method === "password" && (
                  <div className="flex justify-end text-sm">
                    <Link href="/auth/forgot-password" className="text-primary hover:underline font-medium">
                      Quên mật khẩu?
                    </Link>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || (method === "otp" && otpDigits.join("").length < 6)}
                  className="w-full h-12 mt-1 rounded-xl bg-primary hover:bg-primary-active disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-sm"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>Đăng nhập <ArrowRight size={16} /></>
                  )}
                </button>
              </form>

              {/* Register link */}
              <p className="text-center text-sm text-muted mt-6">
                Chưa có tài khoản?{" "}
                <Link href="/auth/register" className="text-primary font-semibold hover:underline">
                  Đăng ký miễn phí
                </Link>
              </p>

              {/* Security note */}
              <div className="mt-5 flex items-center gap-2 bg-surface-green rounded-xl px-4 py-3 border border-primary-light">
                <ShieldCheck size={16} className="text-primary shrink-0" />
                <p className="text-xs text-muted leading-relaxed">
                  Thông tin được mã hóa SSL. AgriLink tuân thủ PDPA Việt Nam.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
