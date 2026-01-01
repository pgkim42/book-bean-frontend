import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Star, Edit2, X, Save } from 'lucide-react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    zipCode: '',
    address: '',
    addressDetail: '',
  });
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
      // 편집 폼 초기화
      setEditForm({
        name: response.data.name || '',
        phone: response.data.phone || '',
        zipCode: response.data.zipCode || '',
        address: response.data.address || '',
        addressDetail: response.data.addressDetail || '',
      });
    } catch (error) {
      toast.error('프로필 정보를 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // 원래 값으로 복원
    setEditForm({
      name: user.name || '',
      phone: user.phone || '',
      zipCode: user.zipCode || '',
      address: user.address || '',
      addressDetail: user.addressDetail || '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await userService.updateUser(user.id, editForm);
      toast.success('프로필이 수정되었습니다');
      setIsEditing(false);
      fetchProfile(); // 최신 정보 다시 가져오기
    } catch (error) {
      toast.error(error.message || '프로필 수정에 실패했습니다');
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

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        '정말로 탈퇴하시겠습니까?\n\n탈퇴하시면 모든 정보가 비활성화되며 복구할 수 없습니다.'
      )
    ) {
      try {
        await userService.deleteUser(user.id);
        toast.success('회원 탈퇴가 완료되었습니다');
        logout();
        navigate('/');
      } catch (error) {
        toast.error(error.message || '회원 탈퇴에 실패했습니다');
      }
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">기본 정보</h2>
            {!isEditing ? (
              <Button
                onClick={handleEditClick}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Edit2 className="w-4 h-4" />
                <span>수정</span>
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  onClick={handleSaveProfile}
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Save className="w-4 h-4" />
                  <span>저장</span>
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <X className="w-4 h-4" />
                  <span>취소</span>
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* 이름 */}
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">이름</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="font-medium">{user.name}</p>
                )}
              </div>
            </div>

            {/* 이메일 (읽기 전용) */}
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">이메일</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            {/* 전화번호 */}
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">전화번호</p>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                    placeholder="010-1234-5678"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="font-medium">{user.phone || '-'}</p>
                )}
              </div>
            </div>

            {/* 가입일 (읽기 전용) */}
            {!isEditing && (
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">가입일</p>
                  <p className="font-medium">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 배송지 정보 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">배송지 정보</h2>
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
            <div className="flex-1 space-y-3">
              {/* 우편번호 */}
              <div>
                <p className="text-sm text-gray-600">우편번호</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="zipCode"
                    value={editForm.zipCode}
                    onChange={handleInputChange}
                    placeholder="12345"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="font-medium">{user.zipCode || '-'}</p>
                )}
              </div>

              {/* 주소 */}
              <div>
                <p className="text-sm text-gray-600">주소</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={editForm.address}
                    onChange={handleInputChange}
                    placeholder="서울시 강남구"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="font-medium">{user.address || '-'}</p>
                )}
              </div>

              {/* 상세주소 */}
              <div>
                <p className="text-sm text-gray-600">상세주소</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="addressDetail"
                    value={editForm.addressDetail}
                    onChange={handleInputChange}
                    placeholder="101호"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="font-medium">{user.addressDetail || '-'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 계정 상태 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">계정 상태</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">이메일 인증</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.emailVerified
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-gray-100 text-gray-800'
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
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-gray-200 text-gray-900'
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

        {/* 위험한 액션 */}
        <div className="bg-gray-100 rounded-lg shadow-md p-6 border border-gray-300">
          <h2 className="text-xl font-bold text-gray-900 mb-4">회원 탈퇴</h2>
          <p className="text-gray-700 mb-4">
            탈퇴하시면 모든 정보가 비활성화되며 복구할 수 없습니다.
          </p>
          <Button
            onClick={handleDeleteAccount}
            variant="outline"
            className="text-gray-900 border-gray-400 hover:bg-gray-200"
          >
            회원 탈퇴
          </Button>
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
