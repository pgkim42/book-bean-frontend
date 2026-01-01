import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: '최신순' },
  { value: 'title,asc', label: '제목순' },
  { value: 'salePrice,asc', label: '가격 낮은순' },
  { value: 'salePrice,desc', label: '가격 높은순' },
  // 백엔드에서 지원하는 경우 추가
  // { value: 'averageRating,desc', label: '평점 높은순' },
  // { value: 'reviewCount,desc', label: '리뷰 많은순' },
];

const SortDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = SORT_OPTIONS.find((option) => option.value === value) || SORT_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">{selectedOption.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="py-1">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check className="w-4 h-4 text-primary-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
