import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { BOOK_STATUS } from '../../utils/constants';
import Button from '../common/Button';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import useWishlistStore from '../../store/wishlistStore';
import toast from 'react-hot-toast';

const BookCard = ({ book }) => {
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(book.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();

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

  return (
    <Link to={`/books/${book.id}`}>
      <div className="bg-white rounded-3xl shadow-apple hover:shadow-apple-lg transition-all duration-300 overflow-hidden group">
        {/* 책 이미지 */}
        <div className="relative h-72 bg-primary-50 flex items-center justify-center overflow-hidden">
          {book.imageUrl ? (
            <img
              src={book.imageUrl}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-primary-400 text-center p-4">
              <p className="text-sm">이미지 없음</p>
            </div>
          )}

          {/* 위시리스트 버튼 */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-apple hover:bg-white transition-all duration-200 group/heart"
          >
            <Heart
              className={`w-5 h-5 transition-all duration-200 ${
                isWishlisted
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600 group-hover/heart:text-red-500'
              }`}
            />
          </button>

          {/* 상태 배지 */}
          {book.status !== 'AVAILABLE' && (
            <div className="absolute top-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-apple">
              {BOOK_STATUS[book.status]}
            </div>
          )}

          {/* 재고 부족 배지 */}
          {book.status === 'AVAILABLE' && book.stockQuantity <= 5 && book.stockQuantity > 0 && (
            <div className="absolute top-4 right-4 bg-gray-700 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-apple">
              재고 {book.stockQuantity}권
            </div>
          )}
        </div>

        {/* 책 정보 */}
        <div className="p-6">
          {/* 카테고리 */}
          <p className="text-xs text-primary-500 font-medium mb-2 tracking-wide">
            {book.categoryName || '미분류'}
          </p>

          {/* 제목 */}
          <h3 className="text-xl font-semibold text-primary-600 mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
            {book.title}
          </h3>

          {/* 저자 */}
          <p className="text-sm text-primary-500 mb-3">{book.author}</p>

          {/* 출판사 및 출판일 */}
          <p className="text-xs text-primary-400 mb-4">
            {book.publisher} · {book.publicationDate}
          </p>

          {/* 가격 및 장바구니 버튼 */}
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-2xl font-semibold text-primary-600">
                {formatPrice(book.salePrice)}
              </span>
            </div>

            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className="flex items-center space-x-1"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>담기</span>
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
