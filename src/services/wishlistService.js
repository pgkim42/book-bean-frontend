import api from './api';

const wishlistService = {
  // 위시리스트 조회
  getWishlist: async () => {
    return await api.get('/wishlist');
  },

  // 위시리스트에 추가
  addToWishlist: async (bookId) => {
    return await api.post('/wishlist', { bookId });
  },

  // 위시리스트에서 제거
  removeFromWishlist: async (bookId) => {
    return await api.delete(`/wishlist/${bookId}`);
  },

  // 위시리스트 전체 삭제
  clearWishlist: async () => {
    return await api.delete('/wishlist');
  },

  // 위시리스트 전체를 장바구니에 추가
  addWishlistToCart: async () => {
    return await api.post('/wishlist/add-to-cart');
  },

  // 특정 도서가 위시리스트에 있는지 확인
  isInWishlist: async (bookId) => {
    try {
      const response = await wishlistService.getWishlist();
      const wishlist = response.data || [];
      return wishlist.some((book) => book.id === bookId);
    } catch (error) {
      return false;
    }
  },
};

export default wishlistService;
