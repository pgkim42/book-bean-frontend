import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Truck, Package, LayoutGrid, Table, List } from 'lucide-react';
import toast from 'react-hot-toast';
import orderService from '../../services/orderService';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import Loading from '../../components/common/Loading';
import { formatPrice, formatDate } from '../../utils/formatters';
import { ORDER_STATUS, PAYMENT_STATUS } from '../../utils/constants';

const VIEW_MODES = {
  CARD: 'card',
  TABLE: 'table',
  COMPACT: 'compact',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('adminOrdersViewMode') || VIEW_MODES.CARD;
  });
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

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('adminOrdersViewMode', mode);
  };

  const renderOrderActions = (order) => (
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
          className="flex items-center space-x-1 bg-gray-800 hover:bg-gray-900"
        >
          <Truck className="w-4 h-4" />
          <span>배송 시작</span>
        </Button>
      )}
      {order.orderStatus === 'SHIPPED' && (
        <Button
          size="sm"
          onClick={() => handleCompleteDelivery(order.id)}
          className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-900"
        >
          <Package className="w-4 h-4" />
          <span>배송 완료</span>
        </Button>
      )}
    </div>
  );

  const renderCardView = () => (
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
                        ? 'bg-gray-100 text-gray-900'
                        : order.orderStatus === 'CANCELLED'
                        ? 'bg-gray-200 text-gray-900'
                        : order.orderStatus === 'SHIPPED'
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-gray-100 text-gray-800'
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
              {renderOrderActions(order)}
            </div>
          </div>
        ))}
    </div>
  );

  const renderTableView = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                주문정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                수령인
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                금액
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    {order.orderNumber}
                  </Link>
                  <div className="text-xs text-gray-500 mt-1">{formatDate(order.createdAt)}</div>
                  <div className="text-xs text-gray-500">상품 {order.orderItems.length}개</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.recipientName}</div>
                  <div className="text-xs text-gray-500">{order.recipientPhone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <span
                      className={`px-2 py-1 text-xs rounded-full text-center ${
                        order.orderStatus === 'DELIVERED'
                          ? 'bg-gray-100 text-gray-900'
                          : order.orderStatus === 'CANCELLED'
                          ? 'bg-gray-200 text-gray-900'
                          : order.orderStatus === 'SHIPPED'
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {ORDER_STATUS[order.orderStatus]}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs text-center">
                      {PAYMENT_STATUS[order.paymentStatus]}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatPrice(order.totalPaymentAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {renderOrderActions(order)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCompactView = () => (
    <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
      {orders.map((order) => (
        <div key={order.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
          <div className="flex-1 flex items-center space-x-4">
            <Link
              to={`/orders/${order.id}`}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 min-w-[120px]"
            >
              {order.orderNumber}
            </Link>
            <div className="text-sm text-gray-600 min-w-[100px]">{order.recipientName}</div>
            <div className="flex space-x-2">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  order.orderStatus === 'DELIVERED'
                    ? 'bg-gray-100 text-gray-900'
                    : order.orderStatus === 'CANCELLED'
                    ? 'bg-gray-200 text-gray-900'
                    : order.orderStatus === 'SHIPPED'
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {ORDER_STATUS[order.orderStatus]}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {PAYMENT_STATUS[order.paymentStatus]}
              </span>
            </div>
            <div className="text-sm font-medium text-gray-900 min-w-[100px]">
              {formatPrice(order.totalPaymentAmount)}
            </div>
            <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
          </div>
          <div className="ml-4">{renderOrderActions(order)}</div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">주문 관리</h1>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={viewMode === VIEW_MODES.CARD ? 'primary' : 'outline'}
            onClick={() => handleViewModeChange(VIEW_MODES.CARD)}
            className="flex items-center space-x-1"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>카드</span>
          </Button>
          <Button
            size="sm"
            variant={viewMode === VIEW_MODES.TABLE ? 'primary' : 'outline'}
            onClick={() => handleViewModeChange(VIEW_MODES.TABLE)}
            className="flex items-center space-x-1"
          >
            <Table className="w-4 h-4" />
            <span>테이블</span>
          </Button>
          <Button
            size="sm"
            variant={viewMode === VIEW_MODES.COMPACT ? 'primary' : 'outline'}
            onClick={() => handleViewModeChange(VIEW_MODES.COMPACT)}
            className="flex items-center space-x-1"
          >
            <List className="w-4 h-4" />
            <span>컴팩트</span>
          </Button>
        </div>
      </div>

      {viewMode === VIEW_MODES.CARD && renderCardView()}
      {viewMode === VIEW_MODES.TABLE && renderTableView()}
      {viewMode === VIEW_MODES.COMPACT && renderCompactView()}

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
