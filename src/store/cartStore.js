import { create } from 'zustand';
import cartService from '../services/cartService';

const useCartStore = create((set, get) => ({
  // State
  cartSummary: null, // CartSummaryDto
  items: [], // CartItemResponseDto[]
  loading: false,
  error: null,

  // Actions
  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const response = await cartService.getMyCart();
      // response.data = CartSummaryDto
      set({
        cartSummary: response.data,
        items: response.data?.items || [],
        loading: false
      });
    } catch (error) {
      set({ error: error.message, loading: false, items: [] });
    }
  },

  addToCart: async (data) => {
    try {
      await cartService.addToCart(data);
      await get().fetchCart(); // 장바구니 새로고침
      return true;
    } catch (error) {
      set({ error: error.message });
      return false;
    }
  },

  updateCartItem: async (itemId, quantity) => {
    try {
      await cartService.updateCartItem(itemId, quantity);
      await get().fetchCart(); // 장바구니 새로고침
      return true;
    } catch (error) {
      set({ error: error.message });
      return false;
    }
  },

  removeCartItem: async (itemId) => {
    try {
      await cartService.removeCartItem(itemId);
      await get().fetchCart(); // 장바구니 새로고침
      return true;
    } catch (error) {
      set({ error: error.message });
      return false;
    }
  },

  clearCart: async () => {
    try {
      await cartService.clearCart();
      set({ cartSummary: null, items: [] });
      return true;
    } catch (error) {
      set({ error: error.message });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useCartStore;
