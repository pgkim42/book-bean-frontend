'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import useCartStore from '@/lib/store/cartStore';
import useAuthStore from '@/lib/store/authStore';
import orderService from '@/lib/services/orderService';
import couponService from '@/lib/services/couponService';
import { formatPrice } from '@/lib/utils/formatters';
import { PAYMENT_METHOD } from '@/lib/utils/constants';

const checkoutSchema = z.object({
  recipientName: z.string().min(1, '받는 사람 이름을 입력해주세요').max(50),
  recipientPhone: z.string().min(1, '전화번호를 입력해주세요').max(20),
  zipCode: z.string().min(1, '우편번호를 입력해주세요').max(10),
  deliveryAddress: z.string().min(1, '배송지 주소를 입력해주세요').max(200),
  deliveryAddressDetail: z.string().max(100).optional(),
  deliveryRequest: z.string().max(500).optional(),
  paymentMethod: z.enum(['CARD', 'BANK_TRANSFER', 'VIRTUAL_ACCOUNT', 'MOBILE']),
});

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { items, cartSummary } = useCartStore();
  const [loading, setLoading] = useState(false);

  const [coupons, setCoupons] = useState<any[]>([]);
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
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
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다');
      router.push('/login');
      return;
    }
    if (!items || items.length === 0) {
      toast.error('장바구니가 비어있습니다');
      router.push('/cart');
    }
  }, [items, router, isAuthenticated]);

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const response: any = await couponService.getMyAvailableCoupons();
        setCoupons(response.data || []);
      } catch (error) {
        console.error('쿠폰 로드 실패:', error);
      }
    };
    loadCoupons();
  }, []);

  const handleCouponSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const couponId = e.target.value;

    if (!couponId) {
      setSelectedCouponId(null);
      setCouponDiscount(0);
      setDiscountDescription('');
      return;
    }

    try {
      const totalBookPrice = cartSummary?.totalPrice || 0;
      const deliveryFee = totalBookPrice >= 30000 ? 0 : 3000;

      const response: any = await couponService.calculateDiscount(
        couponId,
        totalBookPrice,
        deliveryFee
      );
      setSelectedCouponId(couponId);
      setCouponDiscount(response.data.discountAmount || 0);
      setDiscountDescription(response.data.discountDescription || '');
    } catch (error) {
      toast.error('쿠폰 적용에 실패했습니다');
      setSelectedCouponId(null);
      setCouponDiscount(0);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const selectedItems = items.filter((item: any) => item.selected !== false);

      if (selectedItems.length === 0) {
        toast.error('주문할 상품을 선택해주세요');
        return;
      }

      const orderItems = selectedItems.map((item: any) => ({
        bookId: item.bookId,
        quantity: item.quantity,
      }));

      const orderData = {
        ...data,
        orderItems,
        userCouponId: selectedCouponId ? Number(selectedCouponId) : null,
      };

      const response: any = await orderService.createOrder(orderData);
      toast.success('주문이 완료되었습니다!');
      router.push(`/orders/${response.data.id}`);
    } catch (error: any) {
      toast.error(error.message || '주문에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  const selectedItems = items.filter((item: any) => item.selected !== false);
  const totalBookPrice = cartSummary?.totalPrice || 0;
  const FREE_SHIPPING_THRESHOLD = 30000;
  const deliveryFee = totalBookPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 3000;
  const finalPayment = totalBookPrice + deliveryFee - couponDiscount;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">주문/결제</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">배송지 정보</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    받는 사람
                  </label>
                  <input
                    {...register('recipientName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="받는 사람 이름"
                  />
                  {errors.recipientName && (
                    <p className="mt-1 text-sm text-red-500">{errors.recipientName.message?.toString()}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전화번호
                  </label>
                  <input
                    {...register('recipientPhone')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="010-1234-5678"
                  />
                  {errors.recipientPhone && (
                    <p className="mt-1 text-sm text-red-500">{errors.recipientPhone.message?.toString()}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    우편번호
                  </label>
                  <input
                    {...register('zipCode')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="12345"
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-sm text-red-500">{errors.zipCode.message?.toString()}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    주소
                  </label>
                  <input
                    {...register('deliveryAddress')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="서울시 강남구..."
                  />
                  {errors.deliveryAddress && (
                    <p className="mt-1 text-sm text-red-500">{errors.deliveryAddress.message?.toString()}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상세주소
                  </label>
                  <input
                    {...register('deliveryAddressDetail')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="101동 201호"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    배송 요청사항
                  </label>
                  <textarea
                    {...register('deliveryRequest')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    placeholder="배송 시 요청사항을 입력해주세요"
                  />
                </div>
              </div>
            </div>

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
                    <span className="text-gray-700">{label as string}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">쿠폰 적용</h2>
              <div className="space-y-4">
                <select
                  value={selectedCouponId || ''}
                  onChange={handleCouponSelect}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
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

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">주문 상품</h2>
              <div className="space-y-2">
                {selectedItems.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 py-2 border-b last:border-b-0">
                    {item.bookCoverImageUrl ? (
                      <img
                        src={item.bookCoverImageUrl}
                        alt={item.bookTitle}
                        className="w-12 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.bookTitle}</p>
                      <p className="text-sm text-gray-600">{item.bookAuthor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{formatPrice(item.bookCurrentPrice)} × {item.quantity}</p>
                      <p className="font-medium">{formatPrice(item.totalPrice || item.bookCurrentPrice * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">결제 금액</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>상품 금액</span>
                    <span>{formatPrice(totalBookPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>배송비</span>
                    <span className={deliveryFee === 0 ? 'text-gray-700 font-medium' : ''}>
                      {deliveryFee === 0 ? '무료' : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-primary-600">
                      <span>쿠폰 할인</span>
                      <span>-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-lg font-bold">총 결제 금액</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {formatPrice(finalPayment)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || selectedItems.length === 0}
                className="w-full mt-4 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? '주문 중...' : '결제하기'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
