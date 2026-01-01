import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import orderService from '../services/orderService';
import couponService from '../services/couponService';
import OrderItem from '../components/order/OrderItem';
import OrderSummary from '../components/order/OrderSummary';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { PAYMENT_METHOD } from '../utils/constants';

const checkoutSchema = z.object({
  recipientName: z.string().min(1, '받는 사람 이름을 입력해주세요').max(50),
  recipientPhone: z.string().min(1, '전화번호를 입력해주세요').max(20),
  zipCode: z.string().min(1, '우편번호를 입력해주세요').max(10),
  deliveryAddress: z.string().min(1, '배송지 주소를 입력해주세요').max(200),
  deliveryAddressDetail: z.string().max(100).optional(),
  deliveryRequest: z.string().max(500).optional(),
  paymentMethod: z.enum(['CARD', 'BANK_TRANSFER', 'VIRTUAL_ACCOUNT', 'MOBILE']),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, cartSummary } = useCartStore();
  const [loading, setLoading] = useState(false);

  // 쿠폰 관련 상태
  const [coupons, setCoupons] = useState([]);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [discountDescription, setDiscountDescription] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      recipientName: user?.name || '',
      paymentMethod: 'CARD',
    },
  });

  useEffect(() => {
    // 장바구니가 비어있으면 장바구니 페이지로 리다이렉트
    if (!items || items.length === 0) {
      toast.error('장바구니가 비어있습니다');
      navigate('/cart');
    }
  }, [items, navigate]);

  // 사용 가능한 쿠폰 목록 로드
  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const response = await couponService.getMyAvailableCoupons();
        setCoupons(response.data || []);
      } catch (error) {
        console.error('쿠폰 로드 실패:', error);
      }
    };
    loadCoupons();
  }, []);

  // 쿠폰 선택 핸들러
  const handleCouponSelect = async (e) => {
    const couponId = e.target.value;

    if (!couponId) {
      setSelectedCouponId(null);
      setCouponDiscount(0);
      setDiscountDescription('');
      return;
    }

    try {
      const response = await couponService.calculateDiscount(
        couponId,
        totalBookPrice,
        deliveryFee
      );
      setSelectedCouponId(couponId);
      setCouponDiscount(response.data.discountAmount || 0);
      setDiscountDescription(response.data.discountDescription || '');
    } catch (error) {
      toast.error(error.response?.data?.message || '쿠폰 적용에 실패했습니다');
      setSelectedCouponId(null);
      setCouponDiscount(0);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // 선택된 아이템만 주문
      const selectedItems = items.filter((item) => item.selected);

      if (selectedItems.length === 0) {
        toast.error('주문할 상품을 선택해주세요');
        return;
      }

      const orderItems = selectedItems.map((item) => ({
        bookId: item.bookId,
        quantity: item.quantity,
      }));

      const orderData = {
        ...data,
        orderItems,
        userCouponId: selectedCouponId ? Number(selectedCouponId) : null,
      };

      const response = await orderService.createOrder(orderData);
      toast.success('주문이 완료되었습니다!');
      navigate(`/orders/${response.data.id}`);
    } catch (error) {
      toast.error(error.message || '주문에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  const selectedItems = items.filter((item) => item.selected);
  const totalBookPrice = cartSummary?.selectedTotalPrice || 0;
  const FREE_SHIPPING_THRESHOLD = 30000;
  const deliveryFee = totalBookPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 3000;
  const finalPayment = totalBookPrice + deliveryFee - couponDiscount;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">주문/결제</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 주문 정보 입력 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 배송지 정보 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">배송지 정보</h2>
              <div className="space-y-4">
                <Input
                  label="받는 사람"
                  {...register('recipientName')}
                  error={errors.recipientName?.message}
                  placeholder="받는 사람 이름"
                />
                <Input
                  label="전화번호"
                  {...register('recipientPhone')}
                  error={errors.recipientPhone?.message}
                  placeholder="010-1234-5678"
                />
                <Input
                  label="우편번호"
                  {...register('zipCode')}
                  error={errors.zipCode?.message}
                  placeholder="12345"
                />
                <Input
                  label="주소"
                  {...register('deliveryAddress')}
                  error={errors.deliveryAddress?.message}
                  placeholder="서울시 강남구..."
                />
                <Input
                  label="상세주소"
                  {...register('deliveryAddressDetail')}
                  error={errors.deliveryAddressDetail?.message}
                  placeholder="101동 201호"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    배송 요청사항
                  </label>
                  <textarea
                    {...register('deliveryRequest')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="3"
                    placeholder="배송 시 요청사항을 입력해주세요"
                  />
                  {errors.deliveryRequest && (
                    <p className="mt-1 text-sm text-gray-900">{errors.deliveryRequest.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 결제 수단 선택 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">결제 수단</h2>
              <div className="space-y-2">
                {Object.entries(PAYMENT_METHOD).map(([key, label]) => (
                  <label key={key} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      {...register('paymentMethod')}
                      value={key}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className="mt-2 text-sm text-gray-900">{errors.paymentMethod.message}</p>
              )}
            </div>

            {/* 쿠폰 선택 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">쿠폰 적용</h2>
              <div className="space-y-4">
                <select
                  value={selectedCouponId || ''}
                  onChange={handleCouponSelect}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="">쿠폰 선택 안함</option>
                  {coupons.map((coupon) => (
                    <option key={coupon.id} value={coupon.id}>
                      {coupon.couponName} - {coupon.discountDescription}
                    </option>
                  ))}
                </select>
                {couponDiscount > 0 && (
                  <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg border border-primary-200">
                    <span className="text-primary-700 font-medium">{discountDescription}</span>
                    <span className="text-primary-600 font-bold">
                      -{couponDiscount.toLocaleString()}원
                    </span>
                  </div>
                )}
                {coupons.length === 0 && (
                  <p className="text-gray-500 text-sm">사용 가능한 쿠폰이 없습니다</p>
                )}
              </div>
            </div>

            {/* 주문 상품 목록 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">주문 상품</h2>
              <div className="space-y-2">
                {selectedItems.map((item) => (
                  <OrderItem
                    key={item.id}
                    item={{
                      ...item,
                      bookTitle: item.bookTitle,
                      bookAuthor: item.bookAuthor,
                      bookCoverImageUrl: item.bookCoverImageUrl,
                      orderPrice: item.bookCurrentPrice,
                      totalPrice: item.totalPrice,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 결제 금액 요약 */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <OrderSummary
                totalBookPrice={totalBookPrice}
                deliveryFee={deliveryFee}
                couponDiscount={couponDiscount}
              />
              <Button
                type="submit"
                size="lg"
                className="w-full mt-4"
                disabled={loading || selectedItems.length === 0}
              >
                {loading ? '주문 중...' : '결제하기'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
