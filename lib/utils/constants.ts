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

// Toast Messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: '로그인 성공!',
    REGISTER: '회원가입 성공! 로그인해주세요.',
    LOGOUT: '로그아웃되었습니다',
    PROFILE_UPDATED: '프로필이 수정되었습니다',
    REVIEW_CREATED: '리뷰가 작성되었습니다',
    REVIEW_UPDATED: '리뷰가 수정되었습니다',
    REVIEW_DELETED: '리뷰가 삭제되었습니다',
    CART_ADDED: '장바구니에 담겼습니다',
    CART_UPDATED: '장바구니가 수정되었습니다',
    CART_REMOVED: '장바구니에서 삭제되었습니다',
    ORDER_CREATED: '주문이 완료되었습니다!',
    ORDER_CANCELLED: '주문이 취소되었습니다',
    WISHLIST_ADDED: '위시리스트에 추가되었습니다',
    WISHLIST_REMOVED: '위시리스트에서 삭제되었습니다',
  },
  ERROR: {
    DEFAULT: '오류가 발생했습니다',
    LOGIN_FAILED: '로그인 실패. 이메일과 비밀번호를 확인해주세요.',
    REGISTER_FAILED: '회원가입 실패. 다시 시도해주세요.',
    LOGOUT_REQUIRED: '로그인이 필요합니다',
    PROFILE_LOAD_FAILED: '프로필 정보를 불러올 수 없습니다',
    PROFILE_UPDATE_FAILED: '프로필 수정에 실패했습니다',
    REVIEW_LOAD_FAILED: '리뷰를 불러오는데 실패했습니다',
    REVIEW_CREATE_FAILED: '리뷰 작성에 실패했습니다',
    REVIEW_UPDATE_FAILED: '리뷰 수정에 실패했습니다',
    REVIEW_DELETE_FAILED: '리뷰 삭제에 실패했습니다',
    CART_LOAD_FAILED: '장바구니를 불러오는데 실패했습니다',
    CART_EMPTY: '장바구니가 비어있습니다',
    ORDER_LOAD_FAILED: '주문 정보를 불러올 수 없습니다',
    ORDER_CREATE_FAILED: '주문에 실패했습니다',
    ORDER_CANCEL_FAILED: '주문 취소에 실패했습니다',
    BOOK_LOAD_FAILED: '도서 정보를 불러올 수 없습니다',
    BOOK_LIST_LOAD_FAILED: '도서 목록을 불러오는데 실패했습니다',
    WISHLIST_LOAD_FAILED: '위시리스트를 불러오는데 실패했습니다',
    COUPON_APPLY_FAILED: '쿠폰 적용에 실패했습니다',
  },
  CONFIRM: {
    LOGOUT: '로그아웃 하시겠습니까?',
    DELETE_REVIEW: '리뷰를 삭제하시겠습니까?',
    DELETE_ACCOUNT: '정말로 탈퇴하시겠습니까?\n\n탈퇴하시면 모든 정보가 비활성화되며 복구할 수 없습니다.',
    REMOVE_CART_ITEM: '장바구니에서 삭제하시겠습니까?',
    CANCEL_ORDER: '정말 주문을 취소하시겠습니까?',
  },
} as const;

