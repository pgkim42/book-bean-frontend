import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Truck, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import orderService from '../../services/orderService';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import Loading from '../../components/common/Loading';
import { formatPrice, formatDate } from '../../utils/formatters';
import { ORDER_STATUS, PAYMENT_STATUS } from '../../utils/constants';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // 관리자용 전체 주문 조회 API 사용
      const response = await orderService.getAllOrders({
        page: currentPage,
        size: pageSize,
        sort: 'createdAt,desc',
      });
      setOrders(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      toast.error('주문 목록을 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (orderId) => {
    if (window.confirm('결제를 확인하시겠습니까?')) {
      try {
        await orderService.confirmPayment(orderId);
        toast.success('결제가 확인되었습니다');
        fetchOrders();
      } catch (error) {
        toast.error(error.message || '결제 확인에 실패했습니다');
      }
    }
  };

  const handleStartShipping = async (orderId) => {
    const trackingNumber = prompt('운송장 번호를 입력하세요:');
    if (!trackingNumber) return;

    try {
      await orderService.startShipping(orderId, trackingNumber);
      toast.success('배송이 시작되었습니다');
      fetchOrders();
    } catch (error) {
      toast.error(error.message || '배송 시작에 실패했습니다');
    }
  };

  const handleCompleteDelivery = async (orderId) => {
    if (window.confirm('배송 완료 처리하시겠습니까?')) {
      try {
        await orderService.completeDelivery(orderId);
        toast.success('배송이 완료되었습니다');
        fetchOrders();
      } catch (error) {
        toast.error(error.message || '배송 완료 처리에 실패했습니다');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">주문 관리</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Link
                  to={`/orders/${order.id}`}
                  className="text-lg font-bold text-primary-600 hover:text-primary-700"
                >
                  주문번호: {order.orderNumber}
                </Link>
                <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                <p className="text-sm text-gray-600">
                  {order.recipientName} / {order.recipientPhone}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className="flex space-x-2">
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
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {PAYMENT_STATUS[order.paymentStatus]}
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {formatPrice(order.totalPaymentAmount)}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-700 mb-2">
                상품 {order.orderItems.length}개
              </p>
              <div className="flex space-x-2">
                {order.orderStatus === 'PENDING' && order.paymentStatus === 'PENDING' && (
                  <Button
                    size="sm"
                    onClick={() => handleConfirmPayment(order.id)}
                    className="flex items-center space-x-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>결제 확인</span>
                  </Button>
                )}
                {order.orderStatus === 'PAID' && (
                  <Button
                    size="sm"
                    onClick={() => handleStartShipping(order.id)}
                    className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Truck className="w-4 h-4" />
                    <span>배송 시작</span>
                  </Button>
                )}
                {order.orderStatus === 'SHIPPED' && (
                  <Button
                    size="sm"
                    onClick={() => handleCompleteDelivery(order.id)}
                    className="flex items-center space-x-1 bg-green-600 hover:bg-green-700"
                  >
                    <Package className="w-4 h-4" />
                    <span>배송 완료</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
