import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import orderService from '../services/orderService';
import reviewService from '../services/reviewService';
import OrderItem from '../components/order/OrderItem';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import ReviewForm from '../components/review/ReviewForm';
import { formatPrice, formatDate } from '../utils/formatters';
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHOD } from '../utils/constants';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [userReviews, setUserReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchOrderDetail();
    fetchUserReviews();
  }, [id]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrder(id);
      setOrder(response.data);
    } catch (error) {
      toast.error('주문 정보를 불러올 수 없습니다');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const response = await reviewService.getMyReviews({ page: 0, size: 100 });
      setUserReviews(response.data.content || []);
    } catch (error) {
      console.error('리뷰 목록 조회 실패:', error);
    }
  };

  const handleWriteReview = (bookId, bookTitle) => {
    setSelectedBook({ id: bookId, title: bookTitle });
    setShowReviewForm(true);
  };

  const handleReviewSubmit = async (data) => {
    try {
      await reviewService.createReview(data);
      toast.success('리뷰가 작성되었습니다');
      setShowReviewForm(false);
      setSelectedBook(null);
      fetchUserReviews(); // Refresh reviews to update button states
    } catch (error) {
      toast.error(error.message || '리뷰 작성에 실패했습니다');
      throw error;
    }
  };

  const hasReviewedBook = (bookId) => {
    return userReviews.some((review) => review.bookId === bookId);
  };

  const handleCancelOrder = async () => {
    const reason = prompt('취소 사유를 입력해주세요:');
    if (!reason) return;

    if (window.confirm('정말 주문을 취소하시겠습니까?')) {
      setCancelling(true);
      try {
        await orderService.cancelOrder(id, reason);
        toast.success('주문이 취소되었습니다');
        fetchOrderDetail();
      } catch (error) {
        toast.error(error.message || '주문 취소에 실패했습니다');
      } finally {
        setCancelling(false);
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!order) {
    return null;
  }

  const canCancel = order.orderStatus === 'PENDING' || order.orderStatus === 'PAID';

  return (
    <div className="max-w-6xl mx-auto">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>뒤로가기</span>
      </button>

      <div className="space-y-6">
        {/* 주문 헤더 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">주문 상세</h1>
              <p className="text-gray-600">주문번호: {order.orderNumber}</p>
              <p className="text-sm text-gray-500">
                주문일시: {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
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
              {canCancel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  {cancelling ? '취소 중...' : '주문 취소'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 배송 정보 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Truck className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold">배송 정보</h2>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">받는 사람</p>
                <p className="font-medium">{order.recipientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">연락처</p>
                <p className="font-medium">{order.recipientPhone}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">배송지</p>
              <p className="font-medium">
                ({order.zipCode}) {order.deliveryAddress}
              </p>
              {order.deliveryAddressDetail && (
                <p className="text-gray-700">{order.deliveryAddressDetail}</p>
              )}
            </div>
            {order.deliveryRequest && (
              <div>
                <p className="text-sm text-gray-600">배송 요청사항</p>
                <p className="text-gray-700">{order.deliveryRequest}</p>
              </div>
            )}
            {order.trackingNumber && (
              <div>
                <p className="text-sm text-gray-600">운송장 번호</p>
                <p className="font-medium text-primary-600">{order.trackingNumber}</p>
              </div>
            )}
          </div>
        </div>

        {/* 주문 상품 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Package className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold">주문 상품</h2>
          </div>
          <div className="space-y-2">
            {order.orderItems.map((item) => (
              <OrderItem
                key={item.id}
                item={item}
                isDelivered={order.orderStatus === 'DELIVERED'}
                hasReviewed={hasReviewedBook(item.bookId)}
                onWriteReview={() => handleWriteReview(item.bookId, item.bookTitle)}
              />
            ))}
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">결제 정보</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>상품 금액</span>
              <span>{formatPrice(order.totalBookPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>배송비</span>
              <span className={order.deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                {order.deliveryFee === 0 ? '무료' : formatPrice(order.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-lg font-bold">총 결제 금액</span>
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(order.totalPaymentAmount)}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t">
              <span className="text-gray-600">결제 수단</span>
              <span className="font-medium">{PAYMENT_METHOD[order.paymentMethod]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">결제 상태</span>
              <span
                className={`font-medium ${
                  order.paymentStatus === 'COMPLETED'
                    ? 'text-green-600'
                    : order.paymentStatus === 'FAILED'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                {PAYMENT_STATUS[order.paymentStatus]}
              </span>
            </div>
            {order.paidAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">결제 일시</span>
                <span className="text-gray-700">{formatDate(order.paidAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* 취소 정보 */}
        {order.orderStatus === 'CANCELLED' && order.cancellationReason && (
          <div className="bg-red-50 rounded-lg border border-red-200 p-6">
            <h2 className="text-xl font-bold text-red-700 mb-2">취소 정보</h2>
            <p className="text-gray-700">
              <span className="font-medium">취소 사유:</span> {order.cancellationReason}
            </p>
            {order.cancelledAt && (
              <p className="text-sm text-gray-600 mt-1">
                취소 일시: {formatDate(order.cancelledAt)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 리뷰 작성 모달 */}
      {showReviewForm && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">리뷰 작성</h2>
              <p className="text-gray-600 mb-6">{selectedBook.title}</p>
              <ReviewForm
                bookId={selectedBook.id}
                onSubmit={handleReviewSubmit}
                onCancel={() => {
                  setShowReviewForm(false);
                  setSelectedBook(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
