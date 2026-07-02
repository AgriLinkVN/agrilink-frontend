"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FarmingBadge } from "@/components/ui/badge";
import {
  CheckCircle2, Package, Plus, ArrowRight, Sparkles,
  Eye, Clock, Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { UNIT_LABELS } from "@/lib/products-api";
import type { ProductFormData } from "../types";
import type { FarmingType } from "@/types";

interface SuccessScreenProps {
  data: ProductFormData;
  onAddAnother: () => void;
}

export function SuccessScreen({ data, onAddAnother }: SuccessScreenProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const unitLabel = data.unit ? UNIT_LABELS[data.unit] ?? data.unit : "";
  const primaryImage = data.images.find((img) => img.isPrimary) ?? data.images[0];

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-lg mx-auto text-center">
      {/* Confetti particles */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 1,
                  y: -20,
                  x: `${10 + Math.floor((i * 80) / 24)}vw`,
                  rotate: 0,
                  scale: 1,
                }}
                animate={{
                  opacity: 0,
                  y: "100vh",
                  rotate: 360 + i * 30,
                  scale: 0.5,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2.5 + (i % 5) * 0.3,
                  delay: (i % 8) * 0.1,
                  ease: "easeOut",
                }}
                className={cn(
                  "absolute w-3 h-3 rounded-sm",
                  [
                    "bg-primary", "bg-accent", "bg-harvest",
                    "bg-primary-light", "bg-[#DCFCE7]", "bg-[#DBEAFE]",
                  ][i % 6]
                )}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Success icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="mb-6"
      >
        <div className="w-20 h-20 rounded-full bg-primary-ultra-light flex items-center justify-center mx-auto relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.4 }}
          >
            <CheckCircle2 size={44} className="text-primary" strokeWidth={1.5} />
          </motion.div>

          {/* Sparkle accents */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles size={20} className="text-harvest" />
          </motion.div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="absolute -bottom-1 -left-2"
          >
            <Sparkles size={14} className="text-accent" />
          </motion.div>
        </div>
      </motion.div>

      {/* Success message */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-ink mb-2">
          Đăng sản phẩm thành công!
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          Sản phẩm của bạn đã được gửi và đang chờ duyệt.
          <br />
          Bạn sẽ nhận thông báo khi sản phẩm được phê duyệt.
        </p>
      </motion.div>

      {/* Product summary card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-6"
      >
        <div className="bg-white rounded-xl border border-hairline card-shadow overflow-hidden text-left">
          <div className="flex gap-4 p-4">
            {/* Thumbnail */}
            {primaryImage && (
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-soft shrink-0">
                <Image
                  src={primaryImage.preview}
                  alt={data.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-ink truncate">{data.name}</h3>
              <p className="text-lg font-bold text-primary mt-0.5">
                {data.price.toLocaleString("vi-VN")}đ
                <span className="text-xs text-muted font-normal">/{unitLabel}</span>
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                {data.farmingType && (
                  <FarmingBadge type={data.farmingType as FarmingType} />
                )}
                <span className="text-xs text-muted">
                  {data.images.length} ảnh
                </span>
                {data.certifications.length > 0 && (
                  <span className="text-xs text-muted">
                    • {data.certifications.length} chứng nhận
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="px-4 py-3 bg-[#FEF9C3] border-t border-[#FDE047] flex items-center gap-2">
            <Clock size={14} className="text-[#854D0E] shrink-0" />
            <span className="text-xs font-medium text-[#854D0E]">
              Đang chờ duyệt — thường mất 1-2 giờ trong giờ hành chính
            </span>
          </div>
        </div>
      </motion.div>

      {/* Next steps */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-6"
      >
        <div className="bg-surface-green rounded-xl border border-primary-light p-4 text-left">
          <p className="text-sm font-semibold text-primary mb-3">Bước tiếp theo</p>
          <div className="flex flex-col gap-2.5">
            {[
              { icon: Eye, text: "Sản phẩm sẽ hiển thị trên Marketplace sau khi được duyệt" },
              { icon: Package, text: "Chuẩn bị hàng hóa sẵn sàng khi có đơn đặt hàng" },
              { icon: Share2, text: "Chia sẻ link sản phẩm cho khách hàng tiềm năng" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md bg-primary-ultra-light flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={12} className="text-primary" />
                </div>
                <span className="text-sm text-ink">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="mt-8 flex flex-col gap-3"
      >
        <Button size="lg" className="w-full" asChild>
          <Link href="/dashboard/farmer/products">
            Xem danh sách sản phẩm <ArrowRight size={18} />
          </Link>
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={onAddAnother}
        >
          <Plus size={18} /> Đăng thêm sản phẩm khác
        </Button>
      </motion.div>
    </div>
  );
}
