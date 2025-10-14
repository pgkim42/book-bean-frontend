import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import userService from '../services/userService';
import reviewService from '../services/reviewService';
import useAuthStore from '../store/authStore';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ReviewItem from '../components/review/ReviewItem';
import ReviewForm from '../components/review/ReviewForm';
import Pagination from '../components/common/Pagination';
import { formatDate } from '../utils/formatters';

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuthStore();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editingReview, setEditingReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    fetchProfile();
    fetchMyReviews();
  }, [currentPage]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await userService.getMyInfo();
      setUser(response.data);
    } catch (error) {
      toast.error('프로필 정보를 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await reviewService.getMyReviews({
        page: currentPage,
        size: pageSize,
        sort: 'createdAt,desc',
      });
      setReviews(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('리뷰 목록 조회 실패:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleReviewSubmit = async (data) => {
    try {
      await reviewService.updateReview(editingReview.id, data);
      toast.success('리뷰가 수정되었습니다');
      setShowReviewForm(false);
      setEditingReview(null);
      fetchMyReviews();
    } catch (error) {
      toast.error(error.message || '리뷰 수정에 실패했습니다');
      throw error;
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      try {
        await reviewService.deleteReview(reviewId);
        toast.success('리뷰가 삭제되었습니다');
        fetchMyReviews();
      } catch (error) {
        toast.error(error.message || '리뷰 삭제에 실패했습니다');
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      navigate('/');
      toast.success('로그아웃되었습니다');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">내 정보</h1>

      <div className="space-y-6">
        {/* 기본 정보 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">기본 정보</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">이름</p>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">이메일</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">전화번호</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">가입일</p>
                <p className="font-medium">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 배송지 정보 */}
        {(user.address || user.zipCode) && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">배송지 정보</h2>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                {user.zipCode && (
                  <p className="text-gray-700">({user.zipCode})</p>
                )}
                {user.address && (
                  <>
                    <p className="font-medium">{user.address}</p>
                    {user.addressDetail && (
                      <p className="text-gray-700">{user.addressDetail}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 계정 상태 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">계정 상태</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">이메일 인증</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.emailVerified
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {user.emailVerified ? '인증 완료' : '미인증'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">계정 상태</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {user.isActive ? '활성' : '비활성'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">회원 등급</span>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {user.role === 'ROLE_ADMIN' ? '관리자' : '일반회원'}
              </span>
            </div>
          </div>
        </div>

        {/* 내 리뷰 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Star className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold">내 리뷰</h2>
          </div>

          {reviewsLoading ? (
            <div className="text-center py-8 text-gray-500">
              <p>리뷰를 불러오는 중...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>작성한 리뷰가 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div
                      className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      onClick={() => navigate(`/books/${review.bookId}`)}
                    >
                      <h4 className="font-bold text-primary-600 mb-2">
                        {review.bookTitle}
                      </h4>
                    </div>
                    <ReviewItem
                      review={review}
                      onEdit={handleEditReview}
                      onDelete={handleDeleteReview}
                    />
                  </div>
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* 빠른 메뉴 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">빠른 메뉴</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/orders')}
              variant="outline"
              className="w-full"
            >
              주문 내역
            </Button>
            <Button
              onClick={() => navigate('/cart')}
              variant="outline"
              className="w-full"
            >
              장바구니
            </Button>
          </div>
        </div>

        {/* 로그아웃 */}
        <div className="flex justify-center">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="px-8"
          >
            로그아웃
          </Button>
        </div>
      </div>

      {/* 리뷰 수정 모달 */}
      {showReviewForm && editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">리뷰 수정</h2>
              <p className="text-gray-600 mb-6">{editingReview.bookTitle}</p>
              <ReviewForm
                bookId={editingReview.bookId}
                onSubmit={handleReviewSubmit}
                onCancel={() => {
                  setShowReviewForm(false);
                  setEditingReview(null);
                }}
                initialData={{
                  bookId: editingReview.bookId,
                  rating: editingReview.rating,
                  title: editingReview.title,
                  content: editingReview.content,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
