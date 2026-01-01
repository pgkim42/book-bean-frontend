import api from './api';
import type { Book, BookListParams, PaginatedResponse } from '../types';

const bookService = {
  // 도서 목록 조회 (페이지네이션 + 가격 필터)
  getAllBooks: async (params: BookListParams = {}): Promise<PaginatedResponse<Book>> => {
    const { page = 0, size = 10, sort = 'createdAt,desc', minPrice, maxPrice, minRating } = params;
    const queryParams: Record<string, any> = { page, size, sort };
    if (minPrice !== undefined) queryParams.minPrice = minPrice;
    if (maxPrice !== undefined) queryParams.maxPrice = maxPrice;
    if (minRating !== undefined) queryParams.minRating = minRating;
    return await api.get('/books', { params: queryParams });
  },

  // 도서 단건 조회
  getBook: async (id: string | number): Promise<Book> => {
    return await api.get(`/books/${id}`);
  },

  // 카테고리별 도서 조회 (가격 필터 지원)
  getBooksByCategory: async (categoryId: number, params: BookListParams = {}): Promise<PaginatedResponse<Book>> => {
    const { page = 0, size = 10, sort = 'createdAt,desc', minPrice, maxPrice, minRating } = params;
    const queryParams: Record<string, any> = { page, size, sort };
    if (minPrice !== undefined) queryParams.minPrice = minPrice;
    if (maxPrice !== undefined) queryParams.maxPrice = maxPrice;
    if (minRating !== undefined) queryParams.minRating = minRating;
    return await api.get(`/books/category/${categoryId}`, { params: queryParams });
  },

  // 도서 검색 (가격 필터 지원)
  searchBooks: async (keyword: string, params: BookListParams = {}): Promise<PaginatedResponse<Book>> => {
    const { page = 0, size = 10, sort = 'createdAt,desc', minPrice, maxPrice, minRating } = params;
    const queryParams: Record<string, any> = { keyword, page, size, sort };
    if (minPrice !== undefined) queryParams.minPrice = minPrice;
    if (maxPrice !== undefined) queryParams.maxPrice = maxPrice;
    if (minRating !== undefined) queryParams.minRating = minRating;
    return await api.get('/books/search', { params: queryParams });
  },

  // 도서 등록 (관리자)
  createBook: async (data: Partial<Book>): Promise<Book> => {
    return await api.post('/books', data);
  },

  // 도서 수정 (관리자)
  updateBook: async (id: number, data: Partial<Book>): Promise<Book> => {
    return await api.put(`/books/${id}`, data);
  },

  // 도서 삭제 (관리자)
  deleteBook: async (id: number): Promise<void> => {
    return await api.delete(`/books/${id}`);
  },
};

export default bookService;
