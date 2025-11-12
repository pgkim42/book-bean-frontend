import { X } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

const FilterTags = ({ priceRange, minRating, onRemovePriceRange, onRemoveRating }) => {
  const tags = [];

  // 가격 범위 태그
  if (priceRange && (priceRange.min > 0 || priceRange.max < 100000)) {
    tags.push({
      id: 'price',
      label: `${formatPrice(priceRange.min)} ~ ${formatPrice(priceRange.max)}`,
      onRemove: onRemovePriceRange,
    });
  }

  // 평점 태그
  if (minRating !== null) {
    tags.push({
      id: 'rating',
      label: `⭐ ${minRating}점 이상`,
      onRemove: onRemoveRating,
    });
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={tag.onRemove}
          className="flex items-center space-x-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium hover:bg-primary-100 transition-colors"
        >
          <span>{tag.label}</span>
          <X className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  );
};

export default FilterTags;
