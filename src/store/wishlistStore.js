import { create } from 'zustand';
import wishlistService from '../services/wishlistService';
import storage from '../utils/localStorage';

const useWishlistStore = create((set, get) => ({
  // State
  wishlist: [], // 도서 ID 배열 또는 도서 객체 배열
  loading: false,
  error: null,
  isAuthenticated: false,

  // 초기화 (로그인 상태에 따라)
  initialize: async (isAuth) => {
    set({ isAuthenticated: isAuth });

    if (isAuth) {
      // 로그인 사용자: 서버에서 가져오기
      await get().fetchWishlist();

      // localStorage의 위시리스트를 서버와 동기화
      const localWishlist = storage.getWishlist();
      if (localWishlist.length > 0) {
        await get().syncLocalToServer(localWishlist);
      }
    } else {
      // 비로그인 사용자: localStorage에서 가져오기
      const localWishlist = storage.getWishlist();
      set({ wishlist: localWishlist });
    }
  },

  // 서버에서 위시리스트 가져오기 (로그인 사용자)
  fetchWishlist: async () => {
    set({ loading: true, error: null });
    try {
      const response = await wishlistService.getWishlist();
      const books = response.data || [];
      // 도서 ID만 추출
      const bookIds = books.map((book) => book.id);
      set({ wishlist: bookIds, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // localStorage의 위시리스트를 서버와 동기화
  syncLocalToServer: async (localWishlist) => {
    try {
      for (const bookId of localWishlist) {
        await wishlistService.addToWishlist(bookId);
      }
      // 동기화 후 localStorage 클리어
      storage.clearWishlist();
      // 서버에서 다시 가져오기
      await get().fetchWishlist();
    } catch (error) {
      console.error('Failed to sync wishlist:', error);
    }
  },

  // 위시리스트에 추가
  addToWishlist: async (bookId) => {
    const { isAuthenticated } = get();

    try {
      if (isAuthenticated) {
        // 로그인 사용자: 서버에 추가
        await wishlistService.addToWishlist(bookId);
        await get().fetchWishlist();
      } else {
        // 비로그인 사용자: localStorage에 추가
        storage.addToWishlist(bookId);
        const wishlist = storage.getWishlist();
        set({ wishlist });
      }
      return true;
    } catch (error) {
      set({ error: error.message });
      return false;
    }
  },

  // 위시리스트에서 제거
  removeFromWishlist: async (bookId) => {
    const { isAuthenticated } = get();

    try {
      if (isAuthenticated) {
        // 로그인 사용자: 서버에서 제거
        await wishlistService.removeFromWishlist(bookId);
        await get().fetchWishlist();
      } else {
        // 비로그인 사용자: localStorage에서 제거
        storage.removeFromWishlist(bookId);
        const wishlist = storage.getWishlist();
        set({ wishlist });
      }
      return true;
    } catch (error) {
      set({ error: error.message });
      return false;
    }
  },

  // 위시리스트 전체 삭제
  clearWishlist: async () => {
    const { isAuthenticated } = get();

    try {
      if (isAuthenticated) {
        await wishlistService.clearWishlist();
      } else {
        storage.clearWishlist();
      }
      set({ wishlist: [] });
      return true;
    } catch (error) {
      set({ error: error.message });
      return false;
    }
  },

  // 위시리스트 전체를 장바구니에 추가
  addWishlistToCart: async () => {
    const { isAuthenticated } = get();

    if (!isAuthenticated) {
      return false;
    }

    try {
      await wishlistService.addWishlistToCart();
      return true;
    } catch (error) {
      set({ error: error.message });
      return false;
    }
  },

  // 특정 도서가 위시리스트에 있는지 확인
  isInWishlist: (bookId) => {
    const { wishlist } = get();
    return wishlist.includes(bookId);
  },

  // 위시리스트 토글
  toggleWishlist: async (bookId) => {
    const isIn = get().isInWishlist(bookId);
    if (isIn) {
      return await get().removeFromWishlist(bookId);
    } else {
      return await get().addToWishlist(bookId);
    }
  },

  clearError: () => set({ error: null }),
}));

export default useWishlistStore;
