import { Star } from 'lucide-react';
import { type RatingStats } from '@/types/review';

function StarIcon({ filled, half }: { filled: boolean; half?: boolean }) {
  if (half) {
    return (
      <span className="relative inline-block w-5 h-5">
        <Star size={20} stroke="none" fill="#E5E7EB" />
        <span className="absolute inset-0 overflow-hidden w-1/2">
          <Star size={20} stroke="none" fill="#F59E0B" />
        </span>
      </span>
    );
  }
  return <Star size={20} stroke="none" fill={filled ? '#F59E0B' : '#E5E7EB'} />;
}

function StarRow({ avg }: { avg: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = avg >= n;
        const half = !filled && avg >= n - 0.5;
        return <StarIcon key={n} filled={filled} half={half} />;
      })}
    </div>
  );
}

interface Props {
  stats: RatingStats;
}

export function RatingStats({ stats }: Props) {
  const { avg, total, distribution } = stats;

  return (
    <div className="flex flex-col sm:flex-row gap-6 p-5 bg-surface-soft rounded-xl border border-hairline">
      {/* Left — big average */}
      <div className="flex flex-col items-center justify-center shrink-0 sm:w-32">
        <span className="text-5xl font-extrabold text-ink leading-none">{avg.toFixed(1)}</span>
        <StarRow avg={avg} />
        <span className="text-sm text-muted mt-1">{total.toLocaleString('vi-VN')} đánh giá</span>
      </div>

      {/* Right — bar breakdown */}
      <div className="flex-1 flex flex-col gap-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={star} className="flex items-center gap-3">
              <div className="flex items-center gap-0.5 w-16 shrink-0">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={11} stroke="none" fill={s <= star ? '#F59E0B' : '#E5E7EB'} />
                ))}
              </div>
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-muted w-8 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
