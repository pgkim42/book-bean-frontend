'use client';

import { create } from 'zustand';
import type { User, LoginCredentials, RegisterData } from '../types';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  hydrate: () => void;
}

type AuthStore = AuthState & AuthActions;

// Helper: localStorage 접근 (SSR 안전)
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(AUTH_USER_KEY);
  return data ? JSON.parse(data) : null;
};
const saveAuth = (token: string, user: User) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};
const clearAuth = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  // 레거시 키 정리
  localStorage.removeItem('auth-storage');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  localStorage.removeItem('user_info');
};

// Zustand 스토어 - 단순화
const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // 클라이언트 hydration: localStorage에서 상태 복원
  hydrate: () => {
    const token = getToken();
    const user = getUser();
    if (token && user) {
      set({ user, isAuthenticated: true });
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      // 직접 fetch 사용 (api.ts 인터셉터 우회)
      const res = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || '로그인 실패');
      }

      const { accessToken, userEmail, userRole } = data.data;
      const user: User = {
        email: userEmail,
        name: userEmail.split('@')[0],
        role: userRole,
      };

      // localStorage에 저장
      saveAuth(accessToken, user);

      set({ user, isAuthenticated: true, loading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message || '로그인 실패', loading: false });
      return false;
    }
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || '회원가입 실패');
      }

      set({ loading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  logout: () => {
    clearAuth();
    set({ user: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
// 토큰 getter 내보내기 (api.ts에서 사용)
export { getToken, clearAuth };
