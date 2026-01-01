import { Trash2, Plus, Minus } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import Button from '../common/Button';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (delta) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity >= 1) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors">
      {/* 책 이미지 */}
      <div className="flex-shrink-0 w-24 h-32 bg-gray-200 rounded-lg overflow-hidden">
        {item.bookCoverImageUrl ? (
          <img
            src={item.bookCoverImageUrl}
            alt={item.bookTitle}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
            이미지 없음
          </div>
        )}
      </div>

      {/* 책 정보 */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-gray-900 truncate">
          {item.bookTitle}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{item.bookAuthor}</p>

        {/* 가격 정보 */}
        <div className="mt-2">
          <span className="text-xl font-bold text-primary-600">
            {formatPrice(item.bookCurrentPrice)}
          </span>
          {item.priceChanged && (
            <p className="text-xs text-gray-700 mt-1">
              가격이 변동되었습니다 (담았을 때: {formatPrice(item.priceAtAdded)})
            </p>
          )}
        </div>
      </div>

      {/* 수량 조절 */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={item.quantity <= 1}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 border-x border-gray-300 font-medium">
            {item.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 총 가격 */}
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm text-gray-600">총 금액</p>
          <p className="text-xl font-bold text-gray-900">
            {formatPrice(item.totalPrice)}
          </p>
        </div>

        {/* 삭제 버튼 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(item.id)}
          className="text-gray-900 hover:bg-gray-100 border-gray-400"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
