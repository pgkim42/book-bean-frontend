import { Star } from 'lucide-react';

const RATING_OPTIONS = [
  { value: null, label: '전체', stars: 0 },
  { value: 4.5, label: '4.5점 이상', stars: 4.5 },
  { value: 4.0, label: '4.0점 이상', stars: 4 },
  { value: 3.0, label: '3.0점 이상', stars: 3 },
];

const RatingFilter = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Star className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">평점</h3>
      </div>

      <div className="space-y-2">
        {RATING_OPTIONS.map((option) => (
          <label
            key={option.value || 'all'}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <input
              type="radio"
              name="rating"
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="w-4 h-4 text-primary-600 focus:ring-primary-500"
            />
            <div className="flex items-center space-x-1">
              {option.stars > 0 ? (
                <>
                  {[...Array(Math.floor(option.stars))].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gray-700 text-gray-700" />
                  ))}
                  {option.stars % 1 !== 0 && (
                    <Star className="w-4 h-4 fill-gray-300 text-gray-700" />
                  )}
                </>
              ) : null}
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {option.label}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RatingFilter;
