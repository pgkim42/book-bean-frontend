import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, BookOpen } from 'lucide-react';
import clsx from 'clsx';
import { formatPrice } from '../../utils/formatters';
import { BOOK_STATUS } from '../../utils/constants';
import Button from '../common/Button';
import Badge, { StatusBadge } from '../common/Badge';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import useWishlistStore from '../../store/wishlistStore';
import toast from 'react-hot-toast';

/**
 * Warm & Cozy 스타일 BookCard 컴포넌트
 */
const BookCard = ({ book }) => {
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(book.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다');
      return;
    }

    if (book.status !== 'AVAILABLE') {
      toast.error('구매할 수 없는 상품입니다');
      return;
    }

    const success = await addToCart({
      bookId: book.id,
      quantity: 1,
    });

    if (success) {
      toast.success('장바구니에 추가되었습니다');
    } else {
      toast.error('장바구니 추가에 실패했습니다');
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

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

  const isAvailable = book.status === 'AVAILABLE' && book.stockQuantity > 0;
  const hasDiscount = book.discountRate > 0;

  return (
    <Link to={`/books/${book.id}`}>
      <article className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden hover:-translate-y-1">
        {/* 책 이미지 영역 */}
        <div className="relative h-64 bg-gradient-to-br from-warm-100 to-warm-50 flex items-center justify-center overflow-hidden">
          {book.imageUrl ? (
            <div className="relative w-full h-full p-4 flex items-center justify-center">
              <img
                src={book.imageUrl}
                alt={book.title}
                className="max-h-full max-w-[80%] object-contain book-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-warm-300">
              <BookOpen className="w-16 h-16 mb-2" />
              <span className="text-sm">이미지 없음</span>
            </div>
          )}

          {/* 위시리스트 버튼 */}
          <button
            onClick={handleToggleWishlist}
            className={clsx(
              'absolute top-3 left-3 p-2.5 rounded-full',
              'bg-white/90 backdrop-blur-sm shadow-warm',
              'hover:bg-white hover:shadow-warm-lg',
              'transition-all duration-200',
              'group/heart'
            )}
          >
            <Heart
              className={clsx(
                'w-5 h-5 transition-all duration-200',
                isWishlisted
                  ? 'fill-error-500 text-error-500'
                  : 'text-warm-400 group-hover/heart:text-error-500'
              )}
            />
          </button>

          {/* 할인율 배지 */}
          {hasDiscount && (
            <div className="absolute top-3 right-3">
              <Badge variant="accent" size="sm">
                {book.discountRate}% OFF
              </Badge>
            </div>
          )}

          {/* 상태 배지 */}
          {book.status !== 'AVAILABLE' && (
            <div className="absolute bottom-3 right-3">
              <StatusBadge status={book.status} />
            </div>
          )}

          {/* 재고 부족 배지 */}
          {book.status === 'AVAILABLE' && book.stockQuantity <= 5 && book.stockQuantity > 0 && (
            <div className="absolute bottom-3 right-3">
              <Badge variant="warning" size="sm" dot>
                재고 {book.stockQuantity}권
              </Badge>
            </div>
          )}
        </div>

        {/* 책 정보 영역 */}
        <div className="p-5">
          {/* 카테고리 */}
          <p className="text-xs font-medium text-primary-500 mb-2 tracking-wide uppercase">
            {book.categoryName || '미분류'}
          </p>

          {/* 제목 */}
          <h3 className="text-lg font-semibold text-warm-900 mb-1.5 line-clamp-2 group-hover:text-primary-600 transition-colors min-h-[3.5rem]">
            {book.title}
          </h3>

          {/* 저자 */}
          <p className="text-sm text-warm-500 mb-2">{book.author}</p>

          {/* 출판사 */}
          <p className="text-xs text-warm-400 mb-4">
            {book.publisher}
          </p>

          {/* 가격 영역 */}
          <div className="flex items-end justify-between pt-4 border-t border-warm-100">
            <div>
              {hasDiscount && (
                <p className="text-sm text-warm-400 line-through">
                  {formatPrice(book.originalPrice)}
                </p>
              )}
              <p className="text-xl font-bold text-primary-600">
                {formatPrice(book.salePrice)}
              </p>
            </div>

            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className="flex items-center gap-1.5"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>담기</span>
            </Button>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BookCard;
