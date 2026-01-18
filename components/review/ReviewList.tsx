import { useState, useEffect } from 'react';
import type { Review, PaginatedResponse } from '@/lib/types';
import reviewService from '@/lib/services/reviewService';

interface ReviewListProps {
  bookId: number;
  refreshTrigger: number;
}

export default function ReviewList({ bookId, refreshTrigger }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [bookId, refreshTrigger]);

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getBookReviews(bookId);
      setReviews(response.data?.content || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">리뷰를 불러오는 중...</div>;
  if (reviews.length === 0) return <div className="text-center py-8 text-gray-500">작성된 리뷰가 없습니다.</div>;

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{review.userName}</span>
            <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
          </div>
          <h4 className="font-medium mb-1">{review.title}</h4>
          <p className="text-gray-600 text-sm">{review.content}</p>
        </div>
      ))}
    </div>
  );
}
