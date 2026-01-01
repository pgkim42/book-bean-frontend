import api from './api';

const couponService = {
  /**
   * 내 쿠폰 목록 조회
   * 백엔드: GET /api/v1/coupons/my
   */
  getMyCoupons: async () => {
    const response = await api.get('/coupons/my');
    // api.ts 인터셉터가 response.data를 반환하므로, response가 곧 ApiResponse
    return response.data || response;
  },

  /**
   * 사용 가능한 내 쿠폰 목록 조회
   * 백엔드: GET /api/v1/coupons/my/available
   */
  getMyAvailableCoupons: async () => {
    const response = await api.get('/coupons/my/available');
    return response.data || response;
  },

  /**
   * 쿠폰 코드 등록
   * 백엔드: POST /api/v1/coupons/register
   */
  registerCoupon: async (couponCode: string) => {
    const response = await api.post('/coupons/register', { couponCode });
    return response.data || response;
  },

  /**
   * 할인 금액 계산 (미리보기)
   * 백엔드: GET /api/v1/coupons/{userCouponId}/calculate
   */
  calculateDiscount: async (userCouponId: string | number, orderAmount: number, deliveryFee: number) => {
    const response = await api.get(`/coupons/${userCouponId}/calculate`, {
      params: { orderAmount, deliveryFee }
    });
    return response.data || response;
  }
};

export default couponService;
