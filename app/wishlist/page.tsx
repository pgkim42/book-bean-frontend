'use client';

import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useWishlistStore from '@/lib/store/wishlistStore';
import useCartStore from '@/lib/store/cartStore';
import useAuthStore from '@/lib/store/authStore';
import bookService from '@/lib/services/bookService';
import { formatPrice } from '@/lib/utils/formatters';

// 임시 BookCard 컴포넌트
const BookCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-200 rounded w-1/2" />
  </div>
);

const BookCard = ({ book }: { book: any }) => (
  <a
    href={`/books/${book.id}`}
    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
  >
    <div className="relative">
      {book.imageUrl ? (
        <img
          src={book.imageUrl}
          alt={book.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>
      )}
      {book.status !== 'AVAILABLE' && (
        <span className="absolute top-2 right-2 px-2 py-1 bg-gray-800 text-white text-xs rounded">
          {book.status === 'OUT_OF_STOCK' ? '품절' : '절판'}
        </span>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-bold text-gray-900 line-clamp-2 mb-1">{book.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{book.author}</p>
      <div className="flex items-center gap-2">
        {book.discountRate > 0 && (
          <span className="text-sm text-gray-400 line-through">
            {formatPrice(book.originalPrice)}
          </span>
        )}
        <span className="font-bold text-gray-900">{formatPrice(book.salePrice)}</span>
      </div>
    </div>
  </a>
);

export default function WishlistPage() {
  const router = useRouter();
  const { wishlist, removeFromWishlist, loading: wishlistLoading } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlistBooks();
  }, [wishlist]);

  const fetchWishlistBooks = async () => {
    if (wishlist.length === 0) {
      setBooks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // wishlist는 WishlistItem[] 타입이므로 bookId를 추출
      const bookPromises = wishlist.map((item) => bookService.getBook(item.bookId));
      const bookResponses = await Promise.all(bookPromises);
      // api.ts 인터셉터가 response.data를 반환하므로 직접 사용
      const booksData = bookResponses.map((response: any) => response.data || response);
      setBooks(booksData);
    } catch (error) {
      console.error('Failed to fetch wishlist books:', error);
      toast.error('위시리스트를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllToCart = async () => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다');
      router.push('/login');
      return;
    }

    try {
      // 각 위시리스트 아이템을 장바구니에 추가
      for (const item of wishlist) {
        await addToCart({ bookId: item.bookId, quantity: 1 });
      }
      toast.success('모든 상품이 장바구니에 추가되었습니다');
    } catch (error) {
      toast.error('장바구니 추가에 실패했습니다');
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm('위시리스트를 전체 삭제하시겠습니까?')) {
      try {
        // 각 아이템을 개별 삭제
        for (const item of wishlist) {
          await removeFromWishlist(item.bookId);
        }
        toast.success('위시리스트가 전체 삭제되었습니다');
      } catch (error) {
        toast.error('삭제에 실패했습니다');
      }
    }
  };

  if (loading || wishlistLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">위시리스트</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">위시리스트가 비어있습니다</h2>
        <p className="text-gray-600 mb-8">마음에 드는 도서를 위시리스트에 담아보세요</p>
        <a href="/books">
          <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            도서 둘러보기
          </button>
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">위시리스트</h1>
          <p className="text-gray-600">{books.length}개의 상품</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClearWishlist}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Trash2 className="w-4 h-4" />
            전체 삭제
          </button>
          <button
            onClick={handleAddAllToCart}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <ShoppingCart className="w-4 h-4" />
            전체 장바구니 담기
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
