import { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

const PriceRangeSlider = ({ min = 0, max = 100000, value, onChange }) => {
  const [localMin, setLocalMin] = useState(value?.min || min);
  const [localMax, setLocalMax] = useState(value?.max || max);

  useEffect(() => {
    if (value) {
      setLocalMin(value.min);
      setLocalMax(value.max);
    }
  }, [value]);

  const handleMinChange = (e) => {
    const newMin = Math.min(Number(e.target.value), localMax - 1000);
    setLocalMin(newMin);
  };

  const handleMaxChange = (e) => {
    const newMax = Math.max(Number(e.target.value), localMin + 1000);
    setLocalMax(newMax);
  };

  const handleApply = () => {
    onChange({ min: localMin, max: localMax });
  };

  const handleReset = () => {
    setLocalMin(min);
    setLocalMax(max);
    onChange({ min, max });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <DollarSign className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">가격 범위</h3>
      </div>

      {/* 가격 표시 */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{formatPrice(localMin)}</span>
        <span className="text-gray-500">~</span>
        <span className="font-medium text-gray-700">{formatPrice(localMax)}</span>
      </div>

      {/* 슬라이더 */}
      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-xs text-gray-600">최소 가격</label>
          <input
            type="range"
            min={min}
            max={max}
            step={1000}
            value={localMin}
            onChange={handleMinChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-gray-600">최대 가격</label>
          <input
            type="range"
            min={min}
            max={max}
            step={1000}
            value={localMax}
            onChange={handleMaxChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          적용
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          초기화
        </button>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
