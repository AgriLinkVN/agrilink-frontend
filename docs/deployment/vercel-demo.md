# AgriLink Backend-Free Vercel Demo

## Mục tiêu

Triển khai frontend AgriLink lên Vercel để trình diễn mà không cần backend,
database, OTP provider, Cloudinary hoặc Supabase hoạt động. Demo Mode không
thay thế Real Mode và không tự được bật khi cấu hình backend sai.

## Yêu cầu

- Node.js 22.x.
- npm và lockfile của repository.
- Vercel project trỏ tới repository frontend.
- Không cần secret cho Demo Mode.

## Cấu hình Vercel

| Setting | Value |
| --- | --- |
| Framework Preset | Next.js |
| Node.js Version | 22.x |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | Next.js default |

Không cần `vercel.json`.

## Environment Variables

Đặt cho Preview và Production:

```env
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SITE_URL=https://<your-project>.vercel.app
NEXT_PUBLIC_P4_DATA_MODE=mock
```

Không đặt `NEXT_PUBLIC_API_URL` hoặc `NEXT_PUBLIC_BACKEND_URL` cho bản demo.
`NEXT_PUBLIC_MAPBOX_TOKEN`, Cloudinary và Sentry đều là tùy chọn; không commit
giá trị thật vào repository.

## Tài khoản Demo

Mật khẩu chung: `demo123`

| Vai trò | Email |
| --- | --- |
| Admin | `admin@agrilink.demo` |
| Nông dân | `farmer@agrilink.demo` |
| Hợp tác xã | `cooperative@agrilink.demo` |
| Doanh nghiệp | `enterprise@agrilink.demo` |
| Người mua | `buyer@agrilink.demo` |
| Nhà cung cấp | `supplier@agrilink.demo` |
| Logistics | `logistics@agrilink.demo` |

OTP đăng nhập demo: `123456`.

## Chức năng mô phỏng

- Đăng nhập bằng mật khẩu hoặc OTP và duy trì session trong browser.
- Marketplace, tìm kiếm, lọc, phân trang và chi tiết sản phẩm.
- Wishlist lưu trong `localStorage`.
- Reviews và notifications với thay đổi local.
- Profile theo role và avatar preview local.
- Admin stats, duyệt sản phẩm và duyệt profile bằng state local.
- Báo cáo CSV/PDF được thay bằng file demo local.
- GIS dùng data source mock hiện hữu khi `NEXT_PUBLIC_P4_DATA_MODE=mock`.

## Tích hợp không kết nối thật

- Backend REST API và refresh token.
- WebSocket notifications.
- OTP provider và đăng ký tài khoản thật.
- Cloudinary, Supabase và storage upload.
- CCCD/KYC provider.
- Database và các mutation production.

Banner trên toàn ứng dụng luôn thông báo dữ liệu đang được mô phỏng.

## Chuyển về Backend thật

Đặt:

```env
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SITE_URL=https://app.example.com
```

`NEXT_PUBLIC_BACKEND_URL` vẫn được hỗ trợ cho deployment cũ nhưng
`NEXT_PUBLIC_API_URL` được ưu tiên. Real Mode không fallback sang demo; thiếu
API URL sẽ phát sinh lỗi cấu hình rõ ràng tại data-access boundary.

## Troubleshooting

- Banner không xuất hiện: kiểm tra biến đã được đặt cho đúng Vercel environment
  rồi redeploy.
- Trang demo báo endpoint chưa mô phỏng: tính năng đó nằm ngoài demo scope;
  không thêm backend URL để che lỗi.
- Bản đồ không hiển thị: giữ `NEXT_PUBLIC_P4_DATA_MODE=mock`; Mapbox token chỉ
  cần khi chủ động dùng provider thật.
- Session cũ gây sai role: logout hoặc xóa key `agrilink-auth` và
  `agrilink-demo-data` trong local storage.
- Ảnh upload chỉ là object URL và biến mất sau khi browser session kết thúc.
