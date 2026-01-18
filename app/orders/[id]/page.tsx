'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import orderService from '@/lib/services/orderService';
import reviewService from '@/lib/services/reviewService';
import { formatPrice, formatDate } from '@/lib/utils/formatters';
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHOD } from '@/lib/utils/constants';
import type { Order, Review, ReviewCreateRequest, Book } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState<{ id: number; title: string } | null>(null);

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
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const response = await reviewService.getMyReviews({ page: 0, size: 100 });
      setUserReviews(response.data?.content || []);
    } catch (error) {
      console.error('리뷰 목록 조회 실패:', error);
    }
  };

  const handleWriteReview = (bookId: number, bookTitle: string) => {
    setSelectedBook({ id: bookId, title: bookTitle });
    setShowReviewForm(true);
  };

  const handleReviewSubmit = async (data: ReviewCreateRequest) => {
    try {
      await reviewService.createReview(data);
      toast.success('리뷰가 작성되었습니다');
      setShowReviewForm(false);
      setSelectedBook(null);
      fetchUserReviews();
    } catch (error) {
      const message = error instanceof Error ? error.message : '$1';
      toast.error(message);
      throw error;
    }
  };

  const hasReviewedBook = (bookId: number) => {
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
        const message = error instanceof Error ? error.message : '주문 취소에 실패했습니다';
        toast.error(message);
      } finally {
        setCancelling(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const canCancel = order.orderStatus === 'PENDING' || order.orderStatus === 'PAID';

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>뒤로가기</span>
      </button>

      <div className="space-y-6">
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
              {canCancel && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {cancelling ? '취소 중...' : '주문 취소'}
                </button>
              )}
            </div>
          </div>
        </div>

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

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Package className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold">주문 상품</h2>
          </div>
          <div className="space-y-4">
            {order.orderItems.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                {item.bookCoverImageUrl && (
                  <img
                    src={item.bookCoverImageUrl}
                    alt={item.bookTitle}
                    className="w-16 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.bookTitle}</p>
                  <p className="text-sm text-gray-600">{formatPrice(item.orderPrice)} × {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(item.totalPrice || item.orderPrice * item.quantity)}</p>
                  {order.orderStatus === 'DELIVERED' && !hasReviewedBook(item.bookId) && (
                    <button
                      onClick={() => handleWriteReview(item.bookId, item.bookTitle)}
                      className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                    >
                      리뷰 작성
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">결제 정보</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>상품 금액</span>
              <span>{formatPrice(order.totalBookPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>배송비</span>
              <span className={order.deliveryFee === 0 ? 'text-gray-700 font-medium' : ''}>
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
              <span className="font-medium">{PAYMENT_STATUS[order.paymentStatus]}</span>
            </div>
            {order.paidAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">결제 일시</span>
                <span className="text-gray-700">{formatDate(order.paidAt)}</span>
              </div>
            )}
          </div>
        </div>

        {order.orderStatus === 'CANCELLED' && order.cancellationReason && (
          <div className="bg-gray-100 rounded-lg border border-gray-300 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">취소 정보</h2>
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

      {showReviewForm && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">리뷰 작성</h2>
            <p className="text-gray-600 mb-6">{selectedBook.title}</p>
            <ReviewForm bookId={selectedBook.id} onSubmit={handleReviewSubmit} onCancel={() => { setShowReviewForm(false); setSelectedBook(null); }} />
          </div>
        </div>
      )}
    </div>
  );
}

const ReviewForm = ({ bookId, onSubmit, onCancel }: { bookId: number; onSubmit: (data: any) => Promise<void>; onCancel: () => void }) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ bookId, rating, title, content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">평점</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => setRating(star)} className={`text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}>
              ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">제목</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">리뷰 내용</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={4} required />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">저장</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg">취소</button>
      </div>
    </form>
  );
};
