import api from './api';

const orderService = {
  // 주문 생성
  createOrder: async (data) => {
    return await api.post('/orders', data);
  },

  // 주문 단건 조회
  getOrder: async (id) => {
    return await api.get(`/orders/${id}`);
  },

  // 주문번호로 조회
  getOrderByNumber: async (orderNumber) => {
    return await api.get(`/orders/number/${orderNumber}`);
  },

  // 내 주문 목록 조회
  getMyOrders: async (params = {}) => {
    const { page = 0, size = 10, sort = 'createdAt,desc' } = params;
    return await api.get('/orders', { params: { page, size, sort } });
  },

  // 전체 주문 목록 조회 (관리자용)
  getAllOrders: async (params = {}) => {
    const { page = 0, size = 10, sort = 'createdAt,desc' } = params;
    return await api.get('/orders/admin', { params: { page, size, sort } });
  },

  // 주문 취소
  cancelOrder: async (id, reason) => {
    return await api.post(`/orders/${id}/cancel`, null, { params: { reason } });
  },

  // 결제 확인 (관리자)
  confirmPayment: async (id) => {
    return await api.post(`/orders/${id}/payment`);
  },

  // 배송 시작 (관리자)
  startShipping: async (id, trackingNumber) => {
    return await api.post(`/orders/${id}/shipping`, null, {
      params: { trackingNumber },
    });
  },

  // 배송 완료 (관리자)
  completeDelivery: async (id) => {
    return await api.post(`/orders/${id}/delivery`);
  },
};

export default orderService;
