import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터: JWT 토큰 자동 첨부
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터: 에러 처리
api.interceptors.response.use(
  (response) => {
    return response.data; // ApiResponse<T> 형식에서 data 추출
  },
  (error) => {
    // 401 Unauthorized: 토큰 만료 또는 인증 실패
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }

    // 에러 메시지 추출
    const errorMessage =
      error.response?.data?.message || error.message || '오류가 발생했습니다.';

    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data,
    });
  }
);

export default api;
