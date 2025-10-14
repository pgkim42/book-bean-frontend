import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Edit, Trash2, ShieldCheck } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import Button from '../common/Button';
import useAuthStore from '../../store/authStore';

const ReviewItem = ({ review, onEdit, onDelete, onVote, onCancelVote }) => {
  const { user } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const isMyReview = user && user.email === review.userName; // userId 비교가 더 정확하지만, userName으로 우선 처리
  const contentLength = review.content?.length || 0;
  const shouldTruncate = contentLength > 200;

  const handleVote = async (voteType) => {
    if (onVote) {
      await onVote(review.id, voteType);
    }
  };

  return (
    <div className="border-b border-gray-200 py-6 last:border-b-0">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            {/* 평점 */}
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-900">{review.rating}점</span>
          </div>

          {/* 제목 */}
          <h4 className="text-lg font-bold text-gray-900 mb-1">{review.title}</h4>

          {/* 작성자 정보 */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{review.userName}</span>
            <span>·</span>
            <span>{formatDate(review.createdAt)}</span>
            {review.isVerifiedPurchase && (
              <>
                <span>·</span>
                <div className="flex items-center space-x-1 text-green-600">
                  <ShieldCheck className="w-4 h-4" />
                  <span>구매 인증</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 본인 리뷰일 경우 수정/삭제 버튼 */}
        {isMyReview && (onEdit || onDelete) && (
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(review)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(review.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 내용 */}
      <div className="mb-4">
        <p className="text-gray-700 whitespace-pre-wrap">
          {shouldTruncate && !isExpanded
            ? `${review.content.substring(0, 200)}...`
            : review.content}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {isExpanded ? '접기' : '더보기'}
          </button>
        )}
      </div>

      {/* 투표 */}
      {onVote && (
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleVote('UP')}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm">도움됨</span>
            <span className="text-sm font-medium text-gray-600">
              {review.voteUpCount || 0}
            </span>
          </button>
          <button
            onClick={() => handleVote('DOWN')}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ThumbsDown className="w-4 h-4" />
            <span className="text-sm">도움 안됨</span>
            <span className="text-sm font-medium text-gray-600">
              {review.voteDownCount || 0}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
