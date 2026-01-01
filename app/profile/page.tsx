'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Calendar, Star, Edit2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import userService from '@/lib/services/userService';
import reviewService from '@/lib/services/reviewService';
import useAuthStore from '@/lib/store/authStore';
import { formatDate } from '@/lib/utils/formatters';

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, logout } = useAuthStore();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editingReview, setEditingReview] = useState<any>(null);
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
    if (!authUser) {
      router.push('/login');
      return;
    }
    fetchProfile();
    fetchMyReviews();
  }, [authUser, currentPage, router]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response: any = await userService.getMyInfo();
      // api.ts 인터셉터가 response.data를 반환하므로 직접 사용하거나 fallback
      const userData = response.data || response;
      setUser(userData);
      setEditForm({
        name: userData.name || '',
        phone: userData.phone || '',
        zipCode: userData.zipCode || '',
        address: userData.address || '',
        addressDetail: userData.addressDetail || '',
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
    setEditForm({
      name: user.name || '',
      phone: user.phone || '',
      zipCode: user.zipCode || '',
      address: user.address || '',
      addressDetail: user.addressDetail || '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message || '프로필 수정에 실패했습니다');
    }
  };

  const fetchMyReviews = async () => {
    setReviewsLoading(true);
    try {
      const response: any = await reviewService.getMyReviews({
        page: currentPage,
        size: pageSize,
        sort: 'createdAt,desc',
      });
      // api.ts 인터셉터가 response.data를 반환하므로, response가 곧 ApiResponse
      const reviewData = response.data || response;
      setReviews(reviewData?.content || []);
      setTotalPages(reviewData?.totalPages || 0);
    } catch (error) {
      console.error('리뷰 목록 조회 실패:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleEditReview = (review: any) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleReviewSubmit = async (data: any) => {
    try {
      await reviewService.updateReview(editingReview.id, data);
      toast.success('리뷰가 수정되었습니다');
      setShowReviewForm(false);
      setEditingReview(null);
      fetchMyReviews();
    } catch (error: any) {
      toast.error(error.message || '리뷰 수정에 실패했습니다');
      throw error;
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      try {
        await reviewService.deleteReview(reviewId);
        toast.success('리뷰가 삭제되었습니다');
        fetchMyReviews();
      } catch (error: any) {
        toast.error(error.message || '리뷰 삭제에 실패했습니다');
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      router.push('/');
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
        router.push('/');
      } catch (error: any) {
        toast.error(error.message || '회원 탈퇴에 실패했습니다');
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">내 정보</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">기본 정보</h2>
            {!isEditing ? (
              <button
                onClick={handleEditClick}
                className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                <Edit2 className="w-4 h-4" />
                <span>수정</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center space-x-1 px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>저장</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <X className="w-4 h-4" />
                  <span>취소</span>
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
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

            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">이메일</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

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

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">배송지 정보</h2>
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
            <div className="flex-1 space-y-3">
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

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">계정 상태</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">이메일 인증</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.emailVerified ? 'bg-gray-100 text-gray-900' : 'bg-gray-100 text-gray-800'}`}>
                {user.emailVerified ? '인증 완료' : '미인증'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">계정 상태</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.isActive ? 'bg-gray-100 text-gray-900' : 'bg-gray-200 text-gray-900'}`}>
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
                    <a
                      href={`/books/${review.bookId}`}
                      className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors block"
                    >
                      <h4 className="font-bold text-primary-600 mb-2">
                        {review.bookTitle}
                      </h4>
                    </a>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                      <span className="font-medium">{review.title}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{review.content}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditReview(review)} className="text-sm text-primary-600 hover:text-primary-700">수정</button>
                      <button onClick={() => handleDeleteReview(review.id)} className="text-sm text-red-600 hover:text-red-700">삭제</button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  <button onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0} className="px-3 py-2 border rounded disabled:opacity-50">이전</button>
                  <span className="px-3 py-2">{currentPage + 1} / {totalPages}</span>
                  <button onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))} disabled={currentPage === totalPages - 1} className="px-3 py-2 border rounded disabled:opacity-50">다음</button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">빠른 메뉴</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/orders">
              <button className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">주문 내역</button>
            </Link>
            <Link href="/cart">
              <button className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">장바구니</button>
            </Link>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg shadow-md p-6 border border-gray-300">
          <h2 className="text-xl font-bold text-gray-900 mb-4">회원 탈퇴</h2>
          <p className="text-gray-700 mb-4">
            탈퇴하시면 모든 정보가 비활성화되며 복구할 수 없습니다.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-200 text-gray-900"
          >
            회원 탈퇴
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            로그아웃
          </button>
        </div>
      </div>

      {showReviewForm && editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
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
      )}
    </div>
  );
}

const ReviewForm = ({ bookId, onSubmit, onCancel, initialData }: {
  bookId: number;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  initialData?: any;
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
            <button key={star} type="button" onClick={() => setRating(star)} className={`text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}>
              ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">제목</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">리뷰 내용</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={4} required />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">저장</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg">취소</button>
      </div>
    </form>
  );
};
