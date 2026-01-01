import { formatPrice } from '@/lib/utils/formatters';

interface PriceRange {
  min: number;
  max: number;
}

interface FilterTagsProps {
  priceRange: PriceRange;
  minRating: number | null;
  onRemovePriceRange: () => void;
  onRemoveRating: () => void;
}

export default function FilterTags({ priceRange, minRating, onRemovePriceRange, onRemoveRating }: FilterTagsProps) {
  const hasPriceFilter = priceRange.min > 0 || priceRange.max < 100000;
  const hasRatingFilter = minRating !== null;

  if (!hasPriceFilter && !hasRatingFilter) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {hasPriceFilter && (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
          가격: {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
          <button onClick={onRemovePriceRange} className="hover:text-primary-900">×</button>
        </span>
      )}
      {hasRatingFilter && (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
          {minRating}점 이상
          <button onClick={onRemoveRating} className="hover:text-primary-900">×</button>
        </span>
      )}
    </div>
  );
}
