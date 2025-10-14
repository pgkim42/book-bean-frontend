import { create } from 'zustand';
import { STORAGE_KEYS } from '../utils/constants';
import authService from '../services/authService';

const useAuthStore = create((set, get) => ({
  // State
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || null,
  token: localStorage.getItem(STORAGE_KEYS.TOKEN) || null,
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.TOKEN),
  loading: false,
  error: null,

  // Actions
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(credentials);
      const { accessToken, userEmail, userRole } = response.data;

      // userName이 없으므로 email에서 추출하거나 email을 name으로 사용
      const userName = userEmail.split('@')[0];
      const user = { email: userEmail, name: userName, role: userRole };

      // LocalStorage에 저장
      localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      set({
        user,
        token: accessToken,
        isAuthenticated: true,
        loading: false,
      });

      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      await authService.register(data);
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
