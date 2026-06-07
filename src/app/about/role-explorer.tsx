"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROLE_SECTIONS, ALL_ROLES } from "./role-data";
import type { UserRole } from "@/types";

interface Props {
  /** If provided, that role card is highlighted as "yours" */
  currentRole?: UserRole;
}

export function RoleExplorer({ currentRole }: Props) {
  const [selected, setSelected] = useState<UserRole>(currentRole ?? "farmer");
  const section = ROLE_SECTIONS[selected];
  const Icon = section.icon;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section header */}
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-badge-organic-bg text-badge-organic-text mb-4">
          Quyền lợi theo vai trò
        </span>
        <h2 className="text-3xl font-bold text-ink mb-3">
          AgriLink dành riêng cho từng đối tượng
        </h2>
        <p className="text-muted max-w-xl mx-auto text-sm">
          Chọn vai trò của bạn để xem tính năng và quyền lợi khi đăng ký.
        </p>
      </div>

      {/* Role picker chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {ALL_ROLES.map(({ role, label, icon: RoleIcon, color }) => {
          const isActive = selected === role;
          const isCurrent = currentRole === role;
          const sec = ROLE_SECTIONS[role];
          return (
            <button
              key={role}
              onClick={() => setSelected(role)}
              className={[
                "flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-200",
                isActive
                  ? `${sec.bgColor} ${sec.borderColor} ${sec.color} shadow-sm scale-105`
                  : "bg-white border-hairline text-muted hover:border-border-strong hover:text-ink",
              ].join(" ")}
            >
              <RoleIcon size={15} className={isActive ? color : "text-muted"} />
              {label}
              {isCurrent && (
                <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-primary inline-block" title="Vai trò của bạn" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feature panel */}
      <div className={`rounded-2xl border-2 ${section.borderColor} ${section.bgColor} p-6 sm:p-8 transition-all duration-200`}>
        {/* Panel header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <div className={`w-14 h-14 rounded-2xl bg-white border ${section.borderColor} flex items-center justify-center shrink-0`}>
            <Icon size={28} className={section.color} />
          </div>
          <div className="flex-1">
            {currentRole === selected && (
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-white border ${section.borderColor} ${section.color} mb-2`}>
                <CheckCircle size={12} /> Vai trò hiện tại của bạn
              </span>
            )}
            <h3 className="text-xl font-bold text-ink leading-tight">{section.headline}</h3>
            <p className="text-muted text-sm mt-1">{section.subline}</p>
          </div>
          <Button size="sm" asChild className="shrink-0 self-start sm:self-center">
            <Link href={currentRole === selected ? section.cta.href : "/auth/register"}>
              {currentRole === selected ? section.cta.label : "Đăng ký vai trò này"}
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {section.features.map(({ icon: FIcon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-xl border border-hairline p-4 flex gap-3 hover:border-primary-light transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-surface-green flex items-center justify-center shrink-0 mt-0.5">
                <FIcon size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink mb-1">{title}</p>
                <p className="text-xs text-muted leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Guest CTA below features */}
        {!currentRole && (
          <div className="mt-6 pt-6 border-t border-hairline/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted">
              Đăng ký <span className="font-semibold text-ink">miễn phí 12 tháng</span> cho nông dân và HTX.
            </p>
            <div className="flex gap-2 shrink-0">
              <Button variant="secondary" size="sm" asChild>
                <Link href="/auth/login">Đăng nhập</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/register">Đăng ký ngay</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
