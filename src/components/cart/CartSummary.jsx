import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/formatters';
import Button from '../common/Button';

const CartSummary = ({ cartSummary }) => {
  const navigate = useNavigate();

  if (!cartSummary) {
    return null;
  }

  // 배송비 계산 (30,000원 이상 무료)
  const FREE_SHIPPING_THRESHOLD = 30000;
  const SHIPPING_FEE = 3000;
  const totalPrice = cartSummary.selectedTotalPrice || 0;
  const shippingFee = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  // 최종 결제 금액
  const finalPrice = totalPrice + shippingFee;

  // 무료 배송까지 남은 금액
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - totalPrice;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h2 className="text-xl font-bold mb-4">주문 요약</h2>

      <div className="space-y-3 mb-4 pb-4 border-b">
        <div className="flex justify-between text-gray-700">
          <span>상품 금액</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>배송비</span>
          <span className={shippingFee === 0 ? 'text-green-600 font-medium' : ''}>
            {shippingFee === 0 ? '무료' : formatPrice(shippingFee)}
          </span>
        </div>
      </div>

      {/* 무료 배송 안내 */}
      {shippingFee > 0 && remainingForFreeShipping > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-bold">{formatPrice(remainingForFreeShipping)}</span>
            {' '}더 담으면 <span className="font-bold">무료 배송</span>!
          </p>
          <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* 최종 금액 */}
      <div className="flex justify-between items-center mb-6 pt-4 border-t">
        <span className="text-lg font-bold">총 결제 금액</span>
        <span className="text-2xl font-bold text-primary-600">
          {formatPrice(finalPrice)}
        </span>
      </div>

      {/* 주문하기 버튼 */}
      <Button
        onClick={handleCheckout}
        size="lg"
        className="w-full flex items-center justify-center space-x-2"
        disabled={cartSummary.selectedItemCount === 0}
      >
        <ShoppingBag className="w-5 h-5" />
        <span>주문하기 ({cartSummary.selectedItemCount})</span>
      </Button>

      {/* 안내 사항 */}
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>• 30,000원 이상 구매 시 무료 배송</p>
        <p>• 도서/산간 지역은 추가 배송비가 발생할 수 있습니다</p>
      </div>
    </div>
  );
};

export default CartSummary;
