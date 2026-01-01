'use client';

import { create } from 'zustand';
import api from '../services/api';
import type { CartItem, CartSummary, CartItemAddRequest } from '../types';

interface CartState {
  cartSummary: CartSummary | null;
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

interface CartActions {
  fetchCart: () => Promise<void>;
  addToCart: (data: CartItemAddRequest) => Promise<boolean>;
  updateCartItem: (itemId: number, quantity: number) => Promise<boolean>;
  removeCartItem: (itemId: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  clearError: () => void;
}

type CartStore = CartState & CartActions;

const useCartStore = create<CartStore>()((set, get) => ({
  // State
  cartSummary: null,
  items: [],
  loading: false,
  error: null,

  // Actions
  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      // 백엔드: GET /api/v1/carts → CartSummaryDto 반환
      const response: any = await api.get('/carts');
      // api.ts 인터셉터가 response.data를 반환하므로, response가 곧 ApiResponse
      const cartData = response.data || response;
      set({
        cartSummary: cartData,
        items: cartData?.items || [],
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false, items: [] });
    }
  },

  addToCart: async (data) => {
    try {
      // 백엔드: POST /api/v1/carts/items
      await api.post('/carts/items', data);
      await get().fetchCart();
      return true;
    } catch (error: any) {
      set({ error: error.message });
      return false;
    }
  },

  updateCartItem: async (itemId, quantity) => {
    try {
      // 백엔드: PUT /api/v1/carts/items/{itemId}?quantity={quantity}
      await api.put(`/carts/items/${itemId}?quantity=${quantity}`);
      await get().fetchCart();
      return true;
    } catch (error: any) {
      set({ error: error.message });
      return false;
    }
  },

  removeCartItem: async (itemId) => {
    try {
      // 백엔드: DELETE /api/v1/carts/items/{itemId}
      await api.delete(`/carts/items/${itemId}`);
      await get().fetchCart();
      return true;
    } catch (error: any) {
      set({ error: error.message });
      return false;
    }
  },

  clearCart: async () => {
    try {
      // 백엔드: DELETE /api/v1/carts/items (전체 비우기)
      await api.delete('/carts/items');
      set({ cartSummary: null, items: [] });
      return true;
    } catch (error: any) {
      set({ error: error.message });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useCartStore;
