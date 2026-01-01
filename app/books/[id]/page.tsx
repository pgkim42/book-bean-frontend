'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, ArrowLeft, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import bookService from '@/lib/services/bookService';
import reviewService from '@/lib/services/reviewService';
import useCartStore from '@/lib/store/cartStore';
import useAuthStore from '@/lib/store/authStore';
import useWishlistStore from '@/lib/store/wishlistStore';
import { formatPrice } from '@/lib/utils/formatters';
import { BOOK_STATUS } from '@/lib/utils/constants';

const BookDetailSkeleton = () => (
  <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-24" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="w-full h-96 bg-gray-200 rounded-lg" />
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-6 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  </div>
);

// 임시 컴포넌트들
const ReviewList = ({ bookId, refreshTrigger }: { bookId: number; refreshTrigger: number }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [bookId, refreshTrigger]);

  const fetchReviews = async () => {
    try {
      const response: any = await reviewService.getBookReviews(bookId);
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
};

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

const RecentlyViewedSection = ({ currentBookId }: { currentBookId: number }) => {
  const [recentBooks, setRecentBooks] = useState<any[]>([]);

  useEffect(() => {
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const filtered = recentlyViewed.filter((book: any) => book.id !== currentBookId).slice(0, 4);
    setRecentBooks(filtered);
  }, [currentBookId]);

  if (recentBooks.length === 0) return null;

  return (
    <div className="py-8 px-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">최근 본 도서</h2>
      <div className="flex gap-4 overflow-x-auto">
        {recentBooks.map((book) => (
          <a key={book.id} href={`/books/${book.id}`} className="flex-shrink-0 w-32">
            {book.imageUrl ? (
              <img src={book.imageUrl} alt={book.title} className="w-32 h-40 object-cover rounded" />
            ) : (
              <div className="w-32 h-40 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
            <p className="text-sm font-medium mt-2 line-clamp-2">{book.title}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);
  const [editingReview, setEditingReview] = useState<any>(null);

  const isWishlisted = book ? isInWishlist(book.id) : false;

  useEffect(() => {
    fetchBookDetail();
  }, [id]);

  const fetchBookDetail = async () => {
    try {
      const response: any = await bookService.getBook(id);
      setBook(response.data);

      // 최근 본 상품에 추가
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const filtered = recentlyViewed.filter((item: any) => item.id !== response.data.id);
      filtered.unshift(response.data);
      localStorage.setItem('recentlyViewed', JSON.stringify(filtered.slice(0, 10)));
    } catch (error) {
      toast.error('도서 정보를 불러올 수 없습니다');
      router.push('/books');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (data: any) => {
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
    } catch (error: any) {
      toast.error(error.message || '리뷰 저장에 실패했습니다');
      throw error;
    }
  };

  const handleEditReview = (review: any) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다');
      router.push('/login');
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

  const handleQuantityChange = (delta: number) => {
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
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>뒤로가기</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

        <div className="space-y-6">
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

          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>

          <div className="space-y-1 text-gray-600">
            <p>저자: {book.author}</p>
            <p>출판사: {book.publisher}</p>
            <p>출판일: {book.publicationDate}</p>
            <p>ISBN: {book.isbn}</p>
          </div>

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

          <div className="text-sm">
            {book.stockQuantity > 0 ? (
              <p className="text-gray-600">
                재고: <span className="font-bold">{book.stockQuantity}</span>권
              </p>
            ) : (
              <p className="text-gray-900 font-bold">품절</p>
            )}
          </div>

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
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>장바구니 담기</span>
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
                  />
                  <span>{isWishlisted ? '찜 취소' : '찜하기'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {book.description && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">책 소개</h2>
          <p className="text-gray-700 whitespace-pre-line">{book.description}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">리뷰</h2>
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
          refreshTrigger={reviewRefreshTrigger}
        />
      </div>

      <RecentlyViewedSection currentBookId={parseInt(id)} />
    </div>
  );
}
