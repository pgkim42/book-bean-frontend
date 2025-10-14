import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import reviewService from '../../services/reviewService';
import ReviewItem from './ReviewItem';
import Pagination from '../common/Pagination';
import Loading from '../common/Loading';

const ReviewList = ({ bookId, onEditReview, refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [stats, setStats] = useState({ totalReviews: 0, avgRating: 0 });
  const pageSize = 10;

  useEffect(() => {
    fetchReviews();
  }, [bookId, currentPage, refreshTrigger]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewService.getBookReviews(bookId, {
        page: currentPage,
        size: pageSize,
        sort: 'createdAt,desc',
      });

      setReviews(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);

      // 통계 계산
      const totalReviews = response.data.totalElements || 0;
      const avgRating =
        totalReviews > 0
          ? response.data.content.reduce((sum, r) => sum + r.rating, 0) /
            response.data.content.length
          : 0;

      setStats({ totalReviews, avgRating: avgRating.toFixed(1) });
    } catch (error) {
      toast.error('리뷰 목록을 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      try {
        await reviewService.deleteReview(reviewId);
        toast.success('리뷰가 삭제되었습니다');
        fetchReviews();
      } catch (error) {
        toast.error(error.message || '리뷰 삭제에 실패했습니다');
      }
    }
  };

  const handleVote = async (reviewId, voteType) => {
    try {
      await reviewService.voteReview(reviewId, voteType);
      toast.success('투표가 반영되었습니다');
      fetchReviews();
    } catch (error) {
      toast.error(error.message || '투표에 실패했습니다');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* 리뷰 통계 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <span className="ml-2 text-3xl font-bold text-gray-900">
              {stats.avgRating}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <p>평균 평점</p>
            <p className="font-medium">{stats.totalReviews}개의 리뷰</p>
          </div>
        </div>
      </div>

      {/* 리뷰 목록 */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>아직 작성된 리뷰가 없습니다.</p>
          <p className="text-sm mt-2">첫 번째 리뷰를 작성해보세요!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              onEdit={onEditReview}
              onDelete={handleDeleteReview}
              onVote={handleVote}
            />
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default ReviewList;
