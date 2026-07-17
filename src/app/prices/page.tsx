"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Bell, Download, RefreshCw, BarChart3, AlertCircle } from "lucide-react";
import { AdBanner } from "@/components/ads/ad-banner";
import { AdCarouselHome } from "@/components/ads/ad-carousel-home";
import { AdSidebarHome } from "@/components/ads/ad-sidebar-home";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { cn } from "@/lib/utils";

const PRICE_DATA_XOAI = [
  { date: "01/06", farmer: 38000, retail: 68000 },
  { date: "05/06", farmer: 40000, retail: 72000 },
  { date: "10/06", farmer: 42000, retail: 75000 },
  { date: "15/06", farmer: 45000, retail: 78000 },
  { date: "20/06", farmer: 43000, retail: 76000 },
  { date: "25/06", farmer: 47000, retail: 82000 },
  { date: "30/06", farmer: 50000, retail: 85000 },
];

const MARKET_PRICES = [
  { product: "Xoài cát Hòa Lộc", province: "Tiền Giang", min: 42000, max: 52000, avg: 45000, unit: "kg", change: 5.2, trend: "up" },
  { product: "Gạo ST25", province: "Sóc Trăng", min: 26000, max: 30000, avg: 28000, unit: "kg", change: -1.5, trend: "down" },
  { product: "Thanh long ruột đỏ", province: "Bình Thuận", min: 32000, max: 40000, avg: 35000, unit: "kg", change: 3.8, trend: "up" },
  { product: "Cà phê Arabica", province: "Lâm Đồng", min: 110000, max: 135000, avg: 120000, unit: "kg", change: 8.1, trend: "up" },
  { product: "Rau muống hữu cơ", province: "Đà Lạt", min: 22000, max: 28000, avg: 25000, unit: "kg", change: -2.3, trend: "down" },
  { product: "Sầu riêng Ri6", province: "Tiền Giang", min: 80000, max: 95000, avg: 85000, unit: "kg", change: 6.5, trend: "up" },
  { product: "Bưởi da xanh", province: "Bến Tre", min: 28000, max: 36000, avg: 32000, unit: "kg", change: -0.8, trend: "down" },
  { product: "Dưa hấu không hạt", province: "Long An", min: 15000, max: 22000, avg: 18000, unit: "kg", change: 2.1, trend: "up" },
];

const CATEGORIES = ["Tất cả", "Trái cây", "Lúa gạo", "Rau củ", "Cà phê", "Thủy sản"];

export default function PricesPage() {
  const [selectedProduct, setSelectedProduct] = useState("Xoài cát Hòa Lộc");
  const [selectedCat, setSelectedCat] = useState("Tất cả");

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* Header */}
      <div className="bg-surface-soft border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-ink mb-1">Giá thị trường nông sản</h1>
              <p className="text-muted text-sm">Cập nhật lần cuối: 21/06/2025 · 09:30 SA</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm">
                <Bell size={14} /> Đặt cảnh báo giá
              </Button>
              <Button variant="secondary" size="sm">
                <Download size={14} /> Xuất báo cáo
              </Button>
              <Button size="sm">
                <RefreshCw size={14} /> Cập nhật
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-accent-active shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#C2410C]">Cảnh báo biến động giá</p>
            <p className="text-sm text-[#9A3412]">Cà phê Arabica tăng <strong>8.1%</strong> trong 24h qua do ảnh hưởng thời tiết El Niño. Nông dân nên cân nhắc thời điểm bán.</p>
          </div>
        </div>
      </div>

      {/* 3-COLUMN LAYOUT: left ad | main | right ad (xl+) */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 xl:gap-6 items-start">

          {/* LEFT AD SIDEBAR */}
          <div className="hidden xl:block w-[200px] shrink-0 sticky top-20 pt-6">
            <AdSidebarHome side="left" />
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0">

            {/* AD SLOT: prices-carousel */}
            <div className="pt-6 pb-2">
              <AdCarouselHome />
            </div>

            <div className="py-8">
              {/* Price chart */}
              <div className="bg-white rounded-xl border border-hairline card-shadow p-6 mb-8">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-ink">{selectedProduct} — Tiền Giang</h2>
                    <p className="text-sm text-muted">So sánh giá nông dân nhận vs giá bán lẻ tại siêu thị</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-1.5 rounded-full bg-primary" />
                      <span className="text-muted">Giá nông dân</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-1.5 rounded-full bg-accent" />
                      <span className="text-muted">Giá bán lẻ</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-surface-green rounded-xl p-4">
                    <p className="text-xs text-muted mb-1">Giá nông dân hôm nay</p>
                    <p className="text-2xl font-bold text-primary">45,000đ/kg</p>
                    <p className="text-xs text-primary font-semibold mt-1">↑ 5.2% hôm qua</p>
                  </div>
                  <div className="bg-[#FFF7ED] rounded-xl p-4">
                    <p className="text-xs text-muted mb-1">Giá bán lẻ siêu thị</p>
                    <p className="text-2xl font-bold text-accent-active">82,000đ/kg</p>
                    <p className="text-xs text-muted mt-1">Khoảng cách: 37,000đ (82%)</p>
                  </div>
                  <div className="hidden sm:block bg-[#DBEAFE] rounded-xl p-4">
                    <p className="text-xs text-muted mb-1">Dự báo AI 2 tuần tới</p>
                    <p className="text-2xl font-bold text-[#1E40AF]">48–55K đ</p>
                    <p className="text-xs text-[#1E40AF] font-semibold mt-1">Xu hướng tăng</p>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={PRICE_DATA_XOAI} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="farmerGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="retailGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F4A261" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#F4A261" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6B7280" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                    <Tooltip
                      formatter={(val, name) => [`${Number(val).toLocaleString("vi-VN")}đ/kg`, name === "farmer" ? "Giá nông dân" : "Giá bán lẻ"]}
                      labelFormatter={(l) => `Ngày ${l}`}
                    />
                    <Area type="monotone" dataKey="retail" stroke="#F4A261" strokeWidth={2} fill="url(#retailGrad)" dot={false} />
                    <Area type="monotone" dataKey="farmer" stroke="#2D6A4F" strokeWidth={2.5} fill="url(#farmerGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Price table */}
              <div className="bg-white rounded-xl border border-hairline card-shadow">
                <div className="flex items-center justify-between p-5 border-b border-hairline">
                  <h2 className="font-bold text-ink flex items-center gap-2">
                    <BarChart3 size={18} className="text-primary" /> Bảng giá hôm nay
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCat(cat)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                          selectedCat === cat ? "bg-primary text-white" : "border border-hairline text-muted hover:border-primary hover:text-primary"
                        )}
                      >{cat}</button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-surface-soft border-b border-hairline">
                        <th className="text-left text-xs font-semibold text-muted px-5 py-3">Sản phẩm</th>
                        <th className="text-left text-xs font-semibold text-muted px-4 py-3">Tỉnh thành</th>
                        <th className="text-right text-xs font-semibold text-muted px-4 py-3">Giá thấp nhất</th>
                        <th className="text-right text-xs font-semibold text-muted px-4 py-3">Giá cao nhất</th>
                        <th className="text-right text-xs font-semibold text-muted px-4 py-3">Giá trung bình</th>
                        <th className="text-right text-xs font-semibold text-muted px-4 py-3">Biến động</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline-soft">
                      {MARKET_PRICES.map((p) => (
                        <tr
                          key={p.product}
                          onClick={() => setSelectedProduct(p.product)}
                          className={cn("cursor-pointer transition-colors", selectedProduct === p.product ? "bg-surface-green" : "hover:bg-surface-soft")}
                        >
                          <td className="px-5 py-4">
                            <span className="text-sm font-semibold text-ink">{p.product}</span>
                          </td>
                          <td className="px-4 py-4 text-sm text-muted">{p.province}</td>
                          <td className="px-4 py-4 text-right text-sm text-ink">{p.min.toLocaleString("vi-VN")}đ</td>
                          <td className="px-4 py-4 text-right text-sm text-ink">{p.max.toLocaleString("vi-VN")}đ</td>
                          <td className="px-4 py-4 text-right text-sm font-bold text-primary">{p.avg.toLocaleString("vi-VN")}đ/{p.unit}</td>
                          <td className="px-4 py-4 text-right">
                            <span className={cn("flex items-center justify-end gap-1 text-sm font-bold", p.trend === "up" ? "text-primary" : "text-error")}>
                              {p.trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                              {p.trend === "up" ? "+" : ""}{p.change}%
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button className="text-xs text-primary hover:underline whitespace-nowrap">Đặt cảnh báo</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AD SLOT: prices-banner — sau bảng giá */}
              <div className="pt-6 pb-8">
                <AdBanner slotId="below-hero" index={0} />
              </div>
            </div>

          </div>

          {/* RIGHT AD SIDEBAR */}
          <div className="hidden xl:block w-[200px] shrink-0 sticky top-20 pt-6">
            <AdSidebarHome side="right" />
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
