import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import useCartStore from '../store/cartStore';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';

const Cart = () => {
  const { items, cartSummary, loading, fetchCart, updateCartItem, removeCartItem } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (cartItemId, quantity) => {
    await updateCartItem(cartItemId, quantity);
  };

  const handleRemoveItem = async (cartItemId) => {
    if (window.confirm('장바구니에서 삭제하시겠습니까?')) {
      await removeCartItem(cartItemId);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">장바구니</h1>
        <p className="text-gray-600">
          {items.length > 0
            ? `총 ${items.length}개의 상품이 담겨있습니다`
            : '장바구니가 비어있습니다'}
        </p>
      </div>

      {items.length === 0 ? (
        /* 빈 장바구니 */
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-md">
          <ShoppingCart className="w-24 h-24 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            장바구니가 비어있습니다
          </h2>
          <p className="text-gray-500 mb-6">
            원하는 상품을 장바구니에 담아보세요
          </p>
          <Link to="/books">
            <Button size="lg">도서 둘러보기</Button>
          </Link>
        </div>
      ) : (
        /* 장바구니 내용 */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 장바구니 아이템 목록 */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          {/* 오른쪽: 주문 요약 */}
          <div className="lg:col-span-1">
            <CartSummary cartSummary={cartSummary} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
