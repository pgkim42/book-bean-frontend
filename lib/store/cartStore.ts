'use client';

import { create } from 'zustand';
import api from '../services/api';

// Type definitions
interface CartItem {
  id: number;
  bookId: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartSummary {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

interface CartState {
  cartSummary: CartSummary | null;
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

interface CartActions {
  fetchCart: () => Promise<void>;
  addToCart: (data: { bookId: number; quantity: number }) => Promise<boolean>;
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
      const response: any = await api.get('/cart/my');
      set({
        cartSummary: response.data,
        items: response.data?.items || [],
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false, items: [] });
    }
  },

  addToCart: async (data) => {
    try {
      await api.post('/cart/items', data);
      await get().fetchCart();
      return true;
    } catch (error: any) {
      set({ error: error.message });
      return false;
    }
  },

  updateCartItem: async (itemId, quantity) => {
    try {
      await api.put(`/cart/items/${itemId}`, { quantity });
      await get().fetchCart();
      return true;
    } catch (error: any) {
      set({ error: error.message });
      return false;
    }
  },

  removeCartItem: async (itemId) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      await get().fetchCart();
      return true;
    } catch (error: any) {
      set({ error: error.message });
      return false;
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart/clear');
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
