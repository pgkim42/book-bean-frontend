import { X } from 'lucide-react';
import PriceRangeSlider from './PriceRangeSlider';
import RatingFilter from './RatingFilter';
import Button from '../common/Button';

const FilterSidebar = ({
  priceRange,
  minRating,
  onPriceRangeChange,
  onMinRatingChange,
  onReset,
  isMobile = false,
  onClose
}) => {
  const content = (
    <div className="space-y-8">
      {isMobile && (
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-xl font-bold">필터</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <PriceRangeSlider
        min={0}
        max={100000}
        value={priceRange}
        onChange={onPriceRangeChange}
      />

      <div className="border-t pt-8">
        <RatingFilter
          value={minRating}
          onChange={onMinRatingChange}
        />
      </div>

      <div className="border-t pt-8">
        <Button
          onClick={onReset}
          variant="outline"
          className="w-full"
        >
          전체 필터 초기화
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
          <div className="p-6">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-24 bg-white rounded-lg shadow-md p-6">
        {content}
      </div>
    </div>
  );
};

export default FilterSidebar;
