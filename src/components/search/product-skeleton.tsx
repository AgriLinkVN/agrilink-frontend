export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-hairline overflow-hidden animate-pulse">
      <div className="aspect-4/3 bg-surface-soft" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-surface-soft rounded w-3/4" />
        <div className="h-3 bg-surface-soft rounded w-1/2" />
        <div className="h-5 bg-surface-soft rounded w-1/3 mt-3" />
      </div>
    </div>
  );
}

export function ProductSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
