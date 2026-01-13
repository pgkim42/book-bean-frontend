// API Base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_info',
};

// User Roles
export const USER_ROLES = {
  USER: 'ROLE_USER',
  ADMIN: 'ROLE_ADMIN',
};

// Order Status
export const ORDER_STATUS: Record<string, string> = {
  PENDING: '주문 대기',
  PAID: '결제 완료',
  SHIPPED: '배송 중',
  DELIVERED: '배송 완료',
  CANCELLED: '취소됨',
};

// Payment Method
export const PAYMENT_METHOD: Record<string, string> = {
  CARD: '신용카드',
  BANK_TRANSFER: '계좌이체',
  VIRTUAL_ACCOUNT: '가상계좌',
  MOBILE: '휴대폰결제',
};

// Payment Status
export const PAYMENT_STATUS: Record<string, string> = {
  PENDING: '결제 대기',
  COMPLETED: '결제 완료',
  FAILED: '결제 실패',
  CANCELLED: '결제 취소',
};

// Book Status
export const BOOK_STATUS: Record<string, string> = {
  AVAILABLE: '판매중',
  OUT_OF_STOCK: '품절',
  DISCONTINUED: '절판',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

