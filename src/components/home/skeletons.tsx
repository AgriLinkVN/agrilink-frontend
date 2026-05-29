export function CategorySkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton rounded-2xl aspect-square" />
        ))}
      </div>
    </div>
  );
}

export function CarouselSkeleton() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="skeleton h-7 w-48 rounded-lg" />
            <div className="skeleton h-4 w-64 rounded-lg" />
          </div>
          <div className="flex gap-2">
            <div className="skeleton w-9 h-9 rounded-full" />
            <div className="skeleton w-9 h-9 rounded-full" />
            <div className="skeleton w-9 h-9 rounded-full" />
          </div>
        </div>
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shrink-0 w-72 rounded-2xl overflow-hidden">
              <div className="skeleton h-48 w-full" />
              <div className="p-4 space-y-2 bg-white rounded-b-2xl">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
                <div className="skeleton h-3 w-2/3 rounded" />
                <div className="flex justify-between mt-3">
                  <div className="skeleton h-5 w-24 rounded" />
                  <div className="skeleton h-8 w-20 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SectionSkeleton({ height = "h-64" }: { height?: string }) {
  return <div className={`skeleton w-full ${height} rounded-none`} />;
}
