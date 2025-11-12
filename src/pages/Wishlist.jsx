import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useWishlistStore from '../store/wishlistStore';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import bookService from '../services/bookService';
import BookCard from '../components/book/BookCard';
import BookCardSkeleton from '../components/book/BookCardSkeleton';
import Button from '../components/common/Button';

const Wishlist = () => {
  const { wishlist, clearWishlist, addWishlistToCart, loading: wishlistLoading } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [books, setBooks] = useState([]);
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
      // 위시리스트의 각 도서 정보 가져오기
      const bookPromises = wishlist.map((bookId) => bookService.getBook(bookId));
      const bookResponses = await Promise.all(bookPromises);
      const booksData = bookResponses.map((response) => response.data);
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
      return;
    }

    if (isAuthenticated) {
      // 로그인 사용자: 서버 API 사용
      const success = await addWishlistToCart();
      if (success) {
        toast.success('모든 상품이 장바구니에 추가되었습니다');
      } else {
        toast.error('장바구니 추가에 실패했습니다');
      }
    } else {
      // 비로그인 사용자: 각 도서를 개별 추가
      let successCount = 0;
      for (const book of books) {
        if (book.status === 'AVAILABLE' && book.stockQuantity > 0) {
          const success = await addToCart({
            bookId: book.id,
            quantity: 1,
          });
          if (success) successCount++;
        }
      }
      if (successCount > 0) {
        toast.success(`${successCount}개 상품이 장바구니에 추가되었습니다`);
      }
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm('위시리스트를 전체 삭제하시겠습니까?')) {
      const success = await clearWishlist();
      if (success) {
        toast.success('위시리스트가 전체 삭제되었습니다');
      } else {
        toast.error('삭제에 실패했습니다');
      }
    }
  };

  if (loading || wishlistLoading) {
    return (
      <div className="space-y-6">
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
        <Button onClick={() => (window.location.href = '/books')}>도서 둘러보기</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">위시리스트</h1>
          <p className="text-gray-600">{books.length}개의 상품</p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClearWishlist}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            전체 삭제
          </Button>
          <Button onClick={handleAddAllToCart} className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            전체 장바구니 담기
          </Button>
        </div>
      </div>

      {/* 도서 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
