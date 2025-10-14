import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import orderService from '../services/orderService';
import Pagination from '../components/common/Pagination';
import Loading from '../components/common/Loading';
import { formatPrice, formatDate } from '../utils/formatters';
import { ORDER_STATUS, PAYMENT_STATUS } from '../utils/constants';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getMyOrders({
        page: currentPage,
        size: pageSize,
        sort: 'createdAt,desc',
      });
      setOrders(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('주문 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <Loading />;
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
          <Link
            to="/books"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            도서 둘러보기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                {/* 주문 헤더 */}
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
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.orderStatus === 'DELIVERED'
                          ? 'bg-green-100 text-green-700'
                          : order.orderStatus === 'CANCELLED'
                          ? 'bg-red-100 text-red-700'
                          : order.orderStatus === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {ORDER_STATUS[order.orderStatus]}
                    </span>
                    <span className="text-xs text-gray-500">
                      {PAYMENT_STATUS[order.paymentStatus]}
                    </span>
                  </div>
                </div>

                {/* 주문 상품 목록 (최대 3개) */}
                <div className="space-y-2 mb-4">
                  {order.orderItems.slice(0, 3).map((item, index) => (
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

                {/* 총 결제 금액 */}
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

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Orders;
