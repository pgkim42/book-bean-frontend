'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import useCartStore from '@/lib/store/cartStore';
import useAuthStore from '@/lib/store/authStore';
import useWishlistStore from '@/lib/store/wishlistStore';
import { formatPrice } from '@/lib/utils/formatters';
import { BOOK_STATUS } from '@/lib/utils/constants';
import type { Book } from '@/lib/types';

interface BookDetailContentProps {
  book: Book;
}

/**
 * 도서 상세 페이지의 인터랙티브한 부분 (클라이언트 컴포넌트)
 * - 수량 선택
 * - 장바구니 추가
 * - 위시리스트 토글
 */
export default function BookDetailContent({ book }: BookDetailContentProps) {
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const [quantity, setQuantity] = useState(1);
  const isWishlisted = isInWishlist(book.id);
  const isAvailable = book.status === 'AVAILABLE' && book.stockQuantity > 0;

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

  return (
    <div className="space-y-6">
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
  );
}
