'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '../utils/storage';
import api from '../services/api';

// Type definitions
interface User {
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  register: (data: { email: string; password: string; name: string }) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response: any = await api.post('/auth/login', credentials);
          const { accessToken, userEmail, userRole } = response.data;

          // userName이 없으므로 email에서 추출
          const userName = userEmail.split('@')[0];
          const user = { email: userEmail, name: userName, role: userRole };

          set({
            user,
            token: accessToken,
            isAuthenticated: true,
            loading: false,
          });

          return true;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          return false;
        }
      },

      register: async (data) => {
        set({ loading: true, error: null });
        try {
          await api.post('/auth/register', data);
          set({ loading: false });
          return true;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          return false;
        }
      },

      logout: () => {
        storage.clearAuth();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
