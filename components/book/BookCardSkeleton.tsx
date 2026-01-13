export default function BookCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-card p-4 animate-pulse">
      <div className="w-full h-48 bg-warm-200 rounded-lg mb-4 animate-shimmer" />
      <div className="h-4 bg-warm-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-warm-100 rounded w-1/2 mb-2" />
      <div className="h-4 bg-warm-200 rounded w-1/4" />
    </div>
  );
}

