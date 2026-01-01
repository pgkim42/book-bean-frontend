import api from './api';

const couponService = {
  /**
   * 내 쿠폰 목록 조회
   */
  getMyCoupons: async () => {
    const response = await api.get('/coupons/my');
    return response.data;
  },

  /**
   * 사용 가능한 내 쿠폰 목록 조회
   */
  getMyAvailableCoupons: async () => {
    const response = await api.get('/coupons/my/available');
    return response.data;
  },

  /**
   * 쿠폰 코드 등록
   */
  registerCoupon: async (couponCode) => {
    const response = await api.post('/coupons/register', { couponCode });
    return response.data;
  },

  /**
   * 할인 금액 계산 (미리보기)
   */
  calculateDiscount: async (userCouponId, orderAmount, deliveryFee) => {
    const response = await api.get(`/coupons/${userCouponId}/calculate`, {
      params: { orderAmount, deliveryFee }
    });
    return response.data;
  }
};

export default couponService;
