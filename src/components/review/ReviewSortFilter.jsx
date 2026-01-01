import { Filter } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: '최신순' },
  { value: 'rating,desc', label: '평점 높은순' },
  { value: 'rating,asc', label: '평점 낮은순' },
  { value: 'helpfulCount,desc', label: '도움돼요 많은순' },
];

const RATING_FILTERS = [
  { value: 'all', label: '전체' },
  { value: '5', label: '⭐ 5점만' },
  { value: '4', label: '⭐ 4점 이상' },
  { value: '3', label: '⭐ 3점 이하' },
];

const ReviewSortFilter = ({ sort, ratingFilter, onSortChange, onRatingFilterChange }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <Filter className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">리뷰 필터</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        {/* 정렬 */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">정렬:</label>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 평점 필터 */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">평점:</label>
          <select
            value={ratingFilter}
            onChange={(e) => onRatingFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {RATING_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ReviewSortFilter;
