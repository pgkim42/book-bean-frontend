import { Edit } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import Button from '../common/Button';

const OrderItem = ({ item, isDelivered, hasReviewed, onWriteReview }) => {
  return (
    <div className="flex items-center gap-4 p-4 border-b last:border-b-0">
      {/* 책 이미지 */}
      <div className="flex-shrink-0 w-20 h-28 bg-gray-200 rounded overflow-hidden">
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
      <div className="flex-1">
        <h4 className="font-bold text-gray-900">{item.bookTitle}</h4>
        <p className="text-sm text-gray-600 mt-1">{item.bookAuthor}</p>
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-sm text-gray-700">
            {formatPrice(item.orderPrice)} × {item.quantity}개
          </span>
        </div>
        {/* 리뷰 작성 버튼 */}
        {isDelivered && !hasReviewed && onWriteReview && (
          <div className="mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={onWriteReview}
              className="flex items-center space-x-1"
            >
              <Edit className="w-4 h-4" />
              <span>리뷰 작성</span>
            </Button>
          </div>
        )}
        {isDelivered && hasReviewed && (
          <div className="mt-3">
            <span className="text-sm text-green-600 font-medium">
              ✓ 리뷰 작성 완료
            </span>
          </div>
        )}
      </div>

      {/* 소계 */}
      <div className="text-right">
        <p className="text-lg font-bold text-gray-900">
          {formatPrice(item.totalPrice)}
        </p>
      </div>
    </div>
  );
};

export default OrderItem;
