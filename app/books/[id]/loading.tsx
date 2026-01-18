export default function BookDetailLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
      {/* Back Button Skeleton */}
      <div className="h-6 bg-gray-200 rounded w-24" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Skeleton */}
        <div className="w-full h-96 bg-gray-200 rounded-lg" />

        {/* Content Skeleton */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded w-20" />
            <div className="h-6 bg-gray-200 rounded w-16" />
          </div>
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
          <div className="h-px bg-gray-200 my-4" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
          </div>
          <div className="h-px bg-gray-200 my-4" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="flex gap-2 h-10">
              <div className="w-10 bg-gray-200 rounded" />
              <div className="w-10 bg-gray-200 rounded" />
              <div className="w-16 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-12 bg-gray-200 rounded flex-1" />
            <div className="h-12 bg-gray-200 rounded w-24" />
          </div>
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-8 bg-gray-200 rounded w-32 mb-4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>

      {/* Reviews Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-8 bg-gray-200 rounded w-20 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b pb-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
