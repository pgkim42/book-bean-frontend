'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../services/api';
import type { WishlistItem, WishlistState } from '../types';
import type { ApiResponse } from '../types';

interface WishlistActions {
  fetchWishlist: () => Promise<void>;
  addToWishlist: (bookId: number) => Promise<boolean>;
  removeFromWishlist: (bookId: number) => Promise<boolean>;
  toggleWishlist: (bookId: number) => Promise<boolean>;
  isInWishlist: (bookId: number) => boolean;
  clearError: () => void;
}

type WishlistStore = WishlistState & WishlistActions;

const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      // State
      wishlist: [],
      loading: false,
      error: null,

      // Actions
      fetchWishlist: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.get<ApiResponse<WishlistItem[]>>('/wishlist/my');
          set({
            wishlist: response.data || [],
            loading: false,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : '위시리스트를 불러오는데 실패했습니다';
          set({ error: message, loading: false, wishlist: [] });
        }
      },

      addToWishlist: async (bookId) => {
        try {
          await api.post('/wishlist/add', { bookId });
          await get().fetchWishlist();
          return true;
        } catch (error) {
          const message = error instanceof Error ? error.message : '오류가 발생했습니다';
          set({ error: message });
          return false;
        }
      },

      removeFromWishlist: async (bookId) => {
        try {
          await api.delete(`/wishlist/remove/${bookId}`);
          set((state) => ({
            wishlist: state.wishlist.filter((item) => item.bookId !== bookId),
          }));
          return true;
        } catch (error) {
          const message = error instanceof Error ? error.message : '오류가 발생했습니다';
          set({ error: message });
          return false;
        }
      },

      toggleWishlist: async (bookId: number) => {
        const isInWishlist = get().isInWishlist(bookId);

        if (isInWishlist) {
          return await get().removeFromWishlist(bookId);
        } else {
          return await get().addToWishlist(bookId);
        }
      },

      isInWishlist: (bookId) => {
        return get().wishlist.some((item) => item.bookId === bookId);
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useWishlistStore;
