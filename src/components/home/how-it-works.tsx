"use client";

import { useState } from "react";
import {
  Sprout, ShoppingBag, Factory, Building2,
  UserPlus, Camera, PhoneCall,
  Search, QrCode, Truck,
  ClipboardList, BarChart3, Handshake,
  Users, Package, Globe,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  step: string;
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface RoleData {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  steps: Step[];
}

const GREEN = { color: "#2D6A4F", bg: "#F0FFF4", border: "#52B788" };

const ROLES: Record<string, RoleData> = {
  farmer: {
    label: "Nông dân",
    icon: Sprout,
    ...GREEN,
    steps: [
      {
        step: "01",
        icon: UserPlus,
        title: "Đăng ký miễn phí",
        desc: "Tạo tài khoản nông dân bằng số điện thoại. Xác thực OTP trong 30 giây. Miễn phí 12 tháng đầu.",
      },
      {
        step: "02",
        icon: Camera,
        title: "Đăng sản phẩm",
        desc: "Chụp ảnh, nhập thông tin canh tác, chứng nhận VietGAP/hữu cơ. Lên sàn trong 5 phút.",
      },
      {
        step: "03",
        icon: PhoneCall,
        title: "Nhận liên hệ & bán hàng",
        desc: "Người mua liên hệ trực tiếp qua nền tảng. Thỏa thuận giá, giao hàng không qua trung gian.",
      },
    ],
  },
  buyer: {
    label: "Người mua",
    icon: ShoppingBag,
    ...GREEN,
    steps: [
      {
        step: "01",
        icon: UserPlus,
        title: "Tạo tài khoản",
        desc: "Đăng ký tài khoản người mua. Thiết lập nhu cầu mua hàng, vùng địa lý và loại nông sản.",
      },
      {
        step: "02",
        icon: Search,
        title: "Tìm kiếm & lọc",
        desc: "Tìm theo vùng, loại canh tác, chứng nhận, giá. Xem ảnh và thông tin chi tiết từng nông trại.",
      },
      {
        step: "03",
        icon: QrCode,
        title: "Liên hệ & truy xuất",
        desc: "Liên hệ người bán trực tiếp. Quét QR xem nguồn gốc đầy đủ từ hạt giống đến thu hoạch.",
      },
    ],
  },
  enterprise: {
    label: "Doanh nghiệp",
    icon: Factory,
    ...GREEN,
    steps: [
      {
        step: "01",
        icon: ClipboardList,
        title: "Đăng ký & xác minh",
        desc: "Đăng ký tài khoản doanh nghiệp với MST. Được xác minh và mở giao diện B2B chuyên biệt.",
      },
      {
        step: "02",
        icon: BarChart3,
        title: "Tìm vùng nguyên liệu",
        desc: "Bản đồ GIS 34 tỉnh thành, AI dự báo sản lượng 4–8 tuần. Tìm nguồn hàng ổn định dài hạn.",
      },
      {
        step: "03",
        icon: Handshake,
        title: "Kết nối & ký hợp đồng",
        desc: "Liên hệ HTX hoặc hộ nông dân, đàm phán và ký hợp đồng điện tử ngay trên nền tảng.",
      },
    ],
  },
  cooperative: {
    label: "HTX",
    icon: Building2,
    ...GREEN,
    steps: [
      {
        step: "01",
        icon: Users,
        title: "Số hóa HTX",
        desc: "Đăng ký HTX, nhập danh sách thành viên. Dashboard tổng hợp sản lượng và thu nhập tự động.",
      },
      {
        step: "02",
        icon: Package,
        title: "Gom hàng tập thể",
        desc: "Kết hợp sản phẩm từ nhiều hộ thành lô lớn. Tăng lợi thế đàm phán với doanh nghiệp.",
      },
      {
        step: "03",
        icon: Globe,
        title: "Kết nối thị trường lớn",
        desc: "Tiếp cận siêu thị, nhà máy chế biến, nhà nhập khẩu. Hỗ trợ kiểm tra tiêu chuẩn xuất khẩu.",
      },
    ],
  },
};

const ROLE_KEYS = ["farmer", "buyer", "enterprise", "cooperative"] as const;

export function HowItWorks() {
  const [active, setActive] = useState<keyof typeof ROLES>("farmer");
  const role = ROLES[active];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-ink mb-3">Hoạt động như thế nào?</h2>
        <p className="text-muted text-sm">Chọn vai trò để xem hướng dẫn phù hợp</p>
      </div>

      {/* Role tabs */}
      <div className="flex justify-center gap-2 flex-wrap mb-12">
        {ROLE_KEYS.map((key) => {
          const r = ROLES[key];
          const RIcon = r.icon;
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200"
              style={
                isActive
                  ? { background: r.bg, borderColor: r.border, color: r.color, boxShadow: `0 0 0 3px ${r.border}30` }
                  : { background: "white", borderColor: "#E5E7EB", color: "#6B7280" }
              }
            >
              <RIcon size={15} />
              {r.label}
            </button>
          );
        })}
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Connector line (desktop) */}
        <div
          className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px"
          style={{ background: `linear-gradient(to right, ${role.border}60, ${role.border}20, ${role.border}60)` }}
        />

        {role.steps.map(({ step, icon: StepIcon, title, desc }) => (
          <div key={step} className="flex flex-col items-center text-center relative">
            {/* Step circle */}
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300"
              style={{ background: role.bg, border: `2px solid ${role.border}` }}
            >
              <StepIcon size={28} style={{ color: role.color }} />
              {/* Step badge */}
              <span
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center"
                style={{ background: role.color }}
              >
                {step}
              </span>
            </div>
            <h3 className="text-base font-bold text-ink mb-2">{title}</h3>
            <p className="text-sm text-muted leading-relaxed max-w-xs">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
