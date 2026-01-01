'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';
import orderService from '@/lib/services/orderService';
import useAuthStore from '@/lib/store/authStore';
import { formatPrice, formatDate } from '@/lib/utils/formatters';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/lib/utils/constants';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, currentPage, router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response: any = await orderService.getMyOrders({
        page: currentPage,
        size: pageSize,
        sort: 'createdAt,desc',
      });
      setOrders(response.data?.content || []);
      setTotalPages(response.data?.totalPages || 0);
    } catch (error) {
      console.error('주문 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">주문 내역</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-md">
          <Package className="w-24 h-24 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            주문 내역이 없습니다
          </h2>
          <p className="text-gray-500 mb-6">
            도서를 주문해보세요
          </p>
          <Link href="/books">
            <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              도서 둘러보기
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      주문번호: {order.orderNumber}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${order.orderStatus === 'DELIVERED'
                        ? 'bg-gray-100 text-gray-900'
                        : order.orderStatus === 'CANCELLED'
                          ? 'bg-gray-200 text-gray-900'
                          : order.orderStatus === 'SHIPPED'
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {ORDER_STATUS[order.orderStatus as keyof typeof ORDER_STATUS]}
                    </span>
                    <span className="text-xs text-gray-500">
                      {PAYMENT_STATUS[order.paymentStatus as keyof typeof PAYMENT_STATUS]}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {order.orderItems.slice(0, 3).map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      {item.bookCoverImageUrl && (
                        <img
                          src={item.bookCoverImageUrl}
                          alt={item.bookTitle}
                          className="w-12 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.bookTitle}</p>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.orderPrice)} × {item.quantity}개
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.orderItems.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      외 {order.orderItems.length - 3}개
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-gray-700">총 결제 금액</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(order.totalPaymentAmount)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`px-3 py-2 border rounded-lg ${currentPage === i
                ? 'bg-primary-600 text-white border-primary-600'
                : 'border-gray-300 hover:bg-gray-50'
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
