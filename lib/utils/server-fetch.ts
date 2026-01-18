/**
 * Server Component용 데이터 페칭 유틸리티
 *
 * Next.js 서버 컴포넌트에서 사용하는 데이터 페칭 함수들입니다.
 * 네이티브 fetch API와 Next.js 캐싱 옵션을 활용합니다.
 */

import { API_BASE_URL } from './constants';

/**
 * 서버 컴포넌트용 API 응답 타입
 */
export interface ServerApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * 도서 목록 페이지네이션 응답 타입
 */
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 타입 임포트 (서버 컴포넌트에서도 사용)
import type { Book } from '../types';

/**
 * 도서 단건 조회 (서버 컴포넌트용)
 * @param id 도서 ID
 * @returns 도서 정보
 * @throws 도서를 찾을 수 없거나 API 요청이 실패한 경우
 */
export async function fetchBook(id: string | number): Promise<Book> {
  const response = await fetch(`${API_BASE_URL}/books/${id}`, {
    next: { revalidate: 300 }, // 5분 캐시
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('도서를 찾을 수 없습니다');
    }
    throw new Error('도서 정보를 불러오는데 실패했습니다');
  }

  const result: ServerApiResponse<Book> = await response.json();
  return result.data;
}

/**
 * 도서 목록 조회 (서버 컴포넌트용)
 * @param params 쿼리 파라미터
 * @returns 페이지네이션된 도서 목록
 */
export async function fetchBooks(
  params: {
    page?: number;
    size?: number;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    category?: number;
    keyword?: string;
  } = {}
): Promise<PageResponse<Book>> {
  const {
    page = 0,
    size = 12,
    sort = 'createdAt,desc',
    minPrice,
    maxPrice,
    minRating,
    category,
    keyword,
  } = params;

  // URL 경로 결정 (검색 vs 카테고리 vs 전체)
  let endpoint = '/books';
  if (keyword) {
    endpoint = '/books/search';
  } else if (category) {
    endpoint = `/books/category/${category}`;
  }

  // 쿼리 파라미터 구성
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort,
  });

  if (keyword) queryParams.set('keyword', keyword);
  if (minPrice !== undefined && minPrice > 0) queryParams.set('minPrice', minPrice.toString());
  if (maxPrice !== undefined && maxPrice < 100000) queryParams.set('maxPrice', maxPrice.toString());
  if (minRating !== undefined && minRating > 0) queryParams.set('minRating', minRating.toString());

  const url = `${API_BASE_URL}${endpoint}?${queryParams.toString()}`;

  const response = await fetch(url, {
    next: { revalidate: 60 }, // 1분 캐시 (목록은 더 짧게)
  });

  if (!response.ok) {
    throw new Error('도서 목록을 불러오는데 실패했습니다');
  }

  const result: ServerApiResponse<PageResponse<Book>> = await response.json();
  return result.data;
}

/**
 * 도서 검색 (서버 컴포넌트용)
 * @param keyword 검색 키워드
 * @param params 추가 쿼리 파라미터
 * @returns 페이지네이션된 검색 결과
 */
export async function searchBooks(
  keyword: string,
  params: {
    page?: number;
    size?: number;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
  } = {}
): Promise<PageResponse<Book>> {
  return fetchBooks({ ...params, keyword });
}

/**
 * 카테고리별 도서 조회 (서버 컴포넌트용)
 * @param categoryId 카테고리 ID
 * @param params 추가 쿼리 파라미터
 * @returns 페이지네이션된 도서 목록
 */
export async function fetchBooksByCategory(
  categoryId: number,
  params: {
    page?: number;
    size?: number;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
  } = {}
): Promise<PageResponse<Book>> {
  return fetchBooks({ ...params, category: categoryId });
}
