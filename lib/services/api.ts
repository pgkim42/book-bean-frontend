'use client';

import axios from 'axios';
import { getToken, clearAuth } from '../store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Axios 인스턴스
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request: 토큰 첨부
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: 에러 처리
api.interceptors.response.use(
  (response) => response.data, // ApiResponse 전체 반환
  (error) => {
    // 401 → 인증 실패
    if (error.response?.status === 401) {
      clearAuth();
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    const message = error.response?.data?.message || error.message || '오류 발생';
    return Promise.reject({ status: error.response?.status, message });
  }
);

export default api;
