interface PriceRange {
  min: number;
  max: number;
}

interface FilterSidebarProps {
  priceRange: PriceRange;
  minRating: number | null;
  onPriceRangeChange: (range: PriceRange) => void;
  onMinRatingChange: (rating: number | null) => void;
  onReset: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function FilterSidebar({
  priceRange,
  minRating,
  onPriceRangeChange,
  onMinRatingChange,
  onReset,
  isMobile = false,
  onClose,
}: FilterSidebarProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${isMobile ? 'fixed inset-0 z-50 overflow-y-auto' : ''}`}>
      {isMobile && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">필터</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
      )}
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">가격대</h3>
          <div className="space-y-2">
            <div>
              <label className="text-sm text-gray-600">최소 가격</label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => onPriceRangeChange({ ...priceRange, min: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">최대 가격</label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => onPriceRangeChange({ ...priceRange, max: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-2">최소 평점</h3>
          <div className="space-y-2">
            {[null, 4, 3, 2, 1].map((rating) => (
              <label key={rating || 0} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === rating}
                  onChange={() => onMinRatingChange(rating)}
                  className="w-4 h-4"
                />
                <span>{rating ? `${rating}점 이상` : '전체'}</span>
              </label>
            ))}
          </div>
        </div>
        <button
          onClick={onReset}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          필터 초기화
        </button>
      </div>
    </div>
  );
}
