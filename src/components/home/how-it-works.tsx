import { Users, Package, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Đăng ký tài khoản",
    desc: "Chọn vai trò của bạn — nông dân, HTX, người mua, hay doanh nghiệp. Xác thực qua OTP điện thoại.",
    icon: Users,
  },
  {
    step: "02",
    title: "Đăng / Tìm nông sản",
    desc: "Nông dân đăng sản phẩm với đầy đủ thông tin. Người mua tìm kiếm theo vùng, loại, giá.",
    icon: Package,
  },
  {
    step: "03",
    title: "Kết nối & thỏa thuận",
    desc: "Liên hệ người bán, thỏa thuận giá cả và giao hàng trực tiếp. Không qua trung gian.",
    icon: ShieldCheck,
  },
];

export function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-ink mb-4">Hoạt động như thế nào?</h2>
        <p className="text-muted">Bắt đầu trong 3 bước đơn giản</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {STEPS.map(({ step, title, desc, icon: Icon }) => (
          <div key={step} className="text-center">
            <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-ultra-light border-2 border-primary-light mb-6">
              <Icon size={28} className="text-primary" />
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                {step}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-ink mb-3">{title}</h3>
            <p className="text-sm text-muted leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
