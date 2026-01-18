'use client';

import { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import reviewService from '@/lib/services/reviewService';
import useAuthStore from '@/lib/store/authStore';
import type { Review, ReviewCreateRequest, ReviewUpdateRequest } from '@/lib/types';

interface ReviewSectionProps {
  bookId: number;
}

/**
 * 리뷰 목록 컴포넌트
 */
const ReviewList = ({ bookId, refreshTrigger, onEdit, onDelete }: {
  bookId: number;
  refreshTrigger: number;
  onEdit: (review: Review) => void;
  onDelete: (review: Review) => void;
}) => {
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

  const { user } = useAuthStore();

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">{review.userName}</span>
              <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
            </div>
            {user && user.id === review.userId && (
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(review)}
                  className="text-gray-500 hover:text-gray-700"
                  title="수정"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(review)}
                  className="text-gray-500 hover:text-red-500"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <h4 className="font-medium mb-1">{review.title}</h4>
          <p className="text-gray-600 text-sm">{review.content}</p>
        </div>
      ))}
    </div>
  );
};

/**
 * 리뷰 폼 컴포넌트
 */
const ReviewForm = ({ bookId, onSubmit, onCancel, initialData }: {
  bookId: number;
  onSubmit: (data: ReviewCreateRequest | ReviewUpdateRequest) => Promise<void>;
  onCancel: () => void;
  initialData?: Review;
}) => {
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ bookId, rating, title, content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">평점</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">리뷰 내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          rows={4}
          required
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          저장
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg">
          취소
        </button>
      </div>
    </form>
  );
};

/**
 * 리뷰 섹션 컴포넌트 (클라이언트 컴포넌트)
 * - 리뷰 목록 표시
 * - 리뷰 작성/수정/삭제
 */
export default function ReviewSection({ bookId }: ReviewSectionProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const handleReviewSubmit = async (data: ReviewCreateRequest | ReviewUpdateRequest) => {
    try {
      if (editingReview) {
        await reviewService.updateReview(editingReview.id, data);
        toast.success('리뷰가 수정되었습니다');
      } else {
        await reviewService.createReview(data);
        toast.success('리뷰가 작성되었습니다');
      }
      setShowReviewForm(false);
      setEditingReview(null);
      setReviewRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : '리뷰 저장에 실패했습니다';
      toast.error(message);
      throw error;
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (review: Review) => {
    if (!confirm('리뷰를 삭제하시겠습니까?')) return;

    try {
      await reviewService.deleteReview(review.id);
      toast.success('리뷰가 삭제되었습니다');
      setReviewRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : '리뷰 삭제에 실패했습니다';
      toast.error(message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">리뷰</h2>
        {isAuthenticated && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            리뷰 작성
          </button>
        )}
      </div>

      {showReviewForm && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg">
          <ReviewForm
            bookId={bookId}
            onSubmit={handleReviewSubmit}
            onCancel={() => {
              setShowReviewForm(false);
              setEditingReview(null);
            }}
            initialData={editingReview || undefined}
          />
        </div>
      )}

      <ReviewList
        bookId={bookId}
        refreshTrigger={reviewRefreshTrigger}
        onEdit={handleEditReview}
        onDelete={handleDeleteReview}
      />
    </div>
  );
}
