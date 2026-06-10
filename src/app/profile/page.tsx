"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  User, Phone, Mail, MapPin, FileText, Bell, Shield,
  Camera, Check, ChevronRight, Star, Package, ShoppingBag, ShieldCheck,
  Loader2, CheckCircle2, AlertCircle, Sprout, Ruler, X, Plus,
  Lock, Eye, EyeOff, Monitor, Award, ImageIcon,
} from "lucide-react";
import { useAuth, ROLE_LABELS } from "@/lib/auth-context";
import { AdBanner } from "@/components/ads/ad-banner";
import { ImageCropperModal } from "@/components/shared/ImageCropperModal";
import { useAuthStore } from "@/store/authStore";
import { vietnamProvinces } from "@/lib/vietnam-provinces";

/* ── helpers ──────────────────────────────────── */

const SELECT_CLASS =
  "w-full h-11 px-3.5 rounded-lg border border-border-strong bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-ink";

function SectionCard({ title, subtitle, icon: Icon, children }: {
  title: string; subtitle?: string; icon?: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-hairline card-shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-hairline bg-surface-soft flex items-center gap-3">
        {Icon && <div className="w-8 h-8 rounded-lg bg-primary-ultra-light flex items-center justify-center shrink-0"><Icon size={16} className="text-primary" /></div>}
        <div>
          <h2 className="text-sm font-bold text-ink">{title}</h2>
          {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function StatusBanner({ status, msg }: { status: "success" | "error" | "idle" | "saving"; msg: string }) {
  if (!msg) return null;
  return (
    <div className={cn(
      "flex items-center gap-2 text-sm px-4 py-3 rounded-xl mb-5",
      status === "success"
        ? "bg-surface-green text-primary border border-primary/20"
        : "bg-[#FEE2E2] text-error border border-error/20"
    )}>
      {status === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
      {msg}
    </div>
  );
}

function HelpTooltip({ text }: { text: string }) {
  return (
    <span className="relative group/tip inline-flex items-center ml-1">
      <span className="w-4 h-4 rounded-full bg-muted/20 hover:bg-primary/20 text-muted hover:text-primary flex items-center justify-center text-[10px] font-bold cursor-help transition-colors select-none">?</span>
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-ink text-white text-[11px] leading-snug rounded-lg px-3 py-2 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 z-50 shadow-lg whitespace-normal text-center">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink" />
      </span>
    </span>
  );
}

const TABS = [
  { id: "profile",       label: "Hồ sơ cá nhân",  icon: User },
  { id: "documents",     label: "Giấy tờ & KYC",   icon: FileText },
  { id: "notifications", label: "Thông báo",        icon: Bell },
  { id: "security",      label: "Bảo mật",          icon: Shield },
];

type SaveStatus = "idle" | "saving" | "success" | "error";

interface CertItem {
  id: string;
  name: string;
  note: string;
  imageUrl: string;
}

/* ═══════════════════════════════════════════════ */
export default function ProfilePage() {
  const [activeTab, setActiveTab]                       = useState("profile");
  const [selectedImageForCrop, setSelectedImageForCrop] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar]       = useState(false);
  const { user } = useAuth();

  /* personal */
  const [fullName, setFullName]     = useState("");
  const [email, setEmail]           = useState("");
  const [province, setProvince]     = useState("");
  const [address, setAddress]       = useState("");
  const [bio, setBio]               = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveMsg, setSaveMsg]       = useState("");

  /* notifications */
  const [notifToggles, setNotifToggles] = useState({
    new_order: true, price_alert: true, product_approved: true,
    new_message: true, newsletter: false, promotions: false,
  });

  /* farm */
  const [farmName, setFarmName]               = useState("");
  const [farmArea, setFarmArea]               = useState("");
  const [farmingType, setFarmingType]         = useState("");
  const [region, setRegion]                   = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [farmPhone, setFarmPhone]             = useState("");
  const [certifications, setCertifications]   = useState<CertItem[]>([]);
  const [certName, setCertName]               = useState("");
  const [certNote, setCertNote]               = useState("");
  const [certImageUrl, setCertImageUrl]       = useState("");
  const [certImageUploading, setCertImageUploading] = useState(false);
  const [farmSaveStatus, setFarmSaveStatus]   = useState<SaveStatus>("idle");
  const [farmSaveMsg, setFarmSaveMsg]         = useState("");

  /* security */
  const [currentPwd, setCurrentPwd]   = useState("");
  const [newPwd, setNewPwd]           = useState("");
  const [showNewPwd, setShowNewPwd]   = useState(false);
  const [confirmPwd, setConfirmPwd]   = useState("");
  const [pwdStatus, setPwdStatus]     = useState<SaveStatus>("idle");
  const [pwdMsg, setPwdMsg]           = useState("");

  useEffect(() => {
    if (!user) return;
    setFullName((user as any).fullName ?? (user as any).full_name ?? "");
    setEmail(user.email ?? "");
    setProvince((user as any).province ?? "");
    setAddress((user as any).address ?? "");
    setBio((user as any).bio ?? "");
    const fp = (user as any).farmerProfile;
    if (fp) {
      setFarmName(fp.farmName ?? "");
      setFarmArea(fp.farmAreaHectares != null ? String(fp.farmAreaHectares) : "");
      setFarmingType(fp.farmingType ?? "");
      setRegion(fp.region ?? "");
      setExperienceYears(fp.experienceYears != null ? String(fp.experienceYears) : "");
      setFarmPhone(fp.phoneNumber ?? "");
      const raw = fp.certifications ?? [];
      setCertifications(raw.map((c: any) =>
        typeof c === "string"
          ? { id: c, name: c, note: "", imageUrl: "" }
          : c
      ));
    }
  }, [user]);

  const userName      = fullName || user?.phone || "Người dùng";
  const userRoleLabel = user ? ROLE_LABELS[user.role] : "Khách";
  const isFarmer      = user?.role === "farmer";
  const isCooperative = user?.role === "cooperative";
  const isEnterprise  = user?.role === "enterprise";
  const backendUrl    = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
  const getToken      = () => useAuthStore.getState().accessToken;
  const avatarUrl     = (user as any)?.avatarUrl ?? (user as any)?.avatar_url;

  /* avatar */
  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImageForCrop(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!user) return;
    setIsUploadingAvatar(true);
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append("file", croppedBlob, "avatar.jpg");
      formData.append("type", "avatar_" + user.role);
      const uploadRes  = await fetch(`${backendUrl}/api/v1/storage/images/upload`, {
        method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body: formData,
      });
      const uploadJson = await uploadRes.json();
      const secureUrl  = uploadJson.data?.secure_url ?? uploadJson.secure_url;
      if (!uploadRes.ok || !secureUrl) throw new Error(uploadJson.message ?? "Upload thất bại");
      const updateRes  = await fetch(`${backendUrl}/api/v1/users/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ avatarUrl: secureUrl }),
      });
      if (!updateRes.ok) throw new Error("Lỗi lưu avatar");
      const updateJson = await updateRes.json();
      useAuthStore.getState().setAuth(token as string, updateJson.data);
      setSelectedImageForCrop(null);
    } catch (e: any) {
      setSaveMsg(`Lỗi upload avatar: ${e.message}`);
      setSaveStatus("error");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  /* save personal */
  const handleSaveProfile = async () => {
    setSaveStatus("saving"); setSaveMsg("");
    try {
      const token = getToken();
      const res   = await fetch(`${backendUrl}/api/v1/users/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ fullName, email, province, address, bio }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Lưu thất bại");
      useAuthStore.getState().setAuth(token as string, json.data ?? json);
      setSaveStatus("success"); setSaveMsg("Đã lưu thay đổi");
    } catch (e: any) {
      setSaveStatus("error"); setSaveMsg(e.message ?? "Lỗi kết nối");
    } finally {
      setTimeout(() => { setSaveStatus("idle"); setSaveMsg(""); }, 3000);
    }
  };

  /* save farm */
  const handleSaveFarm = async () => {
    setFarmSaveStatus("saving"); setFarmSaveMsg("");
    try {
      const token = getToken();
      const body: Record<string, any> = {};
      if (farmName)              body.farmName         = farmName;
      if (farmArea)              body.farmAreaHectares = parseFloat(farmArea);
      if (farmingType)           body.farmingType      = farmingType;
      if (region)                body.region           = region;
      if (experienceYears)       body.experienceYears  = parseInt(experienceYears, 10);
      if (farmPhone)             body.phoneNumber      = farmPhone;
      if (certifications.length) body.certifications = certifications.map(({ name, note, imageUrl }) => ({ name, note, imageUrl }));
      const res  = await fetch(`${backendUrl}/api/v1/profiles/farmer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Lưu thất bại");
      setFarmSaveStatus("success"); setFarmSaveMsg("Đã lưu thông tin nông trại");
    } catch (e: any) {
      setFarmSaveStatus("error"); setFarmSaveMsg(e.message ?? "Lỗi kết nối");
    } finally {
      setTimeout(() => { setFarmSaveStatus("idle"); setFarmSaveMsg(""); }, 3000);
    }
  };

  const addCert = () => {
    const name = certName.trim();
    if (!name) return;
    setCertifications(prev => [...prev, { id: Date.now().toString(), name, note: certNote.trim(), imageUrl: certImageUrl.trim() }]);
    setCertName(""); setCertNote(""); setCertImageUrl("");
  };

  const handleCertImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCertImageUploading(true);
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("type", "cert_doc");
      const res  = await fetch(`${backendUrl}/api/v1/storage/images/upload`, {
        method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body: formData,
      });
      const json = await res.json();
      const url  = json.data?.secure_url ?? json.secure_url;
      if (!res.ok || !url) throw new Error(json.message ?? "Upload thất bại");
      setCertImageUrl(url);
    } catch {
      /* silent — user can still add cert without image */
    } finally {
      setCertImageUploading(false);
      e.target.value = "";
    }
  };

  /* change password */
  const handleChangePwd = async () => {
    if (newPwd !== confirmPwd) { setPwdStatus("error"); setPwdMsg("Mật khẩu xác nhận không khớp"); return; }
    if (newPwd.length < 8)     { setPwdStatus("error"); setPwdMsg("Mật khẩu tối thiểu 8 ký tự"); return; }
    setPwdStatus("saving"); setPwdMsg("");
    try {
      const token = getToken();
      const res   = await fetch(`${backendUrl}/api/v1/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Đổi mật khẩu thất bại");
      setPwdStatus("success"); setPwdMsg("Đổi mật khẩu thành công");
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    } catch (e: any) {
      setPwdStatus("error"); setPwdMsg(e.message ?? "Lỗi kết nối");
    } finally {
      setTimeout(() => { setPwdStatus("idle"); setPwdMsg(""); }, 3000);
    }
  };

  /* ── RENDER ─────────────────────────────────── */
  return (
    <div className="min-h-screen bg-surface-soft">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ══ PROFILE HEADER ══ */}
        <div className="bg-white rounded-2xl border border-hairline card-shadow mb-8 overflow-hidden">
          {/* Cover */}
          <div className="hero-gradient h-36 relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
            />
          </div>

          <div className="px-6 sm:px-8 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-2xl border-4 border-white bg-primary-light flex items-center justify-center text-white text-3xl font-bold shadow-md overflow-hidden">
                  {avatarUrl
                    ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    : <span>{userName.charAt(0).toUpperCase()}</span>
                  }
                </div>
                <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary hover:bg-primary-active rounded-full flex items-center justify-center text-white cursor-pointer shadow transition-colors">
                  <Camera size={13} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarSelect} />
                </label>
              </div>

              {/* Name / badges */}
              <div className="flex-1 min-w-0 sm:pb-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl font-extrabold text-ink">{userName}</h1>
                  {(user as any)?.isKycVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-surface-green border border-primary/20 px-2 py-0.5 rounded-full">
                      <ShieldCheck size={11} /> Đã xác thực
                    </span>
                  )}
                  <span className="inline-flex items-center text-[11px] font-semibold text-white bg-primary px-2.5 py-0.5 rounded-full">
                    {userRoleLabel}
                  </span>
                </div>
                <p className="text-sm text-muted flex items-center gap-1">
                  <MapPin size={13} className="text-primary shrink-0" />
                  {province || (user as any)?.province || "Chưa cập nhật địa chỉ"}
                </p>
              </div>

              {/* Stats row */}
              <div className="hidden sm:flex items-center divide-x divide-hairline border border-hairline rounded-xl overflow-hidden bg-surface-soft shrink-0">
                {[
                  { value: (user as any)?.trustScore ?? "—", sub: "Điểm tin cậy", icon: Star,        color: "text-yellow-500" },
                  { value: (user as any)?.totalProducts ?? "—", sub: "Sản phẩm",  icon: Package,     color: "text-primary" },
                  { value: (user as any)?.totalSales ?? "—",    sub: "Đơn hàng",  icon: ShoppingBag, color: "text-primary" },
                ].map(({ value, sub, icon: Icon, color }) => (
                  <div key={sub} className="px-5 py-3 text-center">
                    <div className={cn("flex items-center justify-center gap-1 font-extrabold text-lg leading-tight", color)}>
                      <Icon size={15} /> {value}
                    </div>
                    <p className="text-[10px] text-muted mt-0.5 whitespace-nowrap">{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile stats */}
            <div className="flex sm:hidden gap-3">
              {[
                { value: (user as any)?.trustScore ?? "—", sub: "Tin cậy", icon: Star },
                { value: (user as any)?.totalProducts ?? "—", sub: "Sản phẩm", icon: Package },
                { value: (user as any)?.totalSales ?? "—", sub: "Đơn hàng", icon: ShoppingBag },
              ].map(({ value, sub, icon: Icon }) => (
                <div key={sub} className="flex-1 bg-surface-soft rounded-xl p-3 text-center border border-hairline">
                  <div className="flex items-center justify-center gap-1 font-bold text-base text-primary"><Icon size={13} />{value}</div>
                  <p className="text-[10px] text-muted mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ BODY GRID ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_200px] gap-6 items-start">

          {/* ── Left column: nav + ad ── */}
          <div className="flex flex-col gap-4 sticky top-6">
            <nav className="bg-white rounded-2xl border border-hairline card-shadow p-2">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left group",
                    activeTab === id
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted hover:text-ink hover:bg-surface-soft"
                  )}
                >
                  <Icon size={16} className={activeTab === id ? "text-white" : "text-muted group-hover:text-primary transition-colors"} />
                  <span className="flex-1">{label}</span>
                  {activeTab === id && <ChevronRight size={14} className="text-white/70" />}
                </button>
              ))}
            </nav>

            {/* Left ad */}
            <div className="hidden lg:block">
              <p className="text-[9px] text-muted uppercase tracking-widest mb-2 px-0.5">Dành cho bạn</p>
              <AdBanner slotId="profile-sidebar" index={3} />
            </div>
          </div>

          {/* ── Tab content ── */}
          <div className="flex flex-col gap-5 min-w-0">

            {/* ─── PROFILE TAB ─── */}
            {activeTab === "profile" && (<>

              <SectionCard title="Thông tin tài khoản" subtitle="Tên, liên hệ và địa chỉ cá nhân" icon={User}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-sm font-medium text-ink mb-1.5 flex items-center">Họ và tên / Tên tổ chức<HelpTooltip text="Tên hiển thị công khai trên hồ sơ và các giao dịch của bạn." /></label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} leftIcon={<User size={15} />} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-ink mb-1.5 flex items-center">Số điện thoại<HelpTooltip text="Dùng để đăng nhập và xác minh tài khoản. Không thể thay đổi sau khi đăng ký." /></label>
                    <Input value={user?.phone ?? ""} leftIcon={<Phone size={15} />} disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-ink mb-1.5 flex items-center">Email<HelpTooltip text="Nhận thông báo đơn hàng, cập nhật giá và tin tức từ AgriLink." /></label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail size={15} />} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-ink mb-1.5 flex items-center">Tỉnh thành<HelpTooltip text="Dùng để khớp với người mua và nhà vận chuyển gần bạn nhất." /></label>
                    <select value={province} onChange={(e) => setProvince(e.target.value)} className={SELECT_CLASS}>
                      <option value="">— Chọn tỉnh thành —</option>
                      {vietnamProvinces.map((p) => (
                        <option key={p.code} value={p.nameVi}>{p.nameVi}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-ink mb-1.5 flex items-center">Địa chỉ chi tiết<HelpTooltip text="Số nhà, đường, xã/phường — hiển thị cho người mua khi xem hồ sơ nông trại." /></label>
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} leftIcon={<MapPin size={15} />} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-ink mb-1.5 flex items-center">Giới thiệu bản thân<HelpTooltip text="Mô tả ngắn về bạn, kinh nghiệm và sản phẩm chủ lực. Hiển thị công khai trên trang nông trại." /></label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Mô tả ngắn về bạn hoặc tổ chức..."
                      className="w-full px-3.5 py-3 rounded-lg border border-border-strong bg-white text-sm resize-none outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-muted-soft"
                    />
                  </div>
                </div>
                <StatusBanner status={saveStatus} msg={saveMsg} />
                <div className="flex items-center gap-3">
                  <Button onClick={handleSaveProfile} disabled={saveStatus === "saving"}>
                    {saveStatus === "saving" ? <><Loader2 size={14} className="animate-spin" /> Đang lưu...</> : "Lưu thay đổi"}
                  </Button>
                  <span className="text-xs text-muted">Số điện thoại không thể thay đổi</span>
                </div>
              </SectionCard>

              {isFarmer && (
                <SectionCard title="Thông tin nông trại" subtitle="Hiển thị công khai tại trang /farm của bạn" icon={Sprout}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    <div>
                      <label className="text-sm font-medium text-ink mb-1.5 flex items-center">Tên nông trại<HelpTooltip text="Tên thương hiệu nông trại hiển thị trên marketplace và trang hồ sơ công khai." /></label>
                      <Input value={farmName} onChange={(e) => setFarmName(e.target.value)} leftIcon={<Sprout size={15} />} placeholder="VD: Nông trại Xanh Tiền Giang" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-ink mb-1.5 flex items-center">Diện tích (ha)<HelpTooltip text="Tổng diện tích đất canh tác tính bằng hecta. Giúp người mua đánh giá sản lượng có thể cung cấp." /></label>
                      <Input value={farmArea} onChange={(e) => setFarmArea(e.target.value.replace(/[^0-9.]/g, ""))} leftIcon={<Ruler size={15} />} placeholder="VD: 4.5" inputMode="decimal" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-ink mb-1.5 flex items-center">Hình thức canh tác<HelpTooltip text="Tiêu chuẩn sản xuất bạn đang áp dụng. Ảnh hưởng trực tiếp đến giá bán và độ tin cậy với người mua." /></label>
                      <select value={farmingType} onChange={(e) => setFarmingType(e.target.value)} className={SELECT_CLASS}>
                        <option value="">— Chọn hình thức —</option>
                        <option value="organic">🌿 Hữu cơ (Organic)</option>
                        <option value="vietgap">✅ VietGAP</option>
                        <option value="globalgap">🌍 GlobalGAP</option>
                        <option value="traditional">🌾 Truyền thống</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-ink mb-1.5 flex items-center">Vùng miền<HelpTooltip text="Vùng địa lý nơi nông trại hoạt động. Dùng để lọc sản phẩm theo vùng trên marketplace." /></label>
                      <select value={region} onChange={(e) => setRegion(e.target.value)} className={SELECT_CLASS}>
                        <option value="">— Chọn vùng —</option>
                        <option value="north">Miền Bắc</option>
                        <option value="central">Miền Trung</option>
                        <option value="south">Miền Nam</option>
                        <option value="highlands">Tây Nguyên</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-ink mb-1.5 flex items-center">Số năm kinh nghiệm<HelpTooltip text="Số năm bạn đã canh tác. Tăng độ tin cậy khi người mua đánh giá hồ sơ." /></label>
                      <Input value={experienceYears} onChange={(e) => setExperienceYears(e.target.value.replace(/\D/g, ""))} placeholder="VD: 15" inputMode="numeric" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-ink mb-1.5 flex items-center">SĐT liên hệ nông trại<HelpTooltip text="Số điện thoại riêng của nông trại, hiển thị cho người mua muốn liên hệ trực tiếp." /></label>
                      <Input value={farmPhone} onChange={(e) => setFarmPhone(e.target.value)} leftIcon={<Phone size={15} />} placeholder="VD: 0912 345 678" />
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="mb-5">
                    <label className="text-sm font-medium text-ink mb-3 flex items-center gap-2">
                      <Award size={15} className="text-primary" /> Chứng nhận canh tác<HelpTooltip text="Upload ảnh giấy chứng nhận kèm chú thích. Giúp người mua tin tưởng hơn về chất lượng sản phẩm." />
                    </label>

                    {/* Existing certs list */}
                    {certifications.length > 0 && (
                      <div className="flex flex-col gap-2 mb-4">
                        {certifications.map((cert) => (
                          <div key={cert.id} className="flex items-start gap-3 p-3 bg-surface-soft rounded-xl border border-hairline group">
                            {/* Thumbnail */}
                            <div className="w-14 h-14 rounded-lg border border-hairline overflow-hidden bg-white shrink-0 flex items-center justify-center">
                              {cert.imageUrl
                                ? <img src={cert.imageUrl} alt={cert.name} className="w-full h-full object-cover" />
                                : <ImageIcon size={20} className="text-muted/40" />
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <Check size={12} className="text-primary shrink-0" />
                                <span className="text-sm font-semibold text-ink truncate">{cert.name}</span>
                              </div>
                              {cert.note && <p className="text-xs text-muted leading-snug line-clamp-2">{cert.note}</p>}
                            </div>
                            <button
                              type="button"
                              onClick={() => setCertifications(prev => prev.filter(c => c.id !== cert.id))}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50 text-muted hover:text-error shrink-0"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add new cert form */}
                    <div className="border border-dashed border-border-strong rounded-xl p-4 bg-white">
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Thêm chứng nhận mới</p>
                      <div className="flex flex-col gap-3">
                        {/* Name */}
                        <input
                          value={certName}
                          onChange={(e) => setCertName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCert(); } }}
                          placeholder="Tên chứng nhận (VietGAP, Organic, OCOP 4 sao...)"
                          className="w-full h-10 px-3.5 rounded-lg border border-border-strong bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                        />
                        {/* Note */}
                        <input
                          value={certNote}
                          onChange={(e) => setCertNote(e.target.value)}
                          placeholder="Chú thích — đơn vị cấp, năm cấp, phạm vi áp dụng... (tuỳ chọn)"
                          className="w-full h-10 px-3.5 rounded-lg border border-border-strong bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                        />
                        {/* Image upload */}
                        <div className="flex items-center gap-3">
                          <label className="flex-1 flex items-center gap-2 h-10 px-3.5 rounded-lg border border-border-strong bg-white text-sm text-muted cursor-pointer hover:border-primary/40 hover:bg-surface-soft transition-colors overflow-hidden">
                            {certImageUploading
                              ? <><Loader2 size={14} className="animate-spin text-primary shrink-0" /><span className="text-xs text-primary">Đang tải ảnh...</span></>
                              : certImageUrl
                                ? <><img src={certImageUrl} alt="" className="w-6 h-6 rounded object-cover shrink-0" /><span className="text-xs text-primary truncate">Ảnh đã chọn</span></>
                                : <><Camera size={14} className="shrink-0" /><span className="text-xs truncate">Tải ảnh chứng nhận (tuỳ chọn)</span></>
                            }
                            <input type="file" className="hidden" accept="image/*" onChange={handleCertImageUpload} disabled={certImageUploading} />
                          </label>
                          {certImageUrl && (
                            <button type="button" onClick={() => setCertImageUrl("")} className="p-2 rounded-lg hover:bg-red-50 text-muted hover:text-error transition-colors">
                              <X size={14} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={addCert}
                            disabled={!certName.trim()}
                            className="h-10 px-4 bg-primary hover:bg-primary-active disabled:opacity-40 text-white text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
                          >
                            <Plus size={14} /> Thêm
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <StatusBanner status={farmSaveStatus} msg={farmSaveMsg} />
                  <Button onClick={handleSaveFarm} disabled={farmSaveStatus === "saving"}>
                    {farmSaveStatus === "saving" ? <><Loader2 size={14} className="animate-spin" /> Đang lưu...</> : "Lưu thông tin nông trại"}
                  </Button>
                </SectionCard>
              )}
            </>)}

            {/* ─── DOCUMENTS TAB ─── */}
            {activeTab === "documents" && (
              <SectionCard title="Giấy tờ & Xác thực danh tính" subtitle="KYC — Cần xác thực để đăng bán và nhận thanh toán" icon={FileText}>
                <div className="flex flex-col gap-3">
                  {[
                    ...(!isCooperative && !isEnterprise ? [{
                      label: "Căn cước công dân (CCCD)",
                      status: (user as any)?.isKycVerified ? "verified" : "not_uploaded",
                      date: (user as any)?.verifiedAt ? new Date((user as any).verifiedAt).toLocaleDateString("vi-VN") : undefined,
                    }] : []),
                    { label: "Địa chỉ / Trụ sở chính", status: (user as any)?.isKycVerified ? "verified" : "not_uploaded", date: undefined },
                    ...(isCooperative ? [{ label: "Giấy chứng nhận đăng ký HTX", status: (user as any)?.isVerified ? "verified" : "not_uploaded", date: undefined }] : []),
                    ...(isEnterprise  ? [{ label: "Giấy chứng nhận đăng ký doanh nghiệp", status: (user as any)?.isVerified ? "verified" : "not_uploaded", date: undefined }] : []),
                  ].map(({ label, status, date }: any) => (
                    <div key={label} className={cn(
                      "flex items-center justify-between px-4 py-3.5 rounded-xl border transition-colors",
                      status === "verified" ? "border-primary/20 bg-surface-green" : "border-hairline hover:bg-surface-soft"
                    )}>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                          status === "verified" ? "bg-primary text-white" :
                          status === "pending"  ? "bg-order-pending-bg text-order-pending-text" : "bg-surface-strong text-muted"
                        )}>
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink">{label}</p>
                          <p className="text-xs text-muted mt-0.5">
                            {status === "verified" ? `Đã xác thực${date ? ` · ${date}` : ""}` :
                             status === "pending"  ? "Đang chờ duyệt" : "Chưa tải lên"}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {status === "verified"     && <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary"><Check size={13} /> Xác thực</span>}
                        {status === "pending"      && <Badge variant="harvest">Đang duyệt</Badge>}
                        {status === "not_uploaded" && <Button size="sm" variant="secondary">Tải lên</Button>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl flex items-start gap-3">
                  <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Tài khoản cần xác thực KYC để đăng sản phẩm và nhận thanh toán. Quá trình xét duyệt mất 1–2 ngày làm việc.
                  </p>
                </div>
              </SectionCard>
            )}

            {/* ─── NOTIFICATIONS TAB ─── */}
            {activeTab === "notifications" && (
              <SectionCard title="Cài đặt thông báo" subtitle="Chọn loại thông báo bạn muốn nhận" icon={Bell}>
                <div className="flex flex-col divide-y divide-hairline">
                  {([
                    { key: "new_order",        label: "Đơn hàng mới",         desc: "Khi có người đặt mua sản phẩm của bạn",       important: true },
                    { key: "price_alert",       label: "Biến động giá ±10%",   desc: "Khi giá thị trường thay đổi đáng kể",         important: true },
                    { key: "product_approved",  label: "Sản phẩm được duyệt",  desc: "Khi Admin phê duyệt sản phẩm của bạn",        important: true },
                    { key: "new_message",       label: "Tin nhắn mới",          desc: "Khi có tin nhắn từ người mua",               important: true },
                    { key: "newsletter",        label: "Bản tin nông nghiệp",   desc: "Thông tin kỹ thuật và thị trường hàng tuần", important: false },
                    { key: "promotions",        label: "Khuyến mãi & Ưu đãi",  desc: "Gói Premium và tính năng mới",               important: false },
                  ] as { key: keyof typeof notifToggles; label: string; desc: string; important: boolean }[]).map(({ key, label, desc, important }) => (
                    <div key={key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-2 h-2 rounded-full shrink-0", important ? "bg-primary" : "bg-surface-strong")} />
                        <div>
                          <p className="text-sm font-semibold text-ink">{label}</p>
                          <p className="text-xs text-muted">{desc}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotifToggles(prev => ({ ...prev, [key]: !prev[key] }))}
                        aria-pressed={notifToggles[key]}
                        className={cn(
                          "relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ml-6",
                          notifToggles[key] ? "bg-primary" : "bg-surface-strong"
                        )}
                      >
                        <span className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200",
                          notifToggles[key] ? "left-6" : "left-1"
                        )} />
                      </button>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* ─── SECURITY TAB ─── */}
            {activeTab === "security" && (<>
              <SectionCard title="Đổi mật khẩu" subtitle="Dùng mật khẩu mạnh, tối thiểu 8 ký tự" icon={Lock}>
                <div className="max-w-sm flex flex-col gap-4">
                  <Input label="Mật khẩu hiện tại" type="password" placeholder="••••••••" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} />
                  <div>
                    <Input
                      label="Mật khẩu mới"
                      type={showNewPwd ? "text" : "password"}
                      placeholder="Tối thiểu 8 ký tự"
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
                      rightIcon={
                        <button type="button" onClick={() => setShowNewPwd(p => !p)} className="text-muted hover:text-ink transition-colors">
                          {showNewPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      }
                    />
                    {newPwd && (
                      <div className="flex gap-1 mt-2">
                        {[4, 7, 11].map((threshold, i) => (
                          <div key={i} className={cn("flex-1 h-1 rounded-full transition-colors",
                            newPwd.length >= threshold
                              ? i === 0 ? "bg-error" : i === 1 ? "bg-yellow-400" : "bg-primary"
                              : "bg-surface-strong"
                          )} />
                        ))}
                        <span className="text-[10px] text-muted ml-1">
                          {newPwd.length < 4 ? "Yếu" : newPwd.length < 8 ? "Trung bình" : "Mạnh"}
                        </span>
                      </div>
                    )}
                  </div>
                  <Input label="Xác nhận mật khẩu mới" type="password" placeholder="••••••••" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />

                  <StatusBanner status={pwdStatus} msg={pwdMsg} />

                  <Button onClick={handleChangePwd} disabled={pwdStatus === "saving" || !currentPwd || !newPwd || !confirmPwd} className="self-start">
                    {pwdStatus === "saving" ? <><Loader2 size={14} className="animate-spin" /> Đang lưu...</> : "Cập nhật mật khẩu"}
                  </Button>
                </div>
              </SectionCard>

              <SectionCard title="Phiên đăng nhập" subtitle="Quản lý thiết bị đang đăng nhập" icon={Monitor}>
                <div className="flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-surface-green">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
                      <Monitor size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">Thiết bị hiện tại</p>
                      <p className="text-xs text-muted">{province || "—"} · Đang hoạt động</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-white border border-primary/20 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Đang dùng
                  </span>
                </div>
                <p className="text-xs text-muted mt-3">Chức năng quản lý nhiều thiết bị sẽ sớm ra mắt.</p>
              </SectionCard>
            </>)}

          </div>

          {/* ── Right ad column ── */}
          <aside className="hidden lg:flex flex-col gap-4 sticky top-6">
            <div>
              <p className="text-[9px] text-muted uppercase tracking-widest mb-2 px-0.5">Gợi ý cho nông trại bạn</p>
              <AdBanner slotId="profile-sidebar" index={0} />
            </div>
            <AdBanner slotId="profile-sidebar" index={1} />
            <AdBanner slotId="profile-sidebar" index={2} />
          </aside>

        </div>

        {/* ══ BOTTOM BANNER AD ══ */}
        <div className="mt-8">
          <p className="text-[9px] text-muted uppercase tracking-widest mb-2">Quảng cáo</p>
          <AdBanner slotId="below-hero" index={0} />
        </div>

      </div>

      <Footer />

      {selectedImageForCrop && (
        <ImageCropperModal
          imageSrc={selectedImageForCrop}
          onClose={() => setSelectedImageForCrop(null)}
          onCropComplete={handleCropComplete}
          isUploading={isUploadingAvatar}
        />
      )}
    </div>
  );
}
