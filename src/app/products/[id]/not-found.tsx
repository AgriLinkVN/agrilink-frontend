import Link from "next/link";
import { PackageX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 text-rose-500 mb-4">
        <PackageX size={32} />
      </div>
      <h1 className="text-2xl font-bold">Không tìm thấy sản phẩm</h1>
      <p className="mt-2 text-muted">
        Sản phẩm có thể đã bị gỡ hoặc không còn khả dụng.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/products"
          className="rounded-xl bg-primary text-white px-5 py-2.5 font-semibold hover:bg-primary/90"
        >
          Xem sản phẩm khác
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-hairline px-5 py-2.5 font-semibold hover:bg-surface-soft"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
