import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star } from 'lucide-react';
import Button from '../common/Button';

// CreateReviewRequest 기반 Validation Schema
const reviewSchema = z.object({
  bookId: z.number({ required_error: '책 ID는 필수입니다' }),
  rating: z.number({ required_error: '평점은 필수입니다' }).min(1, '평점은 최소 1점입니다').max(5, '평점은 최대 5점입니다'),
  title: z.string().min(1, '리뷰 제목은 필수입니다').max(100, '리뷰 제목은 100자 이하로 작성해주세요'),
  content: z.string().min(10, '리뷰 내용은 10자 이상 작성해주세요').max(2000, '리뷰 내용은 2000자 이하로 작성해주세요'),
});

const ReviewForm = ({ bookId, onSubmit, onCancel, initialData }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: initialData || {
      bookId,
      rating: 5,
      title: '',
      content: '',
    },
  });

  const currentRating = watch('rating');

  const handleRatingClick = (rating) => {
    setValue('rating', rating);
  };

  const onSubmitForm = async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // 에러는 부모 컴포넌트에서 처리
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {/* 평점 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          평점 <span className="text-gray-900">*</span>
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoveredRating || currentRating)
                    ? 'fill-gray-700 text-gray-700'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {currentRating}점
          </span>
        </div>
        <input type="hidden" {...register('rating', { valueAsNumber: true })} />
        <input type="hidden" {...register('bookId', { valueAsNumber: true })} />
        {errors.rating && (
          <p className="mt-1 text-sm text-gray-900">{errors.rating.message}</p>
        )}
      </div>

      {/* 리뷰 제목 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          리뷰 제목 <span className="text-gray-900">*</span>
        </label>
        <input
          {...register('title')}
          type="text"
          placeholder="리뷰 제목을 입력하세요 (최대 100자)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-gray-900">{errors.title.message}</p>
        )}
      </div>

      {/* 리뷰 내용 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          리뷰 내용 <span className="text-gray-900">*</span>
        </label>
        <textarea
          {...register('content')}
          rows="6"
          placeholder="리뷰 내용을 입력하세요 (10자 이상 2000자 이하)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <div className="flex justify-between mt-1">
          <div>
            {errors.content && (
              <p className="text-sm text-gray-900">{errors.content.message}</p>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {watch('content')?.length || 0} / 2000자
          </p>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '처리중...' : initialData ? '수정' : '등록'}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
