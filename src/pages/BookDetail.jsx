import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Edit2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import bookService from '../services/bookService';
import reviewService from '../services/reviewService';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import useWishlistStore from '../store/wishlistStore';
import useRecentlyViewed from '../hooks/useRecentlyViewed';
import Button from '../components/common/Button';
import BookDetailSkeleton from '../components/common/BookDetailSkeleton';
import ReviewList from '../components/review/ReviewList';
import ReviewForm from '../components/review/ReviewForm';
import RecentlyViewedSection from '../components/recentlyViewed/RecentlyViewedSection';
import { formatPrice } from '../utils/formatters';
import { BOOK_STATUS } from '../utils/constants';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  useRecentlyViewed(book);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);
  const [editingReview, setEditingReview] = useState(null);

  const isWishlisted = book ? isInWishlist(book.id) : false;

  useEffect(() => {
    fetchBookDetail();
  }, [id]);

  const fetchBookDetail = async () => {
    try {
      const response = await bookService.getBook(id);
      setBook(response.data);
    } catch (error) {
      toast.error('도서 정보를 불러올 수 없습니다');
      navigate('/books');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (data) => {
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
      toast.error(error.message || '리뷰 저장에 실패했습니다');
      throw error;
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다');
      navigate('/login');
      return;
    }

    if (book.status !== 'AVAILABLE') {
      toast.error('구매할 수 없는 상품입니다');
      return;
    }

    if (quantity > book.stockQuantity) {
      toast.error('재고가 부족합니다');
      return;
    }

    const success = await addToCart({
      bookId: book.id,
      quantity,
    });

    if (success) {
      toast.success('장바구니에 추가되었습니다');
    } else {
      toast.error('장바구니 추가에 실패했습니다');
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= book.stockQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleToggleWishlist = async () => {
    const success = await toggleWishlist(book.id);
    if (success) {
      if (isWishlisted) {
        toast.success('위시리스트에서 제거되었습니다');
      } else {
        toast.success('위시리스트에 추가되었습니다');
      }
    } else {
      toast.error('위시리스트 처리에 실패했습니다');
    }
  };

  if (loading) {
    return <BookDetailSkeleton />;
  }

  if (!book) {
    return null;
  }

  const isAvailable = book.status === 'AVAILABLE' && book.stockQuantity > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>뒤로가기</span>
      </button>

      {/* 도서 상세 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 이미지 */}
        <div className="bg-gray-200 rounded-lg overflow-hidden">
          {book.imageUrl ? (
            <img
              src={book.imageUrl}
              alt={book.title}
              className="w-full h-auto object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-96">
              <p className="text-gray-400">이미지 없음</p>
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="space-y-6">
          {/* 카테고리 & 상태 */}
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {book.categoryName || '미분류'}
            </span>
            {book.status !== 'AVAILABLE' && (
              <span className="px-3 py-1 bg-gray-200 text-gray-900 rounded-full text-sm font-medium">
                {BOOK_STATUS[book.status]}
              </span>
            )}
          </div>

          {/* 제목 */}
          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>

          {/* 저자 & 출판사 */}
          <div className="space-y-1 text-gray-600">
            <p>저자: {book.author}</p>
            <p>출판사: {book.publisher}</p>
            <p>출판일: {book.publicationDate}</p>
            <p>ISBN: {book.isbn}</p>
          </div>

          {/* 가격 */}
          <div className="border-t border-b py-4">
            <div className="space-y-1">
              {book.discountRate > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(book.originalPrice)}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {book.discountRate}% 할인
                  </span>
                </div>
              )}
              <span className="text-3xl font-bold text-primary-600">
                {formatPrice(book.salePrice)}
              </span>
            </div>
          </div>

          {/* 재고 정보 */}
          <div className="text-sm">
            {book.stockQuantity > 0 ? (
              <p className="text-gray-600">
                재고: <span className="font-bold">{book.stockQuantity}</span>권
              </p>
            ) : (
              <p className="text-gray-900 font-bold">품절</p>
            )}
          </div>

          {/* 수량 선택 & 장바구니 */}
          {isAvailable && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">수량:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= book.stockQuantity}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center space-x-2"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>장바구니 담기</span>
                </Button>
                <Button
                  onClick={handleToggleWishlist}
                  variant="outline"
                  size="lg"
                  className="flex items-center justify-center space-x-2"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isWishlisted ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                  <span>{isWishlisted ? '찜 취소' : '찜하기'}</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 책 소개 */}
      {book.description && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">책 소개</h2>
          <p className="text-gray-700 whitespace-pre-line">{book.description}</p>
        </div>
      )}

      {/* 리뷰 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">리뷰</h2>
          {isAuthenticated && !showReviewForm && (
            <Button onClick={() => setShowReviewForm(true)}>
              리뷰 작성
            </Button>
          )}
        </div>

        {showReviewForm && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg">
            <ReviewForm
              bookId={parseInt(id)}
              onSubmit={handleReviewSubmit}
              onCancel={() => {
                setShowReviewForm(false);
                setEditingReview(null);
              }}
              initialData={editingReview}
            />
          </div>
        )}

        <ReviewList
          bookId={parseInt(id)}
          onEditReview={handleEditReview}
          refreshTrigger={reviewRefreshTrigger}
        />
      </div>

      {/* 최근 본 상품 */}
      <RecentlyViewedSection currentBookId={parseInt(id)} />
    </div>
  );
};

export default BookDetail;
