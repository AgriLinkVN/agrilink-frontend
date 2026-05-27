# AgriLink Vietnam — Frontend

> Hệ sinh thái số kết nối nông nghiệp Việt Nam — minh bạch, công bằng, bền vững.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## Mục lục

- [Tổng quan](#tổng-quan)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Cài đặt & Chạy](#cài-đặt--chạy)
- [Tài khoản demo](#tài-khoản-demo)
- [Các trang hiện có](#các-trang-hiện-có)
- [Design System](#design-system)
- [Quy trình làm việc với Git](#quy-trình-làm-việc-với-git)
- [Biến môi trường](#biến-môi-trường)

---

## Tổng quan

AgriLink Vietnam là nền tảng thương mại điện tử nông sản, kết nối **7 nhóm đối tượng**:

| Vai trò | Mô tả |
|---|---|
| Nông dân | Đăng bán sản phẩm, theo dõi giá thị trường |
| Hợp tác xã (HTX) | Quản lý thành viên, tạo lô hàng tập thể |
| Người mua | Tìm kiếm, đặt hàng nông sản sạch |
| Doanh nghiệp | Thu mua số lượng lớn, ký hợp đồng |
| Nhà cung cấp | Bán vật tư nông nghiệp, quảng cáo |
| Nhà nước | Giám sát thị trường, cập nhật giá |
| Logistics | Quản lý vận chuyển, theo dõi đơn hàng |

---

## Công nghệ sử dụng

| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| [Next.js](https://nextjs.org) | 15 (App Router) | Framework chính |
| [TypeScript](https://typescriptlang.org) | 5.x | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | v4 (`@theme inline`) | Styling |
| [Lucide React](https://lucide.dev) | Latest | Icons |
| [Recharts](https://recharts.org) | 2.x | Biểu đồ giá thị trường |
| [clsx / cn](https://github.com/dcastil/tailwind-merge) | — | Conditional classnames |

> **Lưu ý Tailwind v4**: Không có `tailwind.config.ts`. Toàn bộ design tokens khai báo trong `src/app/globals.css` dưới `@theme inline`.

---

## Cấu trúc dự án

```
agrilink-frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (lang="vi", metadata)
│   │   ├── globals.css               # Design tokens + base styles
│   │   ├── page.tsx                  # Landing page
│   │   ├── auth/
│   │   │   ├── login/page.tsx        # Đăng nhập (mock auth)
│   │   │   └── register/page.tsx     # Đăng ký
│   │   ├── marketplace/page.tsx      # Sàn nông sản
│   │   ├── prices/page.tsx           # Giá thị trường + biểu đồ
│   │   ├── trace/page.tsx            # Truy xuất nguồn gốc QR
│   │   └── dashboard/
│   │       ├── farmer/page.tsx       # Dashboard nông dân
│   │       ├── cooperative/page.tsx  # Dashboard HTX
│   │       ├── buyer/page.tsx        # Dashboard người mua
│   │       ├── enterprise/page.tsx   # Dashboard doanh nghiệp
│   │       ├── supplier/page.tsx     # Dashboard nhà cung cấp
│   │       ├── state/page.tsx        # Dashboard nhà nước
│   │       ├── logistics/page.tsx    # Dashboard logistics
│   │       └── admin/page.tsx        # Dashboard admin
│   ├── components/
│   │   ├── layout/
│   │   │   ├── navbar.tsx            # Navigation bar
│   │   │   └── footer.tsx            # Footer
│   │   └── ui/
│   │       ├── button.tsx            # Button (variants + asChild)
│   │       ├── input.tsx             # Input (label + icons)
│   │       ├── badge.tsx             # Badge (organic/vietgap/...)
│   │       └── card.tsx              # Card wrapper
│   └── lib/
│       └── utils.ts                  # cn() helper
├── DESIGN.md                         # Design system documentation
├── public/
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## Cài đặt & Chạy

### Yêu cầu

- Node.js **18+**
- npm hoặc yarn

### Lần đầu

```bash
git clone https://github.com/AgriLinkVN/agrilink-frontend.git
cd agrilink-frontend
npm install
npm run dev
```

Mở `http://localhost:3000`

### Các lệnh

```bash
npm run dev        # Dev server (Turbopack)
npm run build      # Production build
npm run start      # Chạy production build
npm run lint       # ESLint check
```

---

## Tài khoản demo

Trang đăng nhập có panel demo — click vào tên vai trò để tự điền thông tin.

| Vai trò | Số điện thoại | Mật khẩu | OTP |
|---|---|---|---|
| Nông dân | `0901111001` | `demo123` | `123456` |
| HTX | `0901111002` | `demo123` | `123456` |
| Người mua | `0901111003` | `demo123` | `123456` |
| Doanh nghiệp | `0901111004` | `demo123` | `123456` |
| Nhà cung cấp | `0901111005` | `demo123` | `123456` |
| Logistics | `0901111007` | `demo123` | `123456` |
| Admin | `0901111099` | `demo123` | `123456` |

> Mock auth — không có backend. Sau khi đăng nhập thành công, redirect thẳng đến dashboard theo vai trò.

---

## Các trang hiện có

| Route | Mô tả | Auth |
|---|---|---|
| `/` | Landing page | Public |
| `/auth/login` | Đăng nhập (password / OTP) | Public |
| `/auth/register` | Đăng ký tài khoản | Public |
| `/marketplace` | Sàn giao dịch nông sản | Public |
| `/prices` | Bảng giá + biểu đồ AreaChart | Public |
| `/trace` | Truy xuất nguồn gốc QR | Public |
| `/dashboard/farmer` | Dashboard nông dân | Auth |
| `/dashboard/cooperative` | Dashboard HTX | Auth |
| `/dashboard/buyer` | Dashboard người mua | Auth |
| `/dashboard/enterprise` | Dashboard doanh nghiệp | Auth |
| `/dashboard/supplier` | Dashboard nhà cung cấp | Auth |
| `/dashboard/state` | Dashboard nhà nước | Auth |
| `/dashboard/logistics` | Dashboard logistics | Auth |
| `/dashboard/admin` | Dashboard admin | Auth |

---

## Design System

Màu chủ đạo: **Forest Green `#2D6A4F`**. Xem đầy đủ trong [`DESIGN.md`](DESIGN.md).

### Màu sắc chính

```css
--color-primary:        #2D6A4F   /* Forest Green */
--color-primary-active: #1B4332
--color-primary-light:  #52B788
--color-accent:         #F4A261   /* Orange */
--color-harvest:        #FFB703   /* Amber */
--color-ink:            #1A1A1A
--color-muted:          #6B7280
```

### Components

```tsx
// Button
<Button variant="primary" | "secondary" | "accent" | "ghost" | "destructive" | "pill-primary" | "pill-outline">
<Button size="sm" | "md" | "lg" | "icon">
<Button loading={true}>          // Spinner state
<Button asChild><Link href="/x"> // Render as anchor

// Input
<Input label="Tên" leftIcon={<User />} rightIcon={<Eye />} />

// Badge
<Badge variant="organic" | "vietgap" | "globalgap" | "ocop" />
```

### Utilities CSS

```css
.hero-gradient      /* Linear gradient 135deg: #1B4332 → #2D6A4F → #52B788 */
.card-shadow        /* Airbnb-style elevation */
.card-shadow-hover  /* Hover lift animation */
.skeleton           /* Shimmer loading state */
```

---

## Quy trình làm việc với Git

### Nhánh

| Nhánh | Mục đích |
|---|---|
| `main` | Production — chỉ merge từ `develop` |
| `develop` | Integration — merge PR từ feature branches |
| `trungle2605` | Nhánh cá nhân của Trung Lê |

### Workflow

```bash
# Tạo feature branch từ develop
git checkout develop
git pull origin develop
git checkout -b feature/ten-tinh-nang

# Làm việc...
git add .
git commit -m "feat: mô tả thay đổi"
git push origin feature/ten-tinh-nang

# Tạo PR: feature/... → develop
# Sau review, merge vào develop
# Khi develop ổn định, merge develop → main
```

### Commit convention

```
feat:     Tính năng mới
fix:      Sửa bug
chore:    Cấu hình, dependencies
style:    Chỉnh CSS/UI không ảnh hưởng logic
refactor: Tái cấu trúc code
docs:     Cập nhật tài liệu
```

---

## Biến môi trường

Dự án hiện chưa cần `.env` (mock data). Khi tích hợp backend:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

---

## Liên hệ

- Email: hello@agrilink.vn
- Địa chỉ: Đà Nẵng, Việt Nam
- GitHub Org: [AgriLinkVN](https://github.com/AgriLinkVN)

---

> © 2025 AgriLink Vietnam. Dự án khởi nghiệp sinh viên.
