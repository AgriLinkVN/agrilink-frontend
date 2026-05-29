import Link from "next/link";
import { MapPin, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function MapCta() {
  return (
    <section className="bg-surface-green py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <Badge variant="organic" className="mb-4">Bản đồ GIS</Badge>
            <h2 className="text-3xl font-bold text-ink mb-4">
              Khám phá 34 vùng nông sản trọng điểm
            </h2>
            <p className="text-muted mb-6 leading-relaxed">
              Bản đồ số hóa hiển thị vùng trồng, sản lượng dự kiến, mùa vụ và loại nông sản đặc trưng của từng tỉnh thành. Tìm nguồn hàng chính xác theo địa lý.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <Link href="/map">
                  <MapPin size={16} /> Xem bản đồ vùng trồng
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/prices">
                  <TrendingUp size={16} /> Bảng giá thị trường
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md">
            <div className="bg-white rounded-2xl border border-primary-light p-4 card-shadow aspect-4/3 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={64} className="text-primary mx-auto mb-4" />
                <p className="text-sm font-semibold text-primary">Bản đồ GIS tương tác</p>
                <p className="text-xs text-muted mt-1">MapBox GL · 34 tỉnh thành</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
