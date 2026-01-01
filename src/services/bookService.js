import api from './api';

const bookService = {
  // 도서 목록 조회 (페이지네이션 + 가격 필터)
  getAllBooks: async (params = {}) => {
    const { page = 0, size = 10, sort = 'createdAt,desc', minPrice, maxPrice } = params;
    const queryParams = { page, size, sort };
    if (minPrice !== undefined) queryParams.minPrice = minPrice;
    if (maxPrice !== undefined) queryParams.maxPrice = maxPrice;
    return await api.get('/books', { params: queryParams });
  },

  // 도서 단건 조회
  getBook: async (id) => {
    return await api.get(`/books/${id}`);
  },

  // 카테고리별 도서 조회 (가격 필터 지원)
  getBooksByCategory: async (categoryId, params = {}) => {
    const { page = 0, size = 10, sort = 'createdAt,desc', minPrice, maxPrice } = params;
    const queryParams = { page, size, sort };
    if (minPrice !== undefined) queryParams.minPrice = minPrice;
    if (maxPrice !== undefined) queryParams.maxPrice = maxPrice;
    return await api.get(`/books/category/${categoryId}`, { params: queryParams });
  },

  // 도서 검색 (가격 필터 지원)
  searchBooks: async (keyword, params = {}) => {
    const { page = 0, size = 10, sort = 'createdAt,desc', minPrice, maxPrice } = params;
    const queryParams = { keyword, page, size, sort };
    if (minPrice !== undefined) queryParams.minPrice = minPrice;
    if (maxPrice !== undefined) queryParams.maxPrice = maxPrice;
    return await api.get('/books/search', { params: queryParams });
  },

  // 도서 등록 (관리자)
  createBook: async (data) => {
    return await api.post('/books', data);
  },

  // 도서 수정 (관리자)
  updateBook: async (id, data) => {
    return await api.put(`/books/${id}`, data);
  },

  // 도서 삭제 (관리자)
  deleteBook: async (id) => {
    return await api.delete(`/books/${id}`);
  },
};

export default bookService;
