export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse mb-6" />
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-7 space-y-3">
          <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-20 h-20 bg-gray-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
        <div className="md:col-span-5 space-y-4">
          <div className="h-8 bg-gray-100 rounded animate-pulse w-3/4" />
          <div className="h-10 bg-gray-100 rounded animate-pulse w-1/2" />
          <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
