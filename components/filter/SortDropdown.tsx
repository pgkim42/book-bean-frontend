'use client';

import { memo, useCallback } from 'react';

interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: SortOption[];
}

const defaultOptions: SortOption[] = [
  { value: 'createdAt,desc', label: '최신순' },
  { value: 'createdAt,asc', label: '오래된순' },
  { value: 'salePrice,asc', label: '가격 낮은순' },
  { value: 'salePrice,desc', label: '가격 높은순' },
  { value: 'title,asc', label: '제목순' },
];

function SortDropdown({ value, onChange, options = defaultOptions }: SortDropdownProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <select
      value={value}
      onChange={handleChange}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default memo(SortDropdown);
