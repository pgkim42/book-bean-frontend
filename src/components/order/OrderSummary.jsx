import { formatPrice } from '../../utils/formatters';

const OrderSummary = ({ totalBookPrice, deliveryFee, couponDiscount = 0 }) => {
  const totalPaymentAmount = totalBookPrice + deliveryFee - couponDiscount;

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">결제 금액</h3>

      <div className="space-y-3 mb-4 pb-4 border-b">
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
            <span className="font-medium">-{formatPrice(couponDiscount)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <span className="text-lg font-bold">최종 결제 금액</span>
        <span className="text-2xl font-bold text-primary-600">
          {formatPrice(totalPaymentAmount)}
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;
