import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { BOOK_STATUS } from '../../utils/constants';
import Button from '../common/Button';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const BookCard = ({ book }) => {
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

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

  const isAvailable = book.status === 'AVAILABLE' && book.stockQuantity > 0;

  return (
    <Link to={`/books/${book.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
        {/* 책 이미지 */}
        <div className="relative h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
          {book.imageUrl ? (
            <img
              src={book.imageUrl}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="text-gray-400 text-center p-4">
              <p className="text-sm">이미지 없음</p>
            </div>
          )}

          {/* 상태 배지 */}
          {book.status !== 'AVAILABLE' && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              {BOOK_STATUS[book.status]}
            </div>
          )}

          {/* 재고 부족 배지 */}
          {book.status === 'AVAILABLE' && book.stockQuantity <= 5 && book.stockQuantity > 0 && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              재고 {book.stockQuantity}권
            </div>
          )}
        </div>

        {/* 책 정보 */}
        <div className="p-4">
          {/* 카테고리 */}
          <p className="text-xs text-primary-600 font-medium mb-1">
            {book.categoryName || '미분류'}
          </p>

          {/* 제목 */}
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {book.title}
          </h3>

          {/* 저자 */}
          <p className="text-sm text-gray-600 mb-2">{book.author}</p>

          {/* 출판사 및 출판일 */}
          <p className="text-xs text-gray-500 mb-3">
            {book.publisher} · {book.publicationDate}
          </p>

          {/* 가격 및 장바구니 버튼 */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary-600">
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
