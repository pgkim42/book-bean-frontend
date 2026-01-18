'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import useCartStore from '@/lib/store/cartStore';
import useAuthStore from '@/lib/store/authStore';
import { formatPrice } from '@/lib/utils/formatters';
import type { CartItem } from '@/lib/types';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { items, cartSummary, loading, fetchCart, updateCartItem, removeCartItem } = useCartStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated, fetchCart, router]);

  const handleUpdateQuantity = async (cartItemId: number, quantity: number) => {
    await updateCartItem(cartItemId, quantity);
  };

  const handleRemoveItem = async (cartItemId: number) => {
    if (window.confirm('장바구니에서 삭제하시겠습니까?')) {
      await removeCartItem(cartItemId);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">장바구니</h1>
        <p className="text-gray-600">
          {items.length > 0
            ? `총 ${items.length}개의 상품이 담겨있습니다`
            : '장바구니가 비어있습니다'}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-md">
          <ShoppingCart className="w-24 h-24 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            장바구니가 비어있습니다
          </h2>
          <p className="text-gray-500 mb-6">
            원하는 상품을 장바구니에 담아보세요
          </p>
          <Link href="/books">
            <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              도서 둘러보기
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item: CartItem) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex gap-4">
                {item.bookCoverImageUrl ? (
                  <img
                    src={item.bookCoverImageUrl}
                    alt={item.bookTitle}
                    className="w-20 h-28 object-cover rounded"
                  />
                ) : (
                  <div className="w-20 h-28 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{item.bookTitle}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.bookAuthor}</p>
                  <p className="font-bold text-primary-600">
                    {formatPrice(item.bookCurrentPrice)}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-2 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm font-medium">
                    {formatPrice(item.totalPrice || item.bookCurrentPrice * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">주문 요약</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>상품 금액</span>
                  <span>{formatPrice(cartSummary?.totalPrice || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>배송비</span>
                  <span>{formatPrice(cartSummary?.deliveryFee || 0)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t text-lg font-bold">
                  <span>총 결제 금액</span>
                  <span className="text-primary-600">
                    {formatPrice(cartSummary?.finalAmount || cartSummary?.totalPrice || 0)}
                  </span>
                </div>
              </div>
              <Link href="/checkout">
                <button className="w-full mt-6 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                  결제하기
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
