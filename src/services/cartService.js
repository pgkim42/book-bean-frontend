import api from './api';

const cartService = {
  // 내 장바구니 조회
  getMyCart: async () => {
    return await api.get('/carts');
  },

  // 장바구니에 아이템 추가
  addToCart: async (data) => {
    return await api.post('/carts/items', data);
  },

  // 장바구니 아이템 수량 변경
  updateCartItem: async (itemId, quantity) => {
    return await api.put(`/carts/items/${itemId}`, null, {
      params: { quantity }
    });
  },

  // 장바구니 아이템 삭제
  removeCartItem: async (itemId) => {
    return await api.delete(`/carts/items/${itemId}`);
  },

  // 장바구니 전체 삭제
  clearCart: async () => {
    return await api.delete('/carts/items');
  },
};

export default cartService;
