import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// 날짜 포맷팅
export const formatDate = (date, formatStr = 'yyyy-MM-dd') => {
  if (!date) return '';
  return format(new Date(date), formatStr, { locale: ko });
};

export const formatDateTime = (date) => {
  return formatDate(date, 'yyyy-MM-dd HH:mm:ss');
};

// 가격 포맷팅
export const formatPrice = (price) => {
  if (price === null || price === undefined) return '0원';
  return `${Number(price).toLocaleString('ko-KR')}원`;
};

// 전화번호 포맷팅
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phone;
};

// 문자열 자르기
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
