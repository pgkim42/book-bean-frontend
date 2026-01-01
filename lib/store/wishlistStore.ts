'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../services/api';

// Type definitions
interface WishlistItem {
  id: number;
  bookId: number;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  addedAt: string;
}

interface WishlistState {
  wishlist: WishlistItem[];
  loading: boolean;
  error: string | null;
}

interface WishlistActions {
  fetchWishlist: () => Promise<void>;
  addToWishlist: (bookId: number) => Promise<boolean>;
  removeFromWishlist: (bookId: number) => Promise<boolean>;
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
          const response: any = await api.get('/wishlist/my');
          set({
            wishlist: response.data || [],
            loading: false,
          });
        } catch (error: any) {
          set({ error: error.message, loading: false, wishlist: [] });
        }
      },

      addToWishlist: async (bookId) => {
        try {
          await api.post('/wishlist/add', { bookId });
          await get().fetchWishlist();
          return true;
        } catch (error: any) {
          set({ error: error.message });
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
        } catch (error: any) {
          set({ error: error.message });
          return false;
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
