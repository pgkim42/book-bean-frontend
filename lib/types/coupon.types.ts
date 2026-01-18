// Coupon Types

export type CouponDiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';
export type CouponStatus = 'ACTIVE' | 'EXPIRED' | 'USED';

export interface Coupon {
  id: number;
  name: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  status: CouponStatus;
  validFrom: string;
  validUntil: string;
}
